import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/packages/api/auth',
  test: {
    name: '@org/api-auth',
    watch: false,
    globals: true,
    environment: 'node',
    // Suites boot an in-memory Postgres (PGlite); scrypt hashing is slow on purpose.
    hookTimeout: 60_000,
    testTimeout: 30_000,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
