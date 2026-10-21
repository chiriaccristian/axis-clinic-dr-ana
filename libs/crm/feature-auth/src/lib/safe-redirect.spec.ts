import { safeRedirectPath } from './safe-redirect';

describe('safeRedirectPath', () => {
  it('keeps in-app paths', () => {
    expect(safeRedirectPath('/users')).toBe('/users');
    expect(safeRedirectPath('/users?tab=1')).toBe('/users?tab=1');
  });

  it.each([
    undefined,
    42,
    'users',
    'https://example.test',
    '//example.test',
    '/\\example.test',
    '/\\\\example.test',
    '/%09/example.test'.replace('%09', '\t'),
  ])('falls back to the home page for %j', (value) => {
    expect(safeRedirectPath(value)).toBe('/');
  });
});
