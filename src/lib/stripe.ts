import Stripe from "stripe";
import { SITE_URL } from "@/lib/constants";
import {
  LETTER_PRICE_LABEL,
  LETTER_PRICE_PENCE,
  mixtapePrice,
  type CheckoutKind,
} from "@/lib/usage";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createSendCheckoutSession(opts: {
  clientId?: string;
  returnPath?: string;
  kind?: CheckoutKind;
  trackCount?: number;
}) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured yet.");
  }

  const kind: CheckoutKind = opts.kind === "mixtape" ? "mixtape" : "letter";
  const returnPath = opts.returnPath ?? "/preview";
  const base = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "");
  const safePath = returnPath.startsWith("/") ? returnPath : `/${returnPath}`;

  const trackCount = Math.max(1, Math.floor(opts.trackCount ?? 1));
  const mix = mixtapePrice(trackCount);

  const product =
    kind === "mixtape"
      ? {
          pence: mix.pence,
          label: mix.label,
          name: mix.name,
          description: mix.description,
        }
      : {
          pence: LETTER_PRICE_PENCE,
          label: LETTER_PRICE_LABEL,
          name: "Little Letter send",
          description: "Send one extra little letter by email",
        };

  return stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${base}${safePath}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}${safePath}?cancelled=1`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: product.pence,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      },
    ],
    metadata: {
      clientId: opts.clientId ?? "browser",
      product: kind === "mixtape" ? "little-letter-mixtape" : "little-letter-send",
      kind,
      trackCount: String(kind === "mixtape" ? trackCount : 0),
      priceLabel: product.label,
    },
  });
}

export async function verifyPaidCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured yet.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error("Payment is not complete yet.");
  }

  return { session };
}
