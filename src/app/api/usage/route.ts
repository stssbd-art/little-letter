import { NextResponse } from "next/server";
import { verifyPaidCheckoutSession } from "@/lib/stripe";
import {
  addPaidCredit,
  FREE_MIXTAPES,
  readUsage,
  SEND_PRICE_LABEL,
} from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const usage = await readUsage();
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");

  if (kind === "mixtape") {
    const mixFreeLeft = Math.max(0, FREE_MIXTAPES - usage.mixFreeUsed);
    const freeAvailable = mixFreeLeft > 0;
    const canSend = freeAvailable || usage.credits > 0;

    return NextResponse.json({
      freeAvailable,
      freeLeft: mixFreeLeft,
      freeTotal: FREE_MIXTAPES,
      credits: usage.credits,
      canSend,
      price: SEND_PRICE_LABEL,
    });
  }

  const freeAvailable = !usage.freeUsed;
  const canSend = freeAvailable || usage.credits > 0;

  return NextResponse.json({
    freeAvailable,
    credits: usage.credits,
    canSend,
    price: SEND_PRICE_LABEL,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
    }

    await verifyPaidCheckoutSession(sessionId);
    const result = await addPaidCredit(sessionId);
    return NextResponse.json({
      ok: true,
      alreadyApplied: result.alreadyApplied,
      credits: result.usage.credits,
      price: SEND_PRICE_LABEL,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not verify payment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
