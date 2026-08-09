import { NextResponse } from "next/server";
import { createSendCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import { SEND_PRICE_LABEL } from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Payments are not set up yet. Add STRIPE_SECRET_KEY in Vercel to charge £0.50 after the first email.",
        },
        { status: 503 }
      );
    }

    // clientId kept for Stripe metadata / support, but access is cookie-based
    const session = await createSendCheckoutSession("browser");
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
