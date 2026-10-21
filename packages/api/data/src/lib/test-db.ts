import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { join } from 'node:path';
import type { Db } from './db';
import * as schema from './schema';
import { tenants } from './schema';

/** In-memory Postgres with all migrations applied. Test-only. */
export async function createTestDb(): Promise<{
  db: Db;
  close(): Promise<void>;
}> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: join(__dirname, '../../migrations') });
  return { db, close: () => client.close() };
}

export async function createTenant(
  db: Db,
  name = 'Cabinet Test',
): Promise<string> {
  const [row] = await db.insert(tenants).values({ name }).returning();
  return row.id;
}
