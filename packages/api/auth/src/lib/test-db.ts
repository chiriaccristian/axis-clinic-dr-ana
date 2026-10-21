import { PGlite } from '@electric-sql/pglite';
import { schema, type Db } from '@org/api-data';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { join } from 'node:path';

/** In-memory Postgres with the API's migrations applied. Test-only. */
export async function createTestDb(): Promise<{
  db: Db;
  close(): Promise<void>;
}> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, {
    migrationsFolder: join(__dirname, '../../../data/migrations'),
  });
  return { db, close: () => client.close() };
}
