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
