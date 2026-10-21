# @org/api-auth

Login, sessions, roles and invitations for the CRM API.

- Roles: `super_admin` (platform, no practice), `manager` (whole practice),
  `doctor`. Every route checks role and practice on the server.
- Login with username + password (scrypt). Five failed attempts lock the
  account for 15 minutes; login is also rate limited per IP.
- Sessions: random token in an `httpOnly`, `SameSite=Strict` cookie
  (`__Host-` prefixed in production), 12 hours; only its SHA-256 is stored.
- New accounts come from single-use invitations (7 days). Emails go through
  Brevo when `BREVO_API_KEY` and `MAIL_FROM` are set.

Routes (under `/api`): `POST /auth/login`, `POST /auth/logout`,
`GET /auth/me`, `POST /auth/accept-invitation`, `POST /invitations`,
`GET /users`, `GET /tenants`, `POST /tenants`.

Tests: `npx nx test @org/api-auth` (in-memory Postgres, fictional data).
