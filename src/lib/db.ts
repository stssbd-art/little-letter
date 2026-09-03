import postgres from "postgres";

/**
 * Shared Postgres client for Supabase (standard Postgres wire protocol).
 * Replaces @vercel/postgres, which only speaks Neon’s HTTP driver and fails
 * against Supabase with "Error connecting to database: fetch failed".
 */
function connectionString() {
  /*
   * Prefer the pooled URL when present (Vercel ↔ Supabase integration).
   * Fall back to the direct host for local / older env setups.
   */
  return (
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

export function hasDatabase() {
  return Boolean(connectionString());
}

declare global {
  // eslint-disable-next-line no-var
  var __llSql: ReturnType<typeof postgres> | undefined;
}

function getSql() {
  const url = connectionString();
  if (!url) {
    throw new Error("Postgres connection string is not configured.");
  }
  if (!globalThis.__llSql) {
    globalThis.__llSql = postgres(url, {
      /* PgBouncer / Supabase pooler rejects prepared statements. */
      prepare: false,
      /* Keep a few connections so email/cron work cannot block usage/guestbook. */
      max: 5,
      idle_timeout: 10,
      connect_timeout: 8,
      max_lifetime: 60 * 10,
      ssl: url.includes("localhost") ? false : "require",
    });
  }
  return globalThis.__llSql;
}

/**
 * Tagged template compatible with prior `@vercel/postgres` usage (`{ rows }`).
 */
export async function sql<T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const client = getSql() as (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => Promise<T[] & { count: number }>;
  const rows = await client(strings, ...values);
  return { rows: Array.from(rows), rowCount: rows.count ?? rows.length };
}
