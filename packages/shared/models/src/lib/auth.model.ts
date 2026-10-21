/** Platform owner (no practice), practice manager, or doctor. */
export type Role = 'super_admin' | 'manager' | 'doctor';

export const ROLES: readonly Role[] = ['super_admin', 'manager', 'doctor'];

/** The logged-in user, as returned by `GET /api/auth/me` and login. */
export interface SessionUser {
  id: string;
  tenantId: string | null;
  role: Role;
  username: string;
}

/** A row of `GET /api/users`. */
export interface UserSummary {
  id: string;
  tenantId: string | null;
  role: Role;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  lastLoginAt: string | null;
}

/** A practice (doctor or clinic). */
export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateInvitationInput {
  email: string;
  role: Role;
  /** Required when a super admin invites a manager or doctor. */
  tenantId?: string | null;
}

/** `acceptUrl` is present only when the email could not be sent. */
export interface InvitationResult {
  id: string;
  emailed: boolean;
  acceptUrl?: string;
}

export interface AcceptInvitationInput {
  token: string;
  username: string;
  password: string;
}

/** Error body of every API endpoint. */
export interface ApiErrorBody {
  error: { code: string; message: string };
}

/** Enforced by the API; the CRM checks it before submitting. */
export const MIN_PASSWORD_LENGTH = 10;

/** Usernames are stored lowercase. */
export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;
