import { NextResponse } from "next/server";
import { createSendCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { isDemoMode, SEND_PRICE_LABEL } from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isDemoMode()) {
      return NextResponse.json(
        {
          error:
            "Demo mode is on — sends are free. Unset DEMO_MODE for public paid sends.",
        },
        { status: 503 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Payments are not set up yet. Add STRIPE_SECRET_KEY in Vercel to charge £0.50 after the first email.",
        },
        { status: 503 }
      );
    }

    let returnPath = "/preview";
    try {
      const body = (await request.json()) as { returnPath?: string };
      if (
        body?.returnPath === "/mixtape" ||
        body?.returnPath === "/preview"
      ) {
        returnPath = body.returnPath;
      }
    } catch {
      /* empty body is fine */
    }

    const session = await createSendCheckoutSession("browser", returnPath);
    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      price: SEND_PRICE_LABEL,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
