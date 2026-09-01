import { NextResponse } from "next/server";
import {
  addGuestbookEntry,
  listGuestbookEntries,
} from "@/lib/guestbook-store";
import type { GuestbookEntry } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await listGuestbookEntries();
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

    const entries = await addGuestbookEntry(entry);
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json(
      { error: "Could not sign the guestbook." },
      { status: 500 }
    );
  }
}
