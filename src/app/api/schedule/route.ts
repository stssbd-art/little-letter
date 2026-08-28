import { NextResponse } from "next/server";
import type { GeneratedLetter } from "@/types";
import {
  addPaidCredit,
  consumeCardSendAccess,
  consumeSendAccess,
  FREE_LETTERS,
  getCardSendAccess,
  getSendAccess,
  isValidSenderEmail,
  LETTER_PRICE_LABEL,
  CARD_PRICE_LABEL,
  normalizeSenderEmail,
} from "@/lib/usage";
import { isStripeConfigured } from "@/lib/stripe";
import { parseVoiceNote } from "@/lib/voice-note";
import { isCardDesignId } from "@/lib/card-designs";
import { insertScheduledSend, parseScheduledAt } from "@/lib/scheduled-sends";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeneratedLetter & {
      shareExample?: boolean;
      voiceNote?: unknown;
      scheduledAt?: string;
    };

    if (!body?.scheduledAt?.trim()) {
      return NextResponse.json(
        { error: "Pick a date and time to send later." },
        { status: 400 }
      );
    }

    if (!body?.form?.recipientEmail || !isValidEmail(body.form.recipientEmail)) {
      return NextResponse.json(
        { error: "Valid recipient email required." },
        { status: 400 }
      );
    }
    if (!body.form.senderEmail || !isValidSenderEmail(body.form.senderEmail)) {
      return NextResponse.json(
        { error: "Your email is required to track free sends." },
        { status: 400 }
      );
    }
    if (!body.subject?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Letter content is missing." },
        { status: 400 }
      );
    }

    let scheduledAt: Date;
    try {
      scheduledAt = parseScheduledAt(body.scheduledAt);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid schedule time." },
        { status: 400 }
      );
    }

    const senderEmail = normalizeSenderEmail(body.form.senderEmail);
    const isCard = Boolean(
      body.form.cardDesign && isCardDesignId(body.form.cardDesign)
    );
    const access = isCard
      ? await getCardSendAccess(senderEmail)
      : await getSendAccess(senderEmail);
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: isCard
            ? `E-cards are ${CARD_PRICE_LABEL} each — there is no free card allowance.`
            : `Your first ${FREE_LETTERS} letters are free. Extra letters are ${LETTER_PRICE_LABEL} each.`,
          requiresPayment: true,
          price: isCard ? CARD_PRICE_LABEL : LETTER_PRICE_LABEL,
          stripeConfigured: isStripeConfigured(),
        },
        { status: 402 }
      );
    }

    const letter: GeneratedLetter = {
      subject: body.subject,
      message: body.message,
      form: {
        ...body.form,
        senderEmail,
      },
      createdAt: body.createdAt || new Date().toISOString(),
    };

    let voiceNote;
    try {
      voiceNote = parseVoiceNote(body.voiceNote);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Voice note is invalid." },
        { status: 400 }
      );
    }

    try {
      if (isCard) {
        await consumeCardSendAccess(senderEmail);
      } else {
        await consumeSendAccess(senderEmail);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No send credit available.";
      const paymentRequired =
        message.includes("No send credit") ||
        message.includes("No card send credit");
      return NextResponse.json(
        {
          error: paymentRequired
            ? isCard
              ? `E-cards are ${CARD_PRICE_LABEL} each — there is no free card allowance.`
              : `Your first ${FREE_LETTERS} letters are free. Extra letters are ${LETTER_PRICE_LABEL} each.`
            : message,
          requiresPayment: paymentRequired,
          price: isCard ? CARD_PRICE_LABEL : LETTER_PRICE_LABEL,
          stripeConfigured: isStripeConfigured(),
        },
        { status: paymentRequired ? 402 : 503 }
      );
    }

    try {
      const scheduled = await insertScheduledSend({
        senderEmail,
        scheduledAt,
        letter,
        voiceNote,
        shareExample: Boolean(body.shareExample),
        kind: isCard ? "card" : "letter",
      });

      return NextResponse.json({
        ok: true,
        scheduled: true,
        id: scheduled.id,
        scheduledAt: scheduled.scheduledAt,
      });
    } catch (err) {
      try {
        await addPaidCredit(
          `refund-schedule-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          isCard ? "card" : "letter",
          senderEmail
        );
      } catch {
        /* best-effort refund */
      }
      throw err;
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not schedule your letter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

