import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('verifies the right password and rejects others', async () => {
    const hash = await hashPassword('corect-horse-1');
    expect(hash).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(hash).not.toContain('corect-horse-1');
    expect(await verifyPassword('corect-horse-1', hash)).toBe(true);
    expect(await verifyPassword('corect-horse-2', hash)).toBe(false);
  });

  it('uses a new salt every time', async () => {
    expect(await hashPassword('aceeasi-parola')).not.toBe(
      await hashPassword('aceeasi-parola'),
    );
  });

  it('rejects malformed stored hashes', async () => {
    expect(await verifyPassword('x', 'plain-text')).toBe(false);
  });
});
