# API image for Google Cloud Run. Build from the repository root:
#   docker build -f deploy/cloud-run/Dockerfile .
# The production build bundles express and the workspace packages into
# apps/api/dist/main.js, so the runtime image needs no node_modules.

FROM node:24-slim AS build
WORKDIR /workspace
ENV NX_NO_CLOUD=true NX_DAEMON=false
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/clinic/package.json apps/clinic/
COPY libs/ui/package.json libs/ui/
COPY packages/api/products/package.json packages/api/products/
COPY packages/shared/models/package.json packages/shared/models/
COPY packages/shared/test-utils/package.json packages/shared/test-utils/
RUN npm ci
COPY . .
RUN npx nx run @org/api:build:production --thirdParty=true

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
COPY --from=build /workspace/apps/api/dist/main.js ./main.js
USER node
EXPOSE 8080
CMD ["node", "main.js"]
