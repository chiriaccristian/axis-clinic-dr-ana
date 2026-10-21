# Nx React Repository

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ A repository showcasing key [Nx](https://nx.dev) features for React monorepos ✨

## Finish your Nx platform setup

🚀 [Finish setting up your workspace](https://cloud.nx.app/connect/CqHpkOWlwR) to get faster builds with remote caching, distributed task execution, and self-healing CI. [Learn more about Nx Cloud](https://nx.dev/ci/intro/why-nx-cloud).

## 📦 Project Overview

This repository demonstrates a production-ready React monorepo with:

- **2 Applications**

  - `clinic` - React application for the new clinic landing experience
  - `crm` - React CRM app (login, invitations, users and practices)
  - `api` - Backend API (auth, database, file storage); also serves the built CRM

- **3 Libraries**

  - `@org/models` - Shared data models
  - `@org/api-products` - API product service library
  - `@org/shared-test-utils` - Shared testing utilities

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-fork-url>
cd <your-repository-name>

# Use the required Node.js version
nvm use

# Install dependencies
npm install

# Reset Nx daemon/cache if you previously ran with a different Node version
npm exec nx reset

# Serve the React clinic application
npm exec nx run @org/clinic:serve

# ...or you can serve the API separately
npm exec nx run @org/api:serve

# Build all projects
npm exec nx run-many -t build

# Run tests
npm exec nx run-many -t test

# Lint all projects
npm exec nx run-many -t lint

# Run tasks in parallel

npm exec nx run-many -t lint test build --parallel=3

# Visualize the project graph
npm exec nx graph
```

> This workspace requires Node.js `>=24.0.0`.

## 🌐 Run the public site locally

The public site (`apps/clinic`) is a static React app. It needs no database
and no API, so you can start it on its own.

1. **Prerequisites:** Node.js 24 or newer.
2. **Install dependencies** (once, or after `package.json` changes):

   ```bash
   npm ci
   ```

3. **Start the dev server:**

   ```bash
   npx nx serve @org/clinic
   ```

   Open http://localhost:4200. Changes reload in the browser as you save. Most
   of the site's text and images are configured in
   `apps/clinic/src/content/site-content.ts`.

4. **Check the production build** (optional, this is what gets uploaded to
   cPanel):

   ```bash
   npx nx build @org/clinic     # output in apps/clinic/dist, pages prerendered
   npx nx preview @org/clinic   # serves the build on http://localhost:4200
   ```

If port 4200 is already in use, stop the other process or run
`npx nx serve @org/clinic --port 4201`.

## 💻 Run the CRM locally

The CRM needs three things running: PostgreSQL, the API (`apps/api`, port 3333)
and the CRM app (`apps/crm`, port 4300). The CRM dev server proxies `/api` to
the API, so the session cookie works as it does in production.

### 1. Prerequisites

- Node.js 24 (`nvm use 24`)
- PostgreSQL 17 or 18. Any local install works. On macOS the simplest is
  [Postgres.app](https://postgresapp.com): create a server on port **5433**
  (keeps port 5432 free for other projects) and press **Initialize**.

### 2. Install dependencies

```bash
git checkout develop && git pull
npm ci
```

### 3. Create the database

```bash
# Postgres.app (use the version you installed: 17 or 18)
/Applications/Postgres.app/Contents/Versions/18/bin/createdb -p 5433 crm

# Any other install with createdb on the PATH
createdb -p 5433 crm
```

### 4. Configure the API

Copy `apps/api/.env.example` to `apps/api/.env` (git-ignored) and set at least:

```dotenv
HOST=localhost
PORT=3333
DATABASE_URL=postgres://localhost:5433/crm
APP_URL=http://localhost:4300

# First super admin, created at startup only if none exists yet.
# Local, fictional values only.
BOOTSTRAP_ADMIN_USERNAME=admin.local
BOOTSTRAP_ADMIN_EMAIL=admin@example.test
BOOTSTRAP_ADMIN_PASSWORD=parola-locala-123
```

If your PostgreSQL requires a password, use
`postgres://USER:PASSWORD@localhost:5433/crm`. Leave the Brevo variables unset
locally: invitations are not emailed, and the CRM shows the invitation link on
screen instead.

### 5. Start the API and the CRM

In two terminals:

```bash
npx nx serve @org/api   # http://localhost:3333
npx nx serve @org/crm   # http://localhost:4300
```

On the first start the API applies the database migrations and logs:

```
[ auth ] super admin created
[ ready ] http://localhost:3333
```

Open <http://localhost:4300> and log in with the bootstrap username and
password. Go to **Utilizatori → Clinici** to create a practice, then invite
managers and doctors into it.

### Troubleshooting

- **`API failed to start: Failed query: CREATE SCHEMA ... <- ECONNREFUSED`:**
  PostgreSQL is not running, or not on the port in `DATABASE_URL`.
- **`... password authentication failed`:** the user or password in
  `DATABASE_URL` is wrong.
- **`... database "crm" does not exist`:** run step 3.
- **Port already in use:** another PostgreSQL (for example in Docker) holds
  the port; pick a free one and update `DATABASE_URL`.
- **No `super admin created` line:** an admin already exists in this database.
  It is only created once.
- To start over with an empty database:
  `dropdb -p 5433 crm && createdb -p 5433 crm`.

You can run the public site at the same time (see above); it uses port 4200.

## 🌐 Deployment (cPanel)

This repository is configured for automatic deployment to cPanel using GitHub Actions.

### Setup instructions:

1.  **Create FTP credentials in cPanel**:
    - Log in to cPanel.
    - Go to **FTP Accounts**.
    - Create a new account or use an existing one.
    - Note the **FTP Server**, **Username** and **Password**.

2.  **Add "Secrets" in GitHub**:
    - Go to your repository on GitHub.
    - Navigate to **Settings** > **Secrets and variables** > **Actions**.
    - Add the following **Repository secrets**:
      - `FTP_SERVER`: Your server address (e.g. `ftp.yourdomain.com`).
      - `FTP_USERNAME`: The FTP user (e.g. `user@yourdomain.com`).
      - `FTP_PASSWORD`: The FTP account password.

3.  **Automatic deployment**:
    - On every `push` or `merge` to the `main` branch, the `.github/workflows/deploy.yml` workflow will:
      1.  Install dependencies.
      2.  Build the `@org/clinic` application.
      3.  Upload the contents of the `apps/clinic/dist` folder to the `public_html/` folder on your server.

> **Note**: The `.htaccess` file in `apps/clinic/public` is automatically included in the build to handle React (Single Page Application) routing on the Apache server in cPanel.

## 🎨 Visual identity (logo & favicon)

The single source of truth for the visual identity is `apps/clinic/public/logo.svg`:

- the logo displayed on the site (header) — `brand.logoSrc` in `apps/clinic/src/content/site-content.ts`;
- favicon — `favicon.ico` (multi-resolution) + `logo.svg` for modern browsers;
- `apple-touch-icon.png` (180×180, opaque background, PNG required for iOS);
- `og-image.jpg` (1200×630) for Open Graph / Twitter and structured data.

All derived images can be regenerated from the logo with:

```bash
node tools/generate-favicon.mjs
```

## ⭐ Featured Nx Capabilities

This repository showcases several powerful Nx features:

### 1. 🔒 Module Boundaries

Enforces architectural constraints using tags. Each project has specific dependencies it can use:

- `scope:shared` - Can be used by all projects
- `scope:clinic` - Clinic-specific application code
- `scope:api` - API-specific libraries
- `type:data` - Data access libraries

**Try it out:**

```bash
# See the current project graph and boundaries
npm exec nx graph

# View a specific project's details
npm exec nx show project @org/clinic --web
```

[Learn more about module boundaries →](https://nx.dev/docs/features/enforce-module-boundaries)

### 2. ⚡ Vite Development Workflow

Fast local development with Vite for frontend projects:

```bash
# Run clinic in dev mode
npm exec nx run @org/clinic:dev

# Build clinic for production
npm exec nx run @org/clinic:build
```

[Learn more about Vite →](https://nx.dev/docs/technologies/build-tools/vite)

### 3. 🧪 Vitest for Unit Testing

Fast unit testing with Vitest for React libraries:

```bash
# Test a specific library
npm exec nx run @org/shared-test-utils:test

# Test all projects
npm exec nx run-many -t test
```

[Learn more about Vite testing →](https://nx.dev/docs/technologies/build-tools/vite)

### 4. 🔧 Self-Healing CI

The CI pipeline includes `nx fix-ci` which automatically identifies and suggests fixes for common issues:

```bash
# In CI, this command provides automated fixes
npm exec nx fix-ci
```

This feature helps maintain a healthy CI pipeline by automatically detecting and suggesting solutions for:

- Missing dependencies
- Incorrect task configurations
- Cache invalidation issues
- Common build failures

[Learn more about self-healing CI →](https://nx.dev/docs/features/ci-features/self-healing-ci)

## 📁 Project Structure

```
├── apps/
│   ├── clinic/         [scope:clinic]  - React clinic app
│   └── api/            [scope:api]     - Backend API
├── packages/
│   ├── api/
│   │   └── products/    [scope:api]    - Product service
│   └── shared/
│       ├── models/      [scope:shared,type:data] - Shared models
│       └── test-utils/  [scope:shared]           - Testing utilities
├── nx.json             - Nx configuration
├── tsconfig.json       - TypeScript configuration
└── eslint.config.mjs   - ESLint with module boundary rules
```

## 🏷️ Understanding Tags

This repository uses tags to enforce module boundaries:

| Project  | Tags                        | Can Import From             |
| -------- | --------------------------- | --------------------------- |
| `clinic` | `scope:clinic`              | `scope:shared`              |
| `api`    | `scope:api`                 | `scope:api`, `scope:shared` |
| `models` | `scope:shared`, `type:data` | Nothing (base library)      |

## 📚 Useful Commands

```bash
# Project exploration
npm exec nx graph                               # Interactive dependency graph
npm exec nx list                                # List installed plugins
npm exec nx show project @org/clinic --web      # View project details

# Development
npm exec nx run @org/clinic:serve                # Serve clinic app
npm exec nx run @org/api:serve                   # Serve backend API
npm exec nx run @org/clinic:build                # Build clinic app
npm exec nx run @org/shared-test-utils:test      # Test a specific library
npm exec nx run @org/api-products:lint           # Lint a specific library

# Running multiple tasks
npm exec nx run-many -t build                  # Build all projects
npm exec nx run-many -t test --parallel=3      # Test in parallel
npm exec nx run-many -t lint test build        # Run multiple targets

# Affected commands (great for CI)
npm exec nx affected -t build                  # Build only affected projects
npm exec nx affected -t test                   # Test only affected projects
```

## 🎯 Adding New Features

### Generate a new React application:

```bash
npm exec nx g @nx/react:app my-app
```

### Generate a new React library:

```bash
npm exec nx g @nx/react:lib my-lib
```

### Generate a new React component:

```bash
npm exec nx g @nx/react:component my-component --project=my-lib
```

### Generate a new API library:

```bash
npm exec nx g @nx/node:lib my-api-lib
```

You can use `npm exec nx list` to see all available plugins and `npm exec nx list <plugin-name>` to see all generators for a specific plugin.

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/docs/features/ci-features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/docs/features/ci-features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/docs/features/ci-features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/docs/features/ci-features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/docs/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Nx Documentation](https://nx.dev/docs)
- [Crafting Your Workspace Tutorial](https://nx.dev/docs/getting-started/tutorials/crafting-your-workspace)
- [Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Vite](https://nx.dev/docs/technologies/build-tools/vite)
- [Docker Integration](https://nx.dev/docs/guides/nx-release/release-docker-images)
- [Nx Cloud](https://nx.dev/nx-cloud)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)
