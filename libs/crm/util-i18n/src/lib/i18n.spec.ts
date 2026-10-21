import { formatDateTime, hasMessage, t } from './i18n';

describe('t', () => {
  it('returns the Romanian text for a key', () => {
    expect(t('login.title')).toBe('Autentificare');
  });

  it('fills placeholders', () => {
    expect(t('invite.passwordHint', { min: 10 })).toBe(
      'Cel puțin 10 caractere.',
    );
  });

  it('leaves unknown placeholders in place', () => {
    expect(t('app.home.title')).toBe('Bine ai venit, {username}');
  });
});

describe('hasMessage', () => {
  it('recognises API error codes that have a text', () => {
    expect(hasMessage('error.invalid_credentials')).toBe(true);
    expect(hasMessage('error.something_new')).toBe(false);
  });
});

describe('formatDateTime', () => {
  it('formats in the Bucharest time zone', () => {
    expect(formatDateTime('2026-01-15T10:30:00Z')).toContain('12:30');
  });
});
