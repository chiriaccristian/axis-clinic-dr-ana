import express, { type Express } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Only same-origin code; fonts come from Google Fonts.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

/**
 * Serves the built CRM app (apps/crm) from the same origin as the API, so the
 * session cookie stays first-party. Returns false when no build is present,
 * as in local development, where Vite serves the app instead.
 */
export function serveCrm(app: Express, dir: string): boolean {
  const indexHtml = join(dir, 'index.html');
  if (!existsSync(indexHtml)) return false;

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
      res.header('Content-Security-Policy', CONTENT_SECURITY_POLICY);
    }
    next();
  });
  // Hashed file names under /assets never change, so they can be cached.
  app.use(
    '/assets',
    express.static(join(dir, 'assets'), { immutable: true, maxAge: '1y' }),
  );
  app.use(express.static(dir, { index: false, maxAge: 0 }));
  // Client-side routes (/login, /users, ...) all load the app shell.
  app.get(/^(?!\/api(\/|$)).*/, (req, res) => {
    res.header('Cache-Control', 'no-cache');
    res.sendFile(indexHtml);
  });
  return true;
}
