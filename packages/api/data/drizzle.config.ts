import { defineConfig } from 'drizzle-kit';

// Generates SQL migrations from src/lib/schema.ts:
//   npx drizzle-kit generate --config packages/api/data/drizzle.config.ts
// The API applies them at startup.
export default defineConfig({
  dialect: 'postgresql',
  schema: './packages/api/data/src/lib/schema.ts',
  out: './packages/api/data/migrations',
});
