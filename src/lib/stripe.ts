import Stripe from "stripe";
import { SITE_URL } from "@/lib/constants";
import { SEND_PRICE_PENCE } from "@/lib/usage";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createSendCheckoutSession(clientId: string) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured yet.");
  }

  const base = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "");

  return stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${base}/preview?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/preview?cancelled=1`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: SEND_PRICE_PENCE,
          product_data: {
            name: "Little Letter send",
            description: "Send one extra little letter",
          },
        },
      },
    ],
    metadata: {
      clientId,
      product: "little-letter-send",
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
