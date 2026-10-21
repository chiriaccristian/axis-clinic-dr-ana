# API image for Google Cloud Run. Build from the repository root:
#   docker build -f deploy/cloud-run/Dockerfile .
# The production build bundles express and the workspace packages into
# apps/api/dist/main.js, so the runtime image needs no node_modules.
# The CRM app (apps/crm) is built to static files and served by the API.

FROM node:24-slim AS build
WORKDIR /workspace
ENV NX_NO_CLOUD=true NX_DAEMON=false
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/clinic/package.json apps/clinic/
COPY apps/crm/package.json apps/crm/
COPY libs/crm/util-i18n/package.json libs/crm/util-i18n/
COPY libs/crm/data-access-auth/package.json libs/crm/data-access-auth/
COPY libs/crm/feature-auth/package.json libs/crm/feature-auth/
COPY libs/crm/feature-users/package.json libs/crm/feature-users/
COPY libs/ui/package.json libs/ui/
COPY packages/api/auth/package.json packages/api/auth/
COPY packages/api/data/package.json packages/api/data/
COPY packages/api/products/package.json packages/api/products/
COPY packages/shared/models/package.json packages/shared/models/
COPY packages/shared/test-utils/package.json packages/shared/test-utils/
RUN npm ci
COPY . .
RUN npx nx run @org/api:build:production --thirdParty=true
RUN npx nx run @org/crm:build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
COPY --from=build /workspace/apps/api/dist/main.js ./main.js
COPY --from=build /workspace/apps/api/dist/migrations ./migrations
# The CRM app, served by the API on the same origin.
COPY --from=build /workspace/apps/crm/dist ./crm
USER node
EXPOSE 8080
CMD ["node", "main.js"]
