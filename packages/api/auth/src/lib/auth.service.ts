import {
  invitations,
  NotFoundError,
  sessions,
  tenants,
  users,
  ValidationError,
  type Db,
} from '@org/api-data';
import { USERNAME_PATTERN, type SessionUser } from '@org/models';
import { and, asc, eq, gt, isNull, sql } from 'drizzle-orm';
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from './password';
import { hashToken, newToken } from './tokens';

export type Role = (typeof users.$inferSelect)['role'];

// The logged-in user is attached to each authenticated request; its shape is
// shared with the CRM app.
export type { SessionUser };

export class InvalidCredentialsError extends Error {
  constructor() {
    super('invalid_credentials');
    this.name = 'InvalidCredentialsError';
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('forbidden');
    this.name = 'ForbiddenError';
  }
}

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const LOCK_MS = 15 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Verified when the username does not exist, so both paths take similar time.
const DUMMY_HASH = hashPassword('not-a-real-password');

export class AuthService {
  constructor(
    private readonly db: Db,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: SessionUser }> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username.trim().toLowerCase()));

    if (!user) {
      await verifyPassword(password, await DUMMY_HASH);
      throw new InvalidCredentialsError();
    }
    const now = this.now();
    if (
      user.status !== 'active' ||
      (user.lockedUntil && user.lockedUntil > now)
    ) {
      throw new InvalidCredentialsError();
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      const failed = user.failedLogins + 1;
      await this.db
        .update(users)
        .set(
          failed >= MAX_FAILED_LOGINS
            ? {
                failedLogins: 0,
                lockedUntil: new Date(now.getTime() + LOCK_MS),
              }
            : { failedLogins: failed },
        )
        .where(eq(users.id, user.id));
      throw new InvalidCredentialsError();
    }

    await this.db
      .update(users)
      .set({ failedLogins: 0, lockedUntil: null, lastLoginAt: now })
      .where(eq(users.id, user.id));
    return {
      token: await this.createSession(user.id),
      user: toSessionUser(user),
    };
  }

  /** Resolves a session cookie to its user, or null if invalid or expired. */
  async authenticate(token: string): Promise<SessionUser | null> {
    const [row] = await this.db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.tokenHash, hashToken(token)),
          gt(sessions.expiresAt, this.now()),
          eq(users.status, 'active'),
        ),
      );
    return row ? toSessionUser(row.user) : null;
  }

  async logout(token: string): Promise<void> {
    await this.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, hashToken(token)));
  }

  /**
   * Super admins invite anyone (managers and doctors into a given practice);
   * managers invite managers and doctors into their own practice.
   */
  async createInvitation(
    actor: SessionUser,
    input: { email: string; role: Role; tenantId?: string | null },
  ): Promise<{ token: string; invitationId: string }> {
    const email = normalizeEmail(input.email);
    let tenantId: string | null;
    if (actor.role === 'super_admin') {
      tenantId = input.role === 'super_admin' ? null : (input.tenantId ?? null);
      if (input.role !== 'super_admin' && !tenantId) {
        throw new ValidationError('tenant_required');
      }
    } else if (actor.role === 'manager' && input.role !== 'super_admin') {
      tenantId = actor.tenantId;
    } else {
      throw new ForbiddenError();
    }
    if (tenantId) {
      const [tenant] = await this.db
        .select({ id: tenants.id })
        .from(tenants)
        .where(eq(tenants.id, tenantId));
      if (!tenant) throw new NotFoundError('tenant');
    }
    await this.assertEmailFree(email);

    const token = newToken();
    const [row] = await this.db
      .insert(invitations)
      .values({
        tokenHash: hashToken(token),
        tenantId,
        role: input.role,
        email,
        invitedBy: actor.id,
        expiresAt: new Date(this.now().getTime() + INVITATION_TTL_MS),
      })
      .returning({ id: invitations.id });
    return { token, invitationId: row.id };
  }

  /** Creates the account from an invitation and logs the new user in. */
  async acceptInvitation(input: {
    token: string;
    username: string;
    password: string;
  }): Promise<{ token: string; user: SessionUser }> {
    const username = input.username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(username))
      throw new ValidationError('invalid_username');
    assertPasswordStrength(input.password);
    const passwordHash = await hashPassword(input.password);

    const user = await this.db.transaction(async (tx) => {
      // Marking the invitation used first makes a second, parallel accept fail.
      const [invitation] = await tx
        .update(invitations)
        .set({ acceptedAt: this.now() })
        .where(
          and(
            eq(invitations.tokenHash, hashToken(input.token)),
            isNull(invitations.acceptedAt),
            gt(invitations.expiresAt, this.now()),
          ),
        )
        .returning();
      if (!invitation) throw new NotFoundError('invitation');

      const [taken] = await tx
        .select({ username: users.username, email: users.email })
        .from(users)
        .where(
          sql`${users.username} = ${username} or ${users.email} = ${invitation.email}`,
        );
      if (taken) {
        throw new ValidationError(
          taken.username === username ? 'username_taken' : 'email_taken',
        );
      }

      const [created] = await tx
        .insert(users)
        .values({
          tenantId: invitation.tenantId,
          role: invitation.role,
          email: invitation.email,
          username,
          passwordHash,
        })
        .returning();
      return created;
    });

    return {
      token: await this.createSession(user.id),
      user: toSessionUser(user),
    };
  }

  /** Creates the first super admin if there is none yet. Returns true if created. */
  async bootstrapSuperAdmin(input: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    const [existing] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'super_admin'))
      .limit(1);
    if (existing) return false;

    const username = input.username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(username))
      throw new ValidationError('invalid_username');
    assertPasswordStrength(input.password);
    await this.db.insert(users).values({
      role: 'super_admin',
      tenantId: null,
      username,
      email: normalizeEmail(input.email),
      passwordHash: await hashPassword(input.password),
    });
    return true;
  }

  /** Users the actor may see: all for a super admin, own practice for a manager. */
  async listUsers(actor: SessionUser) {
    if (actor.role === 'doctor') throw new ForbiddenError();
    const columns = {
      id: users.id,
      tenantId: users.tenantId,
      role: users.role,
      username: users.username,
      email: users.email,
      status: users.status,
      lastLoginAt: users.lastLoginAt,
    };
    const query = this.db.select(columns).from(users);
    return actor.role === 'super_admin'
      ? query.orderBy(asc(users.username))
      : query
          .where(eq(users.tenantId, actor.tenantId ?? ''))
          .orderBy(asc(users.username));
  }

  async createTenant(actor: SessionUser, name: string) {
    if (actor.role !== 'super_admin') throw new ForbiddenError();
    if (!name.trim()) throw new ValidationError('invalid_name');
    const [row] = await this.db
      .insert(tenants)
      .values({ name: name.trim() })
      .returning();
    return row;
  }

  async listTenants(actor: SessionUser) {
    if (actor.role !== 'super_admin') throw new ForbiddenError();
    return this.db.select().from(tenants).orderBy(asc(tenants.name));
  }

  private async createSession(userId: string): Promise<string> {
    const token = newToken();
    await this.db.insert(sessions).values({
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(this.now().getTime() + SESSION_TTL_MS),
    });
    return token;
  }

  private async assertEmailFree(email: string): Promise<void> {
    const [taken] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    if (taken) throw new ValidationError('email_taken');
  }
}

function toSessionUser(user: typeof users.$inferSelect): SessionUser {
  return {
    id: user.id,
    tenantId: user.tenantId,
    role: user.role,
    username: user.username,
  };
}

function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized))
    throw new ValidationError('invalid_email');
  return normalized;
}

function assertPasswordStrength(password: string): void {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > 200) {
    throw new ValidationError('weak_password');
  }
}
