import type {
  AcceptInvitationInput,
  CreateInvitationInput,
  InvitationResult,
  SessionUser,
  Tenant,
  UserSummary,
} from '@org/models';
import { ApiError, apiRequest } from './api-client';

export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<SessionUser>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  logout: () => apiRequest<void>('/auth/logout', { method: 'POST' }),

  /** The current user, or null when there is no valid session. */
  me: async (): Promise<SessionUser | null> => {
    try {
      return await apiRequest<SessionUser>('/auth/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  acceptInvitation: (input: AcceptInvitationInput) =>
    apiRequest<SessionUser>('/auth/accept-invitation', {
      method: 'POST',
      body: input,
    }),

  listUsers: () => apiRequest<UserSummary[]>('/users'),

  createInvitation: (input: CreateInvitationInput) =>
    apiRequest<InvitationResult>('/invitations', {
      method: 'POST',
      body: input,
    }),

  listTenants: () => apiRequest<Tenant[]>('/tenants'),

  createTenant: (name: string) =>
    apiRequest<Tenant>('/tenants', { method: 'POST', body: { name } }),
};
