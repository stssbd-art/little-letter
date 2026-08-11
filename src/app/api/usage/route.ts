import { NextResponse } from "next/server";
import { verifyPaidCheckoutSession } from "@/lib/stripe";
import {
  addPaidCredit,
  FREE_MIXTAPES,
  isDemoMode,
  readUsage,
  SEND_PRICE_LABEL,
} from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const usage = await readUsage();
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const demo = isDemoMode();

  if (kind === "mixtape") {
    const mixFreeLeft = demo
      ? FREE_MIXTAPES
      : Math.max(0, FREE_MIXTAPES - usage.mixFreeUsed);
    const freeAvailable = demo || mixFreeLeft > 0;
    const canSend = demo || freeAvailable || usage.credits > 0;

    return NextResponse.json({
      demo,
      freeAvailable,
      freeLeft: mixFreeLeft,
      freeTotal: FREE_MIXTAPES,
      credits: usage.credits,
      canSend,
      price: SEND_PRICE_LABEL,
    });
  }

  const freeAvailable = demo || !usage.freeUsed;
  const canSend = demo || freeAvailable || usage.credits > 0;

  return NextResponse.json({
    demo,
    freeAvailable,
    credits: usage.credits,
    canSend,
    price: SEND_PRICE_LABEL,
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
