import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { GuestbookEntry } from "@/types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "little-letter")
  : path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "guestbook.json");

/** In-memory fallback when the filesystem is unavailable (e.g. cold serverless). */
let memoryEntries: GuestbookEntry[] | null = null;

const SEED: GuestbookEntry[] = [
  {
    id: "seed-1",
    name: "Mika",
    message: "This feels like opening a digital jewellery box. Soft and sparkly.",
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
    emoji: "🦋",
    createdAt: "2026-07-28T09:12:00.000Z",
  },
];

async function readEntries(): Promise<GuestbookEntry[]> {
  if (memoryEntries) return memoryEntries;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    memoryEntries = JSON.parse(raw) as GuestbookEntry[];
    return memoryEntries;
  } catch {
    memoryEntries = [...SEED];
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(SEED, null, 2));
    } catch {
      // Memory-only mode is fine for demos / restricted hosts
    }
    return memoryEntries;
  }
}

async function writeEntries(entries: GuestbookEntry[]) {
  memoryEntries = entries;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
  } catch {
    // Persist in memory for this instance
  }
}

export async function GET() {
  const entries = await readEntries();
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      message?: string;
      emoji?: string;
    };

    const name = body.name?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const emoji = body.emoji?.trim() || "💌";

    if (name.length < 1 || name.length > 40) {
      return NextResponse.json(
        { error: "Name should be 1–40 characters." },
        { status: 400 }
      );
    }
    if (message.length < 2 || message.length > 200) {
      return NextResponse.json(
        { error: "Message should be 2–200 characters." },
        { status: 400 }
      );
    }

    const entry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name,
      message,
      emoji: emoji.slice(0, 4),
      createdAt: new Date().toISOString(),
    };

    const entries = await readEntries();
    const next = [entry, ...entries].slice(0, 100);
    await writeEntries(next);

    return NextResponse.json({ entries: next });
  } catch {
    return NextResponse.json(
      { error: "Could not sign the guestbook." },
      { status: 500 }
    );
  }
}
