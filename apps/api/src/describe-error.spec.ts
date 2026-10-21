import { describeError } from './describe-error';

describe('describeError', () => {
  it('includes the cause that the database driver wrapped', () => {
    const refused = Object.assign(
      new Error('connect ECONNREFUSED 127.0.0.1:5432'),
      { code: 'ECONNREFUSED' },
    );
    const wrapped = new Error(
      'Failed query: CREATE SCHEMA IF NOT EXISTS "drizzle"\nparams: ',
      { cause: refused },
    );

    expect(describeError(wrapped)).toBe(
      'Failed query: CREATE SCHEMA IF NOT EXISTS "drizzle" <- ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:5432',
    );
  });

  it('keeps only the first line, which never holds query parameters', () => {
    expect(describeError(new Error('Failed query: x\nparams: secret'))).toBe(
      'Failed query: x',
    );
  });

  it('describes values that are not errors', () => {
    expect(describeError('boom')).toBe('boom');
  });
});
