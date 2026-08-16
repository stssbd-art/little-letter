import { NextResponse } from "next/server";
import { createSendCheckoutSession, isStripeConfigured } from "@/lib/stripe";
import {
  isDemoMode,
  isValidSenderEmail,
  LETTER_PRICE_LABEL,
  mixtapePrice,
  normalizeSenderEmail,
  type CheckoutKind,
} from "@/lib/usage";

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
            "Payments are not set up yet. Add STRIPE_SECRET_KEY in Vercel to enable checkout.",
        },
        { status: 503 }
      );
    }

    let returnPath = "/preview";
    let kind: CheckoutKind = "letter";
    let trackCount = 1;
    let senderEmail = "";
    try {
      const body = (await request.json()) as {
        returnPath?: string;
        kind?: string;
        trackCount?: number;
        senderEmail?: string;
      };
      if (body?.returnPath === "/mixtape" || body?.returnPath === "/preview") {
        returnPath = body.returnPath;
      }
      if (body?.kind === "mixtape" || returnPath === "/mixtape") {
        kind = "mixtape";
      }
      if (typeof body?.trackCount === "number" && body.trackCount > 0) {
        trackCount = Math.floor(body.trackCount);
      }
      if (body?.senderEmail && isValidSenderEmail(body.senderEmail)) {
        senderEmail = normalizeSenderEmail(body.senderEmail);
      }
    } catch {
      /* empty body is fine */
    }

    if (!senderEmail) {
      return NextResponse.json(
        {
          error:
            "Your email is required before checkout so we can attach the paid credit to you.",
        },
        { status: 400 }
      );
    }

    const session = await createSendCheckoutSession({
      clientId: "browser",
      returnPath,
      kind,
      trackCount,
      senderEmail,
    });
    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session." },
        { status: 500 }
      );
    }

    const price =
      kind === "mixtape"
        ? mixtapePrice(trackCount).label
        : LETTER_PRICE_LABEL;

    return NextResponse.json({
      url: session.url,
      price,
      kind,
      trackCount: kind === "mixtape" ? trackCount : undefined,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
