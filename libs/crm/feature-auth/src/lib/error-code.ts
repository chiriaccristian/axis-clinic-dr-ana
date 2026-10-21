import { ApiError } from '@org/crm-data-access-auth';

export function errorCode(error: unknown): string {
  return error instanceof ApiError ? error.code : 'generic';
}
