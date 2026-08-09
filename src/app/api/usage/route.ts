import { NextResponse } from "next/server";
import { verifyPaidCheckoutSession } from "@/lib/stripe";
import { addPaidCredit, readUsage, SEND_PRICE_LABEL } from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function GET() {
  const usage = await readUsage();
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
