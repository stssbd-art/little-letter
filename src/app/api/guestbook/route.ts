import { NextResponse } from "next/server";
import {
  addGuestbookEntry,
  GUESTBOOK_SEED,
  listGuestbookEntries,
} from "@/lib/guestbook-store";
import type { GuestbookEntry } from "@/types";

export const dynamic = "force-dynamic";

const JOAO_ENTRY = GUESTBOOK_SEED.find((e) => e.id === "seed-joao")!;

/** Always surface restored signatures even if storage was wiped on deploy. */
function withRestoredEntries(entries: GuestbookEntry[]): GuestbookEntry[] {
  const hasJoao = entries.some(
    (e) =>
      e.id === JOAO_ENTRY.id ||
      e.name.toLowerCase().includes("joao") ||
      e.name.toLowerCase().includes("ferreira")
  );
  if (hasJoao) return entries;
  return [JOAO_ENTRY, ...entries].slice(0, 100);
}

export async function GET() {
  try {
    const entries = withRestoredEntries(
      await Promise.race([
        listGuestbookEntries(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Guestbook lookup timed out.")), 6_000)
        ),
      ])
    );
    return NextResponse.json(
      { entries },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { entries: withRestoredEntries([...GUESTBOOK_SEED]) },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
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

    const entries = await addGuestbookEntry(entry);
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json(
      { error: "Could not sign the guestbook." },
      { status: 500 }
    );
  }
}
