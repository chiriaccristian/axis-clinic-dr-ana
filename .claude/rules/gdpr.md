# Medical data and GDPR (mandatory, applies everywhere)

Health data is a special category of personal data (GDPR Art. 9). Any code that touches patient data must follow these rules:

- **Never log** personal or medical data (names, national ID/CNP, phone, email, diagnoses, notes). Log IDs only.
- Never put personal data in URLs, query strings, cache keys or error messages.
- HTTPS only; session cookies are `httpOnly`, `secure`, `sameSite`.
- Security headers and rate limiting on public endpoints (appointment request form, login).
- Store sensitive fields encrypted wherever possible.
- Access to medical records is recorded in an **audit log** (who, what, when).
- Design for patient rights from the start: data export, deletion/anonymization, consent tracking (marketing consent separate from treatment consent).
- Tenant isolation is a security requirement: a doctor must never see another doctor's data.
- Test data, seeds and examples are **always fictional**. Never use real patient data.
