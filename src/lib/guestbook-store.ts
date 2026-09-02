import { promises as fs } from "fs";
import path from "path";
import { hasDatabase, sql } from "@/lib/db";
import type { GuestbookEntry } from "@/types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "little-letter")
  : path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "guestbook.json");

/** Shown when the database is empty on first boot. */
export const GUESTBOOK_SEED: GuestbookEntry[] = [
  {
    id: "seed-1",
    name: "Mika",
    message:
      "This feels like opening a digital jewellery box. Soft and sparkly.",
    emoji: "✨",
    createdAt: "2026-07-12T10:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Jules",
    message: "Sent one to my sister. She replied with seventeen heart emojis.",
    emoji: "✨",
    createdAt: "2026-07-20T15:30:00.000Z",
  },
  {
    id: "seed-3",
    name: "Pip",
    message: "GeoCities energy, modern manners. I approve.",
    emoji: "🌈",
    createdAt: "2026-07-28T09:12:00.000Z",
  },
  {
    id: "seed-joao",
    name: "Joao Ferreira",
    message: "Something like nostalgic and cute.",
    emoji: "💌",
    createdAt: "2026-08-31T18:00:00.000Z",
  },
];

const JOAO_ENTRY = GUESTBOOK_SEED.find((e) => e.id === "seed-joao")!;

let ensured = false;
let memoryEntries: GuestbookEntry[] | null = null;

function withJoao(entries: GuestbookEntry[]): GuestbookEntry[] {
  const hasJoao = entries.some(
    (e) =>
      e.id === JOAO_ENTRY.id ||
      e.name.toLowerCase().includes("joao") ||
      e.name.toLowerCase().includes("ferreira")
  );
  if (hasJoao) return entries;
  return [JOAO_ENTRY, ...entries].slice(0, 100);
}

function rowToEntry(row: {
  id: string;
  name: string;
  message: string;
  emoji: string;
  created_at: Date | string;
}): GuestbookEntry {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    emoji: row.emoji,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function ensureTable() {
  if (ensured || !hasDatabase()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS guestbook_entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      emoji TEXT NOT NULL DEFAULT '💌',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  const { rows } = await sql<{ count: string | number }>`
    SELECT COUNT(*)::bigint AS count FROM guestbook_entries
  `;
  const count = Number(rows[0]?.count ?? 0);
  if (!Number.isFinite(count) || count === 0) {
    for (const entry of GUESTBOOK_SEED) {
      await sql`
        INSERT INTO guestbook_entries (id, name, message, emoji, created_at)
        VALUES (
          ${entry.id},
          ${entry.name},
          ${entry.message},
          ${entry.emoji},
          ${entry.createdAt}::timestamptz
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
  await upsertJoaoEntry();
  ensured = true;
}

async function upsertJoaoEntry() {
  if (!hasDatabase()) return;
  const { rows } = await sql<{ count: string | number }>`
    SELECT COUNT(*)::bigint AS count
    FROM guestbook_entries
    WHERE id <> ${JOAO_ENTRY.id}
      AND (LOWER(name) LIKE '%joao%' OR LOWER(name) LIKE '%ferreira%')
  `;
  const realEntry = Number(rows[0]?.count ?? 0);
  if (Number.isFinite(realEntry) && realEntry > 0) return;

  await sql`
    INSERT INTO guestbook_entries (id, name, message, emoji, created_at)
    VALUES (
      ${JOAO_ENTRY.id},
      ${JOAO_ENTRY.name},
      ${JOAO_ENTRY.message},
      ${JOAO_ENTRY.emoji},
      ${JOAO_ENTRY.createdAt}::timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      message = EXCLUDED.message,
      emoji = EXCLUDED.emoji
  `;
}

async function ensureJoaoEntry() {
  if (!hasDatabase()) return;
  await ensureTable();
  await upsertJoaoEntry();
}

async function readFileEntries(): Promise<GuestbookEntry[]> {
  if (memoryEntries) return memoryEntries;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    memoryEntries = JSON.parse(raw) as GuestbookEntry[];
    memoryEntries = withJoao(memoryEntries);
    return memoryEntries;
  } catch {
    memoryEntries = [...GUESTBOOK_SEED];
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(GUESTBOOK_SEED, null, 2));
    } catch {
      /* memory-only */
    }
    return memoryEntries;
  }
}

async function writeFileEntries(entries: GuestbookEntry[]) {
  memoryEntries = entries;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
  } catch {
    /* memory-only */
  }
}

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  if (hasDatabase()) {
    await ensureJoaoEntry();
    const { rows } = await sql<{
      id: string;
      name: string;
      message: string;
      emoji: string;
      created_at: Date | string;
    }>`
      SELECT id, name, message, emoji, created_at
      FROM guestbook_entries
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return withJoao(rows.map(rowToEntry));
  }
  const entries = await readFileEntries();
  return withJoao(entries);
}

export async function addGuestbookEntry(
  entry: GuestbookEntry
): Promise<GuestbookEntry[]> {
  if (hasDatabase()) {
    await ensureTable();
    await sql`
      INSERT INTO guestbook_entries (id, name, message, emoji, created_at)
      VALUES (
        ${entry.id},
        ${entry.name},
        ${entry.message},
        ${entry.emoji},
        ${entry.createdAt}::timestamptz
      )
    `;
    return listGuestbookEntries();
  }

  const entries = await readFileEntries();
  const next = [entry, ...entries].slice(0, 100);
  await writeFileEntries(next);
  return next;
}
