# CLAUDE.md

Instructions for AI agents writing code in this repository.
Detailed rules per area: `.claude/rules/` (backend, frontend, testing, GDPR).

## Project

- **Today:** a presentation website for a single doctor.
- **Direction:** a platform that, alongside the presentation site, offers a **CRM for any doctor** (patients, appointments, consultations, documents, notifications).
- **Nothing is hardcoded for a single doctor.** Name, specialty, services, prices, schedule, colors and copy come from configuration/data.

## Stack and limits

Nx 23 monorepo with npm workspaces · Node >= 24 · TypeScript 6 strict · React 19 + react-router-dom 6 + Vite 8 + Tailwind 4 · Express 4 + esbuild · Vitest 4, Supertest, Playwright · ESLint 9 flat config, Prettier.

- **No major version upgrades** (React Router 7, Express 5, etc.) and no new dependencies without explaining why and getting approval.
- The database, ORM, authentication and email/SMS providers are **not chosen yet**. Propose options with trade-offs and wait for a decision; until then, domain code depends on repository interfaces.

## Monorepo organization

- Run `npx nx show projects` and `npx nx graph` before writing code; don't assume project names.
- `apps/` contain only composition (routing, bootstrap, config). Logic lives in `libs/` or `packages/`.
- Library types and what they may import:
  - `feature-*` → `ui`, `data-access`, `util`
  - `ui-*` → only `util` (no data fetching)
  - `data-access-*` → `util` and shared types
  - `util-*` → nothing internal
- Types and validation schemas shared by frontend and backend live in `packages/shared/*` (single source of truth).
- Boundaries are enforced with Nx tags (`scope:public-site`, `scope:crm`, `scope:api`, `scope:shared`, `type:*`) and `@nx/enforce-module-boundaries`.
- Cross-project imports only via the package name (`@org/...`), never via relative paths that leave the project.
- New projects only through Nx generators (`npx nx g @nx/react:lib ...`, `npx nx g @nx/node:lib ...`).

## Commands

```bash
npx nx serve <project>
npx nx test <project>
npx nx lint <project>
npx nx e2e <project-e2e>
npx nx affected -t lint test build     # must pass before calling a task done
npx nx format:write
```

## Target architecture: multi-doctor CRM

1. **Multi-tenancy:** each doctor/practice is a tenant. Every business entity has a `tenantId`, and tenant filtering happens in the repository, not the controller.
2. **Two surfaces:** a public site per doctor (no authentication) and the CRM app (authenticated, roles `owner` / `doctor` / `assistant`).
3. **CRM domains**, each as a `feature` / `data-access` / API set: patients, appointments and calendar, consultations/medical records, documents, services and pricing, notifications, practice settings.
4. **Authorization is checked on the server** at every endpoint (role + tenant). The frontend only hides UI.

## General conventions

- No `any` (use `unknown` + narrowing), no `@ts-ignore`.
- Code in **English**; user-facing text in **Romanian**, through translation keys.
- Files `kebab-case`, components `PascalCase`, hooks `useCamelCase`.
- No leftover `console.log`.

## How to work

- Read the existing code in the area and follow its style.
- Small, focused changes; don't refactor unrelated code.
- For larger features, propose a short plan first (libraries, data models, endpoints).
- Don't change `nx.json`, `tsconfig.base.json`, the ESLint config or CI without saying why.
- Don't run destructive commands (deleting data, `git push --force`, migrations against real environments).
- When finished, summarize what changed and which decisions remain open.
