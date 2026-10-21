import { tenants, ValidationError, type Db } from '@org/api-data';
import {
  AuthService,
  ForbiddenError,
  InvalidCredentialsError,
  type SessionUser,
} from './auth.service';
import { createTestDb } from './test-db';

describe('AuthService', () => {
  let db: Db;
  let close: () => Promise<void>;
  let now: Date;
  let auth: AuthService;
  let admin: SessionUser;
  let clinicA: string;
  let clinicB: string;

  async function invite(
    actor: SessionUser,
    email: string,
    role: SessionUser['role'],
    tenantId?: string,
  ) {
    return auth.createInvitation(actor, { email, role, tenantId });
  }

  async function createUser(
    actor: SessionUser,
    username: string,
    role: SessionUser['role'],
    tenantId?: string,
  ) {
    const { token } = await invite(
      actor,
      `${username}@example.com`,
      role,
      tenantId,
    );
    return (
      await auth.acceptInvitation({
        token,
        username,
        password: 'parola-sigura-1',
      })
    ).user;
  }

  beforeAll(async () => {
    ({ db, close } = await createTestDb());
    now = new Date('2026-10-21T10:00:00Z');
    auth = new AuthService(db, () => now);
    await auth.bootstrapSuperAdmin({
      username: 'Admin',
      email: 'admin@example.com',
      password: 'parola-admin-1',
    });
    admin = (await auth.login('admin', 'parola-admin-1')).user;
    [{ id: clinicA }, { id: clinicB }] = await db
      .insert(tenants)
      .values([{ name: 'Clinica A' }, { name: 'Clinica B' }])
      .returning();
  });

  afterAll(() => close());

  it('bootstraps the super admin only once', async () => {
    expect(admin).toMatchObject({
      username: 'admin',
      role: 'super_admin',
      tenantId: null,
    });
    expect(
      await auth.bootstrapSuperAdmin({
        username: 'altul',
        email: 'x@example.com',
        password: 'parola-sigura-1',
      }),
    ).toBe(false);
  });

  it('logs in with username (case-insensitive) and resolves the session', async () => {
    const { token, user } = await auth.login(' ADMIN ', 'parola-admin-1');
    expect(await auth.authenticate(token)).toEqual(user);
    await auth.logout(token);
    expect(await auth.authenticate(token)).toBeNull();
  });

  it('rejects wrong passwords and unknown users the same way', async () => {
    await expect(auth.login('admin', 'gresit-gresit')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    await expect(auth.login('nimeni', 'gresit-gresit')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('locks the account for 15 minutes after 5 failed attempts', async () => {
    await createUser(admin, 'blocat', 'doctor', clinicA);
    for (let i = 0; i < 5; i++) {
      await expect(
        auth.login('blocat', 'gresit-gresit'),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    }
    await expect(
      auth.login('blocat', 'parola-sigura-1'),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    now = new Date(now.getTime() + 16 * 60 * 1000);
    await expect(
      auth.login('blocat', 'parola-sigura-1'),
    ).resolves.toBeDefined();
  });

  it('expires sessions after 12 hours', async () => {
    const { token } = await auth.login('admin', 'parola-admin-1');
    now = new Date(now.getTime() + 13 * 60 * 60 * 1000);
    expect(await auth.authenticate(token)).toBeNull();
  });

  it('lets a manager invite only into their own clinic, and never a super admin', async () => {
    const manager = await createUser(admin, 'manager.a', 'manager', clinicA);
    const doctor = await createUser(manager, 'dr.ana', 'doctor', clinicB);
    expect(doctor).toMatchObject({ role: 'doctor', tenantId: clinicA });
    await expect(
      invite(manager, 'boss@example.com', 'super_admin'),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(
      invite(doctor, 'x@example.com', 'doctor'),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('requires a clinic when a super admin invites a manager or doctor', async () => {
    await expect(
      invite(admin, 'fara@example.com', 'doctor'),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('accepts an invitation only once and rejects taken usernames', async () => {
    const { token } = await invite(
      admin,
      'dublu@example.com',
      'doctor',
      clinicA,
    );
    await expect(
      auth.acceptInvitation({
        token,
        username: 'admin',
        password: 'parola-sigura-1',
      }),
    ).rejects.toMatchObject({ code: 'username_taken' });
    // A failed accept rolls back, so the invitation can still be used.
    await auth.acceptInvitation({
      token,
      username: 'dublu',
      password: 'parola-sigura-1',
    });
    await expect(
      auth.acceptInvitation({
        token,
        username: 'dublu2',
        password: 'parola-sigura-1',
      }),
    ).rejects.toMatchObject({ entity: 'invitation' });
  });

  it('rejects expired invitations, weak passwords and bad usernames', async () => {
    const { token } = await invite(
      admin,
      'expirat@example.com',
      'doctor',
      clinicA,
    );
    await expect(
      auth.acceptInvitation({ token, username: 'ok.user', password: 'scurt' }),
    ).rejects.toMatchObject({ code: 'weak_password' });
    await expect(
      auth.acceptInvitation({
        token,
        username: 'cu spatiu',
        password: 'parola-sigura-1',
      }),
    ).rejects.toMatchObject({ code: 'invalid_username' });
    now = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
    await expect(
      auth.acceptInvitation({
        token,
        username: 'expirat',
        password: 'parola-sigura-1',
      }),
    ).rejects.toMatchObject({ entity: 'invitation' });
  });

  it('shows a manager only the users of their own clinic', async () => {
    const managerB = await createUser(admin, 'manager.b', 'manager', clinicB);
    const visible = await auth.listUsers(managerB);
    expect(visible.every((u) => u.tenantId === clinicB)).toBe(true);
    expect(visible.map((u) => u.username)).not.toContain('dr.ana');
    expect((await auth.listUsers(admin)).length).toBeGreaterThan(
      visible.length,
    );
  });
});
