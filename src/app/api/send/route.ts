import { NextResponse } from "next/server";
import { sendLetterEmail } from "@/lib/resend";
import type { GeneratedLetter } from "@/types";
import {
  addPaidCredit,
  consumeSendAccess,
  consumeCardSendAccess,
  FREE_LETTERS,
  getSendAccess,
  getCardSendAccess,
  isValidSenderEmail,
  LETTER_PRICE_LABEL,
  CARD_PRICE_LABEL,
  normalizeSenderEmail,
} from "@/lib/usage";
import { isStripeConfigured } from "@/lib/stripe";
import { addLetterExample } from "@/lib/shared-examples";
import { parseVoiceNote } from "@/lib/voice-note";
import { isCardDesignId } from "@/lib/card-designs";
import { resolveLetterStationeryId } from "@/lib/letter-stationery";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeneratedLetter & {
      shareExample?: boolean;
      voiceNote?: unknown;
    };

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
        stationery: body.form.cardDesign
          ? undefined
          : resolveLetterStationeryId(body.form.stationery),
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

    /* Reserve free/credit slot before emailing so parallel sends cannot overshoot. */
    let usage;
    try {
      usage = isCard
        ? await consumeCardSendAccess(senderEmail)
        : await consumeSendAccess(senderEmail);
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
      const result = await sendLetterEmail(letter, voiceNote);

      if (body.shareExample) {
        try {
          await addLetterExample(letter);
        } catch {
          /* optional — never fail the send */
        }
      }

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
      /* Slot already consumed; grant a paid credit so the sender is not stranded. */
      try {
        await addPaidCredit(
          `refund-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
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
      err instanceof Error ? err.message : "Could not send the letter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
