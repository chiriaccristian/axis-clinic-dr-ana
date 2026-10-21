# @org/api-data

Data layer of the CRM API: Drizzle ORM over PostgreSQL (Cloud SQL in
production) and private Cloud Storage for medical files.

- `src/lib/schema.ts`: tables. Every business row has `tenant_id`, and every
  repository method takes `tenantId` and filters by it.
- Consents are append-only; consent texts are versioned and hashed.
- Media files: metadata in Postgres, the file in the bucket under
  `tenants/<tenantId>/patients/<patientId>/<mediaId>` (IDs only). Upload and
  view go through short-lived signed URLs; views and changes are audited.

## Migrations

After changing `schema.ts`:

```bash
npx drizzle-kit generate --config packages/api/data/drizzle.config.ts
```

Commit the generated SQL in `migrations/`. The API applies pending
migrations at startup when a database is configured (see
`apps/api/.env.example`).

## Tests

`npx nx test @org/api-data` runs against an in-memory Postgres (PGlite), with
fictional data only.
