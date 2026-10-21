import { tenants, type Db } from '@org/api-data';
import express from 'express';
import request from 'supertest';
import { AuthService } from './auth.service';
import { createAuthRouter, errorHandler } from './http';
import type { Mailer } from './mailer';
import { createTestDb } from './test-db';

class RecordingMailer implements Mailer {
  sent: Array<{ to: string; url: string }> = [];
  constructor(private readonly enabled: boolean) {}
  async sendInvitation(to: string, url: string): Promise<boolean> {
    if (this.enabled) this.sent.push({ to, url });
    return this.enabled;
  }
}

describe('auth HTTP API', () => {
  let db: Db;
  let close: () => Promise<void>;
  let mailer: RecordingMailer;
  let app: express.Express;
  let clinicA: string;
  let clinicB: string;

  function buildApp(m: Mailer) {
    const a = express();
    a.use(express.json());
    a.use(
      '/api',
      createAuthRouter(new AuthService(db), m, {
        appUrl: 'https://crm.test',
        secureCookies: false,
      }),
    );
    a.use(errorHandler);
    return a;
  }

  async function loginAs(username: string, password: string) {
    const agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ username, password })
      .expect(200);
    return agent;
  }

  async function onboard(
    by: ReturnType<typeof request.agent>,
    username: string,
    role: string,
    tenantId?: string,
  ) {
    const res = await by
      .post('/api/invitations')
      .send({ email: `${username}@example.com`, role, tenantId })
      .expect(201);
    const token = new URL(res.body.data.acceptUrl).hash.replace('#token=', '');
    const agent = request.agent(app);
    await agent
      .post('/api/auth/accept-invitation')
      .send({ token, username, password: 'parola-sigura-1' })
      .expect(201);
    return agent;
  }

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    mailer = new RecordingMailer(false);
    app = buildApp(mailer);
    await new AuthService(db).bootstrapSuperAdmin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'parola-admin-1',
    });
    [{ id: clinicA }, { id: clinicB }] = await db
      .insert(tenants)
      .values([{ name: 'Clinica A' }, { name: 'Clinica B' }])
      .returning();
  });

  afterAll(() => close());

  it('sets an httpOnly, SameSite=Strict session cookie on login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'parola-admin-1' })
      .expect(200);
    const cookie = String(res.headers['set-cookie']);
    expect(cookie).toMatch(/crm_session=/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Strict/);
    expect(res.body.data).toMatchObject({
      username: 'admin',
      role: 'super_admin',
    });
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
  });

  it('returns the same 401 for wrong password and unknown user', async () => {
    const a = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'x-gresit-x' });
    const b = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nu-exista', password: 'x-gresit-x' });
    expect([a.status, b.status]).toEqual([401, 401]);
    expect(a.body).toEqual(b.body);
  });

  it('rejects unauthenticated requests', async () => {
    await request(app).get('/api/auth/me').expect(401);
    await request(app).get('/api/users').expect(401);
    await request(app)
      .post('/api/invitations')
      .send({ email: 'a@b.ro', role: 'doctor' })
      .expect(401);
    await request(app).post('/api/tenants').send({ name: 'X' }).expect(401);
  });

  it('runs the full flow: admin → manager → doctor, each with the right access', async () => {
    const admin = await loginAs('admin', 'parola-admin-1');
    const manager = await onboard(admin, 'manager.a', 'manager', clinicA);
    const doctor = await onboard(manager, 'dr.ana', 'doctor');

    const me = await doctor.get('/api/auth/me').expect(200);
    expect(me.body.data).toMatchObject({
      username: 'dr.ana',
      role: 'doctor',
      tenantId: clinicA,
    });

    // Wrong role.
    await doctor.get('/api/users').expect(403);
    await doctor
      .post('/api/invitations')
      .send({ email: 'x@example.com', role: 'doctor' })
      .expect(403);
    await manager.post('/api/tenants').send({ name: 'Clinica C' }).expect(403);
    await manager
      .post('/api/invitations')
      .send({ email: 'y@example.com', role: 'super_admin' })
      .expect(403);

    // Other tenant: a manager of clinic B does not see clinic A's users.
    const managerB = await onboard(admin, 'manager.b', 'manager', clinicB);
    const users = await managerB.get('/api/users').expect(200);
    expect(
      users.body.data.map((u: { username: string }) => u.username),
    ).toEqual(['manager.b']);

    // Super admin manages clinics.
    await admin.post('/api/tenants').send({ name: 'Clinica C' }).expect(201);
    const list = await admin.get('/api/tenants').expect(200);
    expect(list.body.data).toHaveLength(3);
  });

  it('logs out and invalidates the session', async () => {
    const admin = await loginAs('admin', 'parola-admin-1');
    await admin.post('/api/auth/logout').expect(204);
    await admin.get('/api/auth/me').expect(401);
  });

  it('emails the invitation when a provider is configured and hides the link', async () => {
    const sending = new RecordingMailer(true);
    app = buildApp(sending);
    const admin = await loginAs('admin', 'parola-admin-1');
    const res = await admin
      .post('/api/invitations')
      .send({ email: 'Nou@Example.com', role: 'doctor', tenantId: clinicA })
      .expect(201);
    expect(res.body.data).toMatchObject({ emailed: true });
    expect(res.body.data.acceptUrl).toBeUndefined();
    expect(sending.sent[0].to).toBe('nou@example.com');
    expect(sending.sent[0].url).toMatch(
      /^https:\/\/crm\.test\/accept-invitation#token=/,
    );
    app = buildApp(mailer);
  });

  it('answers bad input with a 400 in the standard error shape', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 42 })
      .expect(400);
    expect(res.body).toEqual({
      error: { code: 'invalid_username', message: 'Invalid input' },
    });
  });
});
