import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;
const PARAMS = { N: 2 ** 15, r: 8, p: 1 } as const;

interface Params {
  N: number;
  r: number;
  p: number;
}

function derive(
  password: string,
  salt: Buffer,
  params: Params,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      KEY_LENGTH,
      { ...params, maxmem: 256 * params.N * params.r },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

/** Returns `scrypt$N$r$p$salt$hash` (base64 parts). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, PARAMS);
  return [
    'scrypt',
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, n, r, p, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const key = await derive(password, Buffer.from(salt, 'base64'), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

export { MIN_PASSWORD_LENGTH } from '@org/models';
