import { NextResponse } from "next/server";
import { sendLetterEmail } from "@/lib/resend";
import type { GeneratedLetter } from "@/types";
import {
  consumeSendAccess,
  FREE_LETTERS,
  getSendAccess,
  LETTER_PRICE_LABEL,
} from "@/lib/usage";
import { isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeneratedLetter;

    if (!body?.form?.recipientEmail || !isValidEmail(body.form.recipientEmail)) {
      return NextResponse.json(
        { error: "Valid recipient email required." },
        { status: 400 }
      );
    }
    if (!body.subject?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Letter content is missing." },
        { status: 400 }
      );
    }

    const access = await getSendAccess();
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: `Your first ${FREE_LETTERS} letters are free. Extra letters are ${LETTER_PRICE_LABEL} each.`,
          requiresPayment: true,
          price: LETTER_PRICE_LABEL,
          stripeConfigured: isStripeConfigured(),
        },
        { status: 402 }
      );
    }

    const letter: GeneratedLetter = {
      subject: body.subject,
      message: body.message,
      form: body.form,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const result = await sendLetterEmail(letter);
    const usage = await consumeSendAccess();

    return NextResponse.json({
      ok: true,
      id: result.id,
      simulated: result.simulated,
      provider: result.provider,
      used: access.reason,
      freeUsed: usage.freeUsed,
      creditsLeft: usage.credits,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not send the letter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
