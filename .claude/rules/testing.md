---
paths:
  - "**/*.{spec,test}.{ts,tsx}"
  - "apps/*-e2e/**"
  - "**/vitest.config.*"
  - "**/playwright.config.*"
---

# Testing

- **Unit (Vitest):** business logic, utilities and validation have tests.
- **Components (Testing Library):** test behavior visible to the user, not implementation details. Prefer `getByRole` / `getByLabelText`.
- **API (Supertest):** every endpoint has tests for authorization cases too: unauthenticated, other tenant, wrong role.
- **Tenant isolation:** at least one test proves a tenant cannot read or modify another tenant's data.
- **E2E (Playwright)** for critical flows: the doctor's public page, appointment request, CRM login, creating a patient and an appointment.
- Every bug fix comes with a test that would have caught it.
- Test data is **fictional only**; use factories/fixtures, never copies of real data.
- Tests don't depend on run order or the current time (freeze time with fake timers).
