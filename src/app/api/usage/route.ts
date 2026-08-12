import { NextResponse } from "next/server";
import { verifyPaidCheckoutSession } from "@/lib/stripe";
import {
  addPaidCredit,
  FREE_LETTERS,
  isDemoMode,
  LETTER_PRICE_LABEL,
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
  mixtapePrice,
  readUsage,
  type CheckoutKind,
} from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const usage = await readUsage();
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const demo = isDemoMode();
  const trackCount = Number(url.searchParams.get("trackCount") || "1");

  if (kind === "mixtape") {
    const priceInfo = mixtapePrice(Number.isFinite(trackCount) ? trackCount : 1);
    const canSend = demo || usage.mixCredits > 0;

    return NextResponse.json({
      demo,
      freeAvailable: false,
      freeLeft: 0,
      freeTotal: 0,
      credits: usage.mixCredits,
      canSend,
      price: priceInfo.label,
      priceOneSong: MIX_ONE_SONG_LABEL,
      priceMultiSong: MIX_MULTI_SONG_LABEL,
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

    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    const { session } = await verifyPaidCheckoutSession(sessionId);
    const kind = (session.metadata?.kind === "mixtape"
      ? "mixtape"
      : "letter") as CheckoutKind;
    const result = await addPaidCredit(sessionId, kind);
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
          : LETTER_PRICE_LABEL,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not verify payment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
