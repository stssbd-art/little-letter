import { hasDatabase, sql } from "@/lib/db";
import { VISITOR_BASELINE } from "@/lib/constants";

const STARTING_COUNT = VISITOR_BASELINE;

export { VISITOR_BASELINE } from "@/lib/constants";
export function normalizeVisitorCount(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < STARTING_COUNT) return STARTING_COUNT;
  return n;
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
  await sql`
    UPDATE site_stats
    SET value = ${STARTING_COUNT}, updated_at = NOW()
    WHERE key = 'visitor_count' AND value < ${STARTING_COUNT}
  `;
  ensured = true;
}

export async function getVisitorCount(): Promise<number> {
  if (!hasDatabase()) return memoryCount;
  await ensureTable();
  const { rows } = await sql<{ value: string | number }>`
    SELECT value FROM site_stats WHERE key = 'visitor_count' LIMIT 1
  `;
  return normalizeVisitorCount(rows[0]?.value);
}

export async function bumpVisitorCount(): Promise<number> {
  if (!hasDatabase()) {
    memoryCount += 1;
    return memoryCount;
  }
  await ensureTable();
  const { rows } = await sql<{ value: string | number }>`
    UPDATE site_stats
    SET value = value + 1, updated_at = NOW()
    WHERE key = 'visitor_count'
    RETURNING value
  `;
  return normalizeVisitorCount(rows[0]?.value ?? (await getVisitorCount()));
}
