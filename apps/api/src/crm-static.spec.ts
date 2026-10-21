import express from 'express';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { serveCrm } from './crm-static';

describe('serveCrm', () => {
  let dir: string;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'crm-dist-'));
    mkdirSync(join(dir, 'assets'));
    writeFileSync(join(dir, 'index.html'), '<div id="root"></div>');
    writeFileSync(join(dir, 'assets', 'index-abc.js'), 'console.info(1)');
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function appWithCrm() {
    const app = express();
    app.get('/api/ping', (req, res) => {
      res.json({ data: 'pong' });
    });
    expect(serveCrm(app, dir)).toBe(true);
    return app;
  }

  it('does nothing when there is no build', () => {
    expect(serveCrm(express(), join(dir, 'missing'))).toBe(false);
  });

  it('serves the app shell for client-side routes, with a CSP', async () => {
    const res = await request(appWithCrm()).get('/users');
    expect(res.status).toBe(200);
    expect(res.text).toContain('id="root"');
    expect(res.headers['content-security-policy']).toContain(
      "frame-ancestors 'none'",
    );
    expect(res.headers['cache-control']).toBe('no-cache');
  });

  it('caches hashed assets for a long time', async () => {
    const res = await request(appWithCrm()).get('/assets/index-abc.js');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toContain('immutable');
  });

  it('leaves API routes to the API', async () => {
    const app = appWithCrm();
    expect((await request(app).get('/api/ping')).body).toEqual({
      data: 'pong',
    });
    expect((await request(app).get('/api/unknown')).status).toBe(404);
  });
});
