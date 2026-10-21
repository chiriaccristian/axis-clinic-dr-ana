import {
  AuthTypes,
  Connector,
  IpAddressTypes,
} from '@google-cloud/cloud-sql-connector';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import * as schema from './schema';

export type Schema = typeof schema;

/** Any Drizzle Postgres database over this schema (Cloud SQL, local, PGlite). */
export type Db = PgDatabase<PgQueryResultHKT, Schema>;

export type DbConfig =
  | {
      /** Cloud SQL, `project:region:instance`, with IAM database auth. */
      kind: 'cloud-sql';
      instanceConnectionName: string;
      database: string;
      iamUser: string;
    }
  | { kind: 'url'; connectionString: string };

/**
 * Reads the database settings from the environment. Returns null when none
 * are set, so the API can still start without a database.
 */
export function readDbConfig(env: NodeJS.ProcessEnv): DbConfig | null {
  const instance = env['CLOUD_SQL_INSTANCE'];
  if (instance) {
    const database = env['DB_NAME'];
    const iamUser = env['DB_IAM_USER'];
    if (!database || !iamUser) {
      throw new Error('CLOUD_SQL_INSTANCE needs DB_NAME and DB_IAM_USER');
    }
    return {
      kind: 'cloud-sql',
      instanceConnectionName: instance,
      database,
      iamUser,
    };
  }
  const url = env['DATABASE_URL'];
  return url ? { kind: 'url', connectionString: url } : null;
}

export interface DbConnection {
  db: Db;
  /** Applies pending migrations from `migrationsFolder` (idempotent). */
  migrate(migrationsFolder: string): Promise<void>;
  close(): Promise<void>;
}

function fromPool(
  pool: Pool,
  onClose: () => void = () => undefined,
): DbConnection {
  const db = drizzle(pool, { schema });
  return {
    db,
    migrate: (migrationsFolder) => migrate(db, { migrationsFolder }),
    close: async () => {
      await pool.end();
      onClose();
    },
  };
}

export async function connectDb(config: DbConfig): Promise<DbConnection> {
  if (config.kind === 'url') {
    return fromPool(
      new Pool({ connectionString: config.connectionString, max: 5 }),
    );
  }

  const connector = new Connector();
  const options = await connector.getOptions({
    instanceConnectionName: config.instanceConnectionName,
    ipType: IpAddressTypes.PUBLIC,
    authType: AuthTypes.IAM,
  });
  const pool = new Pool({
    ...options,
    user: config.iamUser,
    database: config.database,
    max: 5,
  });
  return fromPool(pool, () => connector.close());
}
