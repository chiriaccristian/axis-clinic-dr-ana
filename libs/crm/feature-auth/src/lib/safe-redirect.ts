/**
 * The in-app path to return to after login, or '/' if `value` could leave the
 * app: protocol-relative (`//host`), backslash tricks (`/\host`) or anything
 * that is not a plain absolute path. React Router 6 does not reject these.
 */
export function safeRedirectPath(value: unknown): string {
  if (typeof value !== 'string') return '/';
  if (!value.startsWith('/') || value.startsWith('//')) return '/';
  if (/[\\\s]/.test(value)) return '/';
  return value;
}
