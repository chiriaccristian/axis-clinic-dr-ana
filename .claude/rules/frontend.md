---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "apps/*web*/**"
  - "apps/*crm*/**"
  - "libs/**/ui-*/**"
  - "libs/**/feature-*/**"
  - "libs/**/data-access-*/**"
---

# Frontend (React 19, Vite 8, Tailwind 4)

## React
- Function components and hooks only.
- Routing with `react-router-dom` v6 (`createBrowserRouter`, data routers). Don't migrate to v7.
- Lazy routes for large areas: CRM code must not load on the public site.
- Data fetching lives in `data-access-*`; `ui-*` components are purely presentational.
- Doctor data (name, services, schedule, copy) comes from configuration/API, never hardcoded in components.

## Styling
- Tailwind 4: the theme is defined in CSS with `@theme`, not in `tailwind.config.js`.
- Per-doctor colors and fonts are CSS variables (design tokens), so the site can be rebranded without code changes.
- No inline styles and no repeated magic values; extract them into tokens or `ui` components.

## i18n and formatting
- All UI text goes through translation keys; default language is Romanian.
- Text the doctor edits (bio, services) is data, not translations.
- Dates, times and currency via `Intl`; default time zone `Europe/Bucharest`, configurable per doctor.

## Accessibility
- Follow `eslint-plugin-jsx-a11y`: a `<label>` for every field, visible focus, sufficient contrast, keyboard navigation.
