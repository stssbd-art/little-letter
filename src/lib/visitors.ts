import { sql } from "@vercel/postgres";

const STARTING_COUNT = 12_847;

function hasDatabase() {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL
  );
}

let ensured = false;
let memoryCount = STARTING_COUNT;

async function ensureTable() {
  if (ensured || !hasDatabase()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS site_stats (
      key TEXT PRIMARY KEY,
      value BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    INSERT INTO site_stats (key, value)
    VALUES ('visitor_count', ${STARTING_COUNT})
    ON CONFLICT (key) DO NOTHING
  `;
  ensured = true;
}

export async function getVisitorCount(): Promise<number> {
  if (!hasDatabase()) return memoryCount;
  await ensureTable();
  const { rows } = await sql`
    SELECT value FROM site_stats WHERE key = 'visitor_count' LIMIT 1
  `;
  const value = Number(rows[0]?.value);
  return Number.isFinite(value) && value > 0 ? value : STARTING_COUNT;
}

export async function bumpVisitorCount(): Promise<number> {
  if (!hasDatabase()) {
    memoryCount += 1;
    return memoryCount;
  }
  await ensureTable();
  const { rows } = await sql`
    UPDATE site_stats
    SET value = value + 1, updated_at = NOW()
    WHERE key = 'visitor_count'
    RETURNING value
  `;
  const value = Number(rows[0]?.value);
  if (Number.isFinite(value) && value > 0) return value;
  return getVisitorCount();
}
