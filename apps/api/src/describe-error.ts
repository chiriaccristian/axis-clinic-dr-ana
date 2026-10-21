/**
 * The first line of an error and of its causes. Drizzle wraps driver errors
 * ("Failed query: ...") and keeps the real reason, such as ECONNREFUSED or a
 * failed password, in `cause`. Later lines can hold query parameters.
 */
export function describeError(err: unknown): string {
  const parts: string[] = [];
  let current: unknown = err;
  while (current instanceof Error && parts.length < 5) {
    const code =
      'code' in current && typeof current.code === 'string'
        ? `${current.code}: `
        : '';
    parts.push(code + (current.message.split('\n')[0] || current.name));
    current = current.cause;
  }
  return parts.length > 0 ? parts.join(' <- ') : String(err);
}
