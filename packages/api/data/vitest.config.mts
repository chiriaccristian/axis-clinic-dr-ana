import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/api/data',
  test: {
    name: '@org/api-data',
    watch: false,
    globals: true,
    environment: 'node',
    // Each suite boots an in-memory Postgres (PGlite), which takes several
    // seconds and longer when Nx runs other tasks in parallel.
    hookTimeout: 60_000,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
