import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type Db = NodePgDatabase;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: Db;
};

/**
 * Lazily create (and cache) the Postgres pool.
 *
 * IMPORTANT: this must NOT run at module import time. Next.js imports route
 * modules during `next build` ("Collecting page data"), so throwing here when
 * DATABASE_URL is missing breaks the build on Vercel/CI where the variable
 * is only needed at request time. Deferring creation until the first query
 * lets `next build` succeed without a database, while a missing DATABASE_URL
 * still fails loudly on the first real request.
 */
export function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Set it in your environment (e.g. in Vercel: Project → Settings → Environment Variables) and redeploy.",
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

/**
 * Lazily create (and cache) the Drizzle instance. Prefer this over the
 * `db` proxy below in new code.
 */
export function getDb(): Db {
  if (globalForDb.__arenaNextJsPostgresqlDb) {
    return globalForDb.__arenaNextJsPostgresqlDb;
  }

  const db = drizzle(getPool());

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlDb = db;
  }

  return db;
}

/**
 * Backwards-compatible lazy handle.
 *
 * Existing code does `import { db } from "@/db"` then `db.select()...`.
 * This proxy forwards every access to the real instance created by
 * `getDb()`, so importing this module never throws — only the first
 * actual query does (if DATABASE_URL is missing).
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real as object, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

/** @deprecated Use `getPool()` instead. Kept for backwards compatibility. */
export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const real = getPool();
    const value = Reflect.get(real as object, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
