import { promises as fs } from "fs";
import path from "path";
import type { GeneratedLetter, MixtapePayload, SharedExample } from "@/types";
import { OCCASIONS } from "@/lib/constants";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "little-letter")
  : path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "shared-examples.json");

const MAX_ENTRIES = 80;
const MAX_SNIPPET = 120;
const MAX_NAME = 40;

let memoryEntries: SharedExample[] | null = null;

const SEED: SharedExample[] = [
  {
    id: "ex-seed-1",
    kind: "letter",
    fromName: "Mika",
    toName: "Sam",
    label: "Birthday",
    snippet:
      "Happy birthday — may your year feel like a pocket full of warm notes and soft surprises.",
    createdAt: "2026-07-15T11:00:00.000Z",
  },
  {
    id: "ex-seed-2",
    kind: "letter",
    fromName: "Jules",
    toName: "Alex",
    label: "Love",
    snippet:
      "Thinking of you between one errand and the next — a little paper lantern for your day.",
    createdAt: "2026-07-22T16:20:00.000Z",
  },
  {
    id: "ex-seed-3",
    kind: "mixtape",
    fromName: "Pip",
    toName: "Riley",
    label: "Songs for rainy Tuesdays",
    snippet: "These tracks remind me of that summer we never quite finished.",
    createdAt: "2026-08-01T09:45:00.000Z",
  },
  {
    id: "ex-seed-4",
    kind: "letter",
    fromName: "Casey",
    toName: "Morgan",
    label: "Friendship",
    snippet:
      "Just a tiny note to say your laugh still shows up in my good-day playlist.",
    createdAt: "2026-08-08T14:10:00.000Z",
  },
];

function trimName(name: string) {
  return name.trim().slice(0, MAX_NAME) || "a friend";
}

function softSnippet(text: string, fallback: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  if (cleaned.length <= MAX_SNIPPET) return cleaned;
  return `${cleaned.slice(0, MAX_SNIPPET - 1).trimEnd()}…`;
}

async function readEntries(): Promise<SharedExample[]> {
  if (memoryEntries) return memoryEntries;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    memoryEntries = JSON.parse(raw) as SharedExample[];
    return memoryEntries;
  } catch {
    memoryEntries = [...SEED];
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(SEED, null, 2));
    } catch {
      /* memory-only */
    }
    return memoryEntries;
  }
}

async function writeEntries(entries: SharedExample[]) {
  memoryEntries = entries;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
  } catch {
    /* persist in memory for this instance */
  }
}

export async function listSharedExamples(): Promise<SharedExample[]> {
  return readEntries();
}

export async function addSharedExample(
  entry: Omit<SharedExample, "id" | "createdAt"> & { createdAt?: string }
) {
  const nextEntry: SharedExample = {
    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: entry.kind,
    fromName: trimName(entry.fromName),
    toName: trimName(entry.toName),
    label:
      entry.label.trim().slice(0, 80) ||
      (entry.kind === "mixtape" ? "Untitled Mix" : "A letter"),
    snippet: softSnippet(
      entry.snippet,
      entry.kind === "mixtape" ? "a labelled mix" : "a little note"
    ),
    createdAt: entry.createdAt || new Date().toISOString(),
  };

  const entries = await readEntries();
  const next = [nextEntry, ...entries].slice(0, MAX_ENTRIES);
  await writeEntries(next);
  return nextEntry;
}

export async function addLetterExample(letter: GeneratedLetter) {
  const occasion = OCCASIONS.find((o) => o.value === letter.form.occasion);
  return addSharedExample({
    kind: "letter",
    fromName: letter.form.senderName,
    toName: letter.form.recipientName,
    label: occasion?.label ?? "A letter",
    snippet: letter.message,
    createdAt: letter.createdAt,
  });
}

export async function addMixtapeExample(mix: MixtapePayload) {
  return addSharedExample({
    kind: "mixtape",
    fromName: mix.senderName,
    toName: mix.recipientName,
    label: mix.title,
    snippet: mix.dedication || "a labelled mix",
    createdAt: mix.createdAt,
  });
}
