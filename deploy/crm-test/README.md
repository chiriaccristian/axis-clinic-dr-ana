# crm-test host

cPanel AI App Hosting entry point for `crm-test.drana.ro`.

The root `package.json` lists React and Vite (for the public site), so the
hosting detects the repository root as a static site. This folder has its own
`package.json` with no frontend dependencies, so it is detected as a Node.js
server.

cPanel settings:

- Application path from root: `deploy/crm-test`
- Build command: `npm run build`
- Startup command: `npm start`
- Output directory: `dist`

`npm run build` installs the monorepo from the root and bundles the API
(express included) into `dist/main.js`, so `npm start` needs no `node_modules`.
