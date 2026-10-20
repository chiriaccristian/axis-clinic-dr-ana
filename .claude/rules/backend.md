---
paths:
  - "apps/*api*/**"
  - "apps/*server*/**"
  - "packages/api/**"
  - "libs/api/**"
---

# Backend (Express 4)

- Domain modules structured as `router` → `controller` → `service` → `repository`.
- Repositories receive `tenantId` explicitly and filter by it in **every** query.
- Validate every input (body, params, query) at the boundary, using the shared schemas from `packages/shared`.
- Errors go through a central middleware. Consistent shape: `{ error: { code, message } }`, with no stack traces or internal data in responses.
- Express 4 does not catch rejected promises automatically: async handlers must forward errors (`next(err)` or a shared wrapper).
- Check authentication, role and tenant on the server at every CRM endpoint.
- Configuration comes only from environment variables, validated at startup. No secrets in code or git; update `.env.example` with every new variable.
- Use the shared logger, not `console`. Never log patient data.
- Builds use esbuild (`@nx/esbuild`); don't introduce another bundler.
