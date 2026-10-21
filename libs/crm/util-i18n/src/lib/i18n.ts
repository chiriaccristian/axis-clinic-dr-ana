import { ro } from './ro';

export type MessageKey = keyof typeof ro;

/** Romanian is the default and, for now, only language. */
const messages: Record<string, string> = ro;

/**
 * Looks up a UI text by key and fills `{name}` placeholders.
 * Unknown keys return the key itself, so a missing text is visible, not blank.
 */
export function t(
  key: MessageKey,
  params: Record<string, string | number> = {},
): string {
  const text = messages[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** For texts keyed by a value from the API, such as an error code. */
export function hasMessage(key: string): key is MessageKey {
  return key in messages;
}

export const DEFAULT_TIME_ZONE = 'Europe/Bucharest';

export function formatDateTime(
  value: string | Date,
  timeZone: string = DEFAULT_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(typeof value === 'string' ? new Date(value) : value);
}

/** The text for an API error code, falling back to a generic message. */
export function errorText(
  code: string,
  params: Record<string, string | number> = {},
): string {
  const key = `error.${code}`;
  return t(hasMessage(key) ? key : 'error.generic', params);
}
