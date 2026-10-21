# API on Google Cloud Run

The API (`apps/api`) runs as a container on Cloud Run. The workflow
`.github/workflows/deploy-cloud-run.yml` builds `deploy/cloud-run/Dockerfile`
and deploys it:

| Branch    | GitHub environment | Google Cloud project         | Domain (later)      |
| --------- | ------------------ | ---------------------------- | ------------------- |
| `develop` | `test`             | e.g. `crm-ultra-clinic-test` | `crm-test.drana.ro` |
| `main`    | `production`       | e.g. `crm-ultra-clinic-prod` | `crm.drana.ro`      |

Until an environment has its variables, the workflow skips the deploy.

Region: `europe-west1` (Belgium). It has Cloud Run, Cloud SQL and Firebase
Hosting, and costs less than `europe-central2` (Warsaw).

## One-time setup, per Google Cloud project

Run in Cloud Shell (console.cloud.google.com, the `>_` icon), once for the
test project and once for the production project. Set `ENVIRONMENT` to `test`
or `production`.

```bash
PROJECT_ID=crm-ultra-clinic-test
ENVIRONMENT=test
REGION=europe-west1
REPO=chiriaccristian/axis-clinic-dr-ana

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com sts.googleapis.com

gcloud artifacts repositories create api --repository-format=docker --location="$REGION"

gcloud iam service-accounts create github-deploy
SA="github-deploy@$PROJECT_ID.iam.gserviceaccount.com"
sleep 30 # the new service account takes a few seconds to become visible to IAM
for ROLE in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="$ROLE" --condition=None
done

# Keyless login from GitHub Actions, limited to this repo and this environment.
gcloud iam workload-identity-pools create github --location=global
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global --workload-identity-pool=github \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.environment=assertion.environment" \
  --attribute-condition="assertion.repository=='$REPO' && assertion.environment=='$ENVIRONMENT'"

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "$SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"

echo "GCP_PROJECT_ID=$PROJECT_ID"
echo "GCP_WIF_PROVIDER=projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github"
echo "GCP_SERVICE_ACCOUNT=$SA"
```

Then in GitHub: Settings → Environments → create `test` (and `production`) →
add the three printed values as **environment variables** (not secrets; none
of them is a password). For `production`, add yourself as a required reviewer
so every production deploy waits for approval.

## Database and medical files

Patient data and consents live in **Cloud SQL for PostgreSQL**. Photos,
X-rays and signed consent PDFs live in a **private Cloud Storage bucket**;
the database keeps only their metadata (patient, type, date, object path,
hash). The bucket is never public: the API checks access, then hands out a
signed URL that expires within minutes.

Everything stays in `europe-west1`. Use only fictional data in the test
project.

Run in Cloud Shell, after the one-time setup above. Start with the test
project.

```bash
PROJECT_ID=crm-ultra-clinic-test
ENVIRONMENT=test            # or production
REGION=europe-west1
INSTANCE=crm-db
DATABASE=crm
BUCKET="$PROJECT_ID-medical-files"
CORS_ORIGINS='"https://crm-test.drana.ro", "http://localhost:4200"'
# For production: CORS_ORIGINS='"https://crm.drana.ro"'

gcloud config set project "$PROJECT_ID"
gcloud services enable sqladmin.googleapis.com storage.googleapis.com \
  secretmanager.googleapis.com iam.googleapis.com

# Service account the API runs as (least privilege, one per project).
gcloud iam service-accounts create api-runtime
RUNTIME_SA="api-runtime@$PROJECT_ID.iam.gserviceaccount.com"
sleep 30

# --- Cloud SQL (PostgreSQL 17) ---
# Test: smallest shared-core instance, daily backups.
# Production: dedicated 1 vCPU / 3.75 GB, backups + point-in-time recovery.
if [ "$ENVIRONMENT" = production ]; then
  SIZE_FLAGS="--tier=db-custom-1-3840 --enable-point-in-time-recovery --retained-backups-count=14"
else
  SIZE_FLAGS="--tier=db-f1-micro --retained-backups-count=7"
fi
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '/+=' | cut -c1-32)
gcloud sql instances create "$INSTANCE" \
  --database-version=POSTGRES_17 --edition=enterprise $SIZE_FLAGS \
  --region="$REGION" --storage-type=SSD --storage-size=10 --storage-auto-increase \
  --backup-start-time=02:00 --ssl-mode=ENCRYPTED_ONLY \
  --database-flags=cloudsql.iam_authentication=on \
  --deletion-protection --root-password="$POSTGRES_PASSWORD"
gcloud sql databases create "$DATABASE" --instance="$INSTANCE"

# Keep the admin password in Secret Manager, not in the shell history of anyone.
printf '%s' "$POSTGRES_PASSWORD" | gcloud secrets create crm-db-postgres-password \
  --replication-policy=user-managed --locations="$REGION" --data-file=-

# The API logs in with its service account (IAM auth), no password.
for ROLE in roles/cloudsql.client roles/cloudsql.instanceUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$RUNTIME_SA" --role="$ROLE" --condition=None
done
DB_IAM_USER="api-runtime@$PROJECT_ID.iam"
gcloud sql users create "$DB_IAM_USER" --instance="$INSTANCE" --type=cloud_iam_service_account

# Let the API user own its tables. Cloud Shell opens psql; the password comes
# from the variable above. If this step fails, run the same SQL in the console:
# SQL -> crm-db -> Cloud SQL Studio, user postgres, database crm.
PGPASSWORD="$POSTGRES_PASSWORD" gcloud sql connect "$INSTANCE" --user=postgres \
  --database="$DATABASE" --quiet <<SQL
GRANT ALL ON DATABASE $DATABASE TO "$DB_IAM_USER";
GRANT ALL ON SCHEMA public TO "$DB_IAM_USER";
SQL

# --- Cloud Storage for photos and X-rays ---
gcloud storage buckets create "gs://$BUCKET" --location="$REGION" \
  --uniform-bucket-level-access --public-access-prevention \
  --soft-delete-duration=30d
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$RUNTIME_SA" --role=roles/storage.objectUser
# Signed URLs are signed with the runtime account itself (no key files).
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --member="serviceAccount:$RUNTIME_SA" --role=roles/iam.serviceAccountTokenCreator
# Browser uploads go straight to the bucket through a signed URL.
cat > /tmp/cors.json <<JSON
[{"origin": [$CORS_ORIGINS], "method": ["GET", "PUT"],
  "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]
JSON
gcloud storage buckets update "gs://$BUCKET" --cors-file=/tmp/cors.json

unset POSTGRES_PASSWORD PGPASSWORD
echo "CLOUD_SQL_INSTANCE=$PROJECT_ID:$REGION:$INSTANCE"
echo "DB_NAME=$DATABASE"
echo "DB_IAM_USER=$DB_IAM_USER"
echo "MEDIA_BUCKET=$BUCKET"
echo "CLOUD_RUN_SERVICE_ACCOUNT=$RUNTIME_SA"
```

Add the five printed values as **variables** of the matching GitHub
environment (`test` or `production`). The next deploy then runs the API as
`api-runtime`, attaches the Cloud SQL instance and passes the values as
environment variables. Until they are set, the deploy works as before.

Also turn on access logging (who read which patient file): console → IAM &
Admin → Audit Logs → enable _Data Read_ and _Data Write_ for **Cloud SQL** and
**Google Cloud Storage**. Required in production, optional in test.

Encryption: both services encrypt at rest by default and the API connects
over TLS. Customer-managed keys (Cloud KMS) can be added for production later.

## After the first deploy

The service starts private. To let the public site call it:

```bash
gcloud run services add-iam-policy-binding api --region="$REGION" \
  --member=allUsers --role=roles/run.invoker
```

Keep the test service private until it has its own login.

Custom domains: Cloud Run domain mapping is still Preview. Use Firebase
Hosting in the same project (rewrite `/api/**` to the `api` service) to serve
`crm-test.drana.ro` and `crm.drana.ro`.
