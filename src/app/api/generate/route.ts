import { NextResponse } from "next/server";
import { generateLetterMessage } from "@/lib/openai";
import type { LetterFormData } from "@/types";
import { OCCASIONS, RELATIONSHIPS, STYLES } from "@/lib/constants";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LetterFormData>;

    if (!body.recipientName?.trim() || !body.senderName?.trim()) {
      return NextResponse.json(
        { error: "Recipient and sender names are required." },
        { status: 400 }
      );
    }
    if (!body.recipientEmail || !isValidEmail(body.recipientEmail)) {
      return NextResponse.json(
        { error: "A valid recipient email is required." },
        { status: 400 }
      );
    }
    if (!OCCASIONS.some((o) => o.value === body.occasion)) {
      return NextResponse.json({ error: "Invalid occasion." }, { status: 400 });
    }
    if (!STYLES.some((s) => s.value === body.style)) {
      return NextResponse.json({ error: "Invalid style." }, { status: 400 });
    }
    if (!RELATIONSHIPS.some((r) => r.value === body.relationship)) {
      return NextResponse.json(
        { error: "Invalid relationship." },
        { status: 400 }
      );
    }

    const form: LetterFormData = {
      recipientName: body.recipientName.trim(),
      recipientEmail: body.recipientEmail.trim(),
      senderName: body.senderName.trim(),
      relationship: body.relationship!,
      occasion: body.occasion!,
      style: body.style!,
      customNote: (body.customNote ?? "").slice(0, 500),
    };

    const result = await generateLetterMessage(form);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not generate your letter right now." },
      { status: 500 }
    );
  }
}
