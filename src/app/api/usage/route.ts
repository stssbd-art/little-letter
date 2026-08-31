import { NextResponse } from "next/server";
import { verifyPaidCheckoutSession } from "@/lib/stripe";
import {
  addPaidCredit,
  FREE_LETTERS,
  FREE_MIXTAPES,
  FREE_CARDS,
  hasUsageDatabase,
  isDemoMode,
  isValidSenderEmail,
  LETTER_PRICE_LABEL,
  CARD_PRICE_LABEL,
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
  mixtapePrice,
  normalizeSenderEmail,
  readUsage,
  type CheckoutKind,
} from "@/lib/usage";
import { processDueScheduledSends } from "@/lib/scheduled-sends";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  /* Hobby plan only allows daily cron — also drain due scheduled letters on traffic. */
  void processDueScheduledSends(3).catch(() => {});

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const demo = isDemoMode();
  const trackCount = Number(url.searchParams.get("trackCount") || "1");
  const emailRaw = url.searchParams.get("email")?.trim() || "";
  const senderEmail = isValidSenderEmail(emailRaw)
    ? normalizeSenderEmail(emailRaw)
    : undefined;
  const usage = await readUsage(senderEmail);

  if (kind === "mixtape") {
    const priceInfo = mixtapePrice(Number.isFinite(trackCount) ? trackCount : 1);
    const freeLeft = demo
      ? FREE_MIXTAPES
      : Math.max(0, FREE_MIXTAPES - usage.mixFreeUsed);
    const freeAvailable = demo || freeLeft > 0;
    const canSend = demo || freeAvailable || usage.mixCredits > 0;

    return NextResponse.json({
      demo,
      freeAvailable,
      freeLeft,
      freeTotal: FREE_MIXTAPES,
      credits: usage.mixCredits,
      canSend,
      price: priceInfo.label,
      priceOneSong: MIX_ONE_SONG_LABEL,
      priceMultiSong: MIX_MULTI_SONG_LABEL,
      trackedByEmail: Boolean(senderEmail),
      emailDb: hasUsageDatabase(),
    });
  }

  if (kind === "card") {
    const freeLeft = 0;
    const freeAvailable = demo;
    const canSend = demo || usage.letterCredits > 0;

    return NextResponse.json({
      demo,
      freeAvailable,
      freeLeft,
      freeTotal: FREE_CARDS,
      credits: usage.letterCredits,
      canSend,
      price: CARD_PRICE_LABEL,
      trackedByEmail: Boolean(senderEmail),
      emailDb: hasUsageDatabase(),
    });
  }

  const freeLeft = demo
    ? FREE_LETTERS
    : Math.max(0, FREE_LETTERS - usage.letterFreeUsed);
  const freeAvailable = demo || freeLeft > 0;
  const canSend = demo || freeAvailable || usage.letterCredits > 0;

  return NextResponse.json({
    demo,
    freeAvailable,
    freeLeft,
    freeTotal: FREE_LETTERS,
    credits: usage.letterCredits,
    canSend,
    price: LETTER_PRICE_LABEL,
    trackedByEmail: Boolean(senderEmail),
    emailDb: hasUsageDatabase(),
  });
}

export async function POST(request: Request) {
  try {
    if (isDemoMode()) {
      return NextResponse.json(
        { error: "Payments are off while demo mode is on." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as {
      sessionId?: string;
      senderEmail?: string;
    };
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    const { session } = await verifyPaidCheckoutSession(sessionId);
    const metaKind = session.metadata?.kind;
    const kind = (metaKind === "mixtape"
      ? "mixtape"
      : metaKind === "card"
        ? "card"
        : "letter") as CheckoutKind;
    const metaEmail = session.metadata?.senderEmail?.trim() || "";
    const bodyEmail = body.senderEmail?.trim() || "";
    const senderEmail = isValidSenderEmail(metaEmail)
      ? normalizeSenderEmail(metaEmail)
      : isValidSenderEmail(bodyEmail)
        ? normalizeSenderEmail(bodyEmail)
        : undefined;

    const result = await addPaidCredit(sessionId, kind, senderEmail);
    return NextResponse.json({
      ok: true,
      alreadyApplied: result.alreadyApplied,
      credits:
        kind === "mixtape"
          ? result.usage.mixCredits
          : result.usage.letterCredits,
      kind,
      price:
        kind === "mixtape"
          ? session.metadata?.priceLabel ?? MIX_MULTI_SONG_LABEL
          : kind === "card"
            ? session.metadata?.priceLabel ?? CARD_PRICE_LABEL
            : LETTER_PRICE_LABEL,
      trackedByEmail: Boolean(senderEmail),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not verify payment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
