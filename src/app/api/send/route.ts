import { NextResponse } from "next/server";
import { sendLetterEmail } from "@/lib/resend";
import type { GeneratedLetter } from "@/types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const letter = (await request.json()) as GeneratedLetter;

    if (!letter?.form?.recipientEmail || !isValidEmail(letter.form.recipientEmail)) {
      return NextResponse.json(
        { error: "Valid recipient email required." },
        { status: 400 }
      );
    }
    if (!letter.subject?.trim() || !letter.message?.trim()) {
      return NextResponse.json(
        { error: "Letter content is missing." },
        { status: 400 }
      );
    }

    const result = await sendLetterEmail(letter);
    return NextResponse.json({
      ok: true,
      id: result.id,
      simulated: result.simulated,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not send the letter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
