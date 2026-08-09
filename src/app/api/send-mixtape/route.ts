import { NextResponse } from "next/server";
import { sendMixtapeEmail } from "@/lib/resend";
import type { MixtapePayload } from "@/types";
import {
  consumeSendAccess,
  getSendAccess,
  SEND_PRICE_LABEL,
} from "@/lib/usage";
import { isStripeConfigured } from "@/lib/stripe";
import {
  getTracksByIds,
  MAX_MIXTAPE_TRACKS,
  MIN_MIXTAPE_TRACKS,
} from "@/lib/tracks";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MixtapePayload>;

    if (!body.recipientEmail || !isValidEmail(body.recipientEmail)) {
      return NextResponse.json(
        { error: "Valid recipient email required." },
        { status: 400 }
      );
    }
    if (!body.recipientName?.trim() || !body.senderName?.trim()) {
      return NextResponse.json(
        { error: "Recipient and sender names are required." },
        { status: 400 }
      );
    }
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Mixtape title is required." },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.trackIds) || body.trackIds.length < MIN_MIXTAPE_TRACKS) {
      return NextResponse.json(
        { error: `Pick at least ${MIN_MIXTAPE_TRACKS} tracks.` },
        { status: 400 }
      );
    }
    if (body.trackIds.length > MAX_MIXTAPE_TRACKS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_MIXTAPE_TRACKS} tracks.` },
        { status: 400 }
      );
    }

    const tracks = getTracksByIds(body.trackIds);
    if (tracks.length !== body.trackIds.length) {
      return NextResponse.json(
        { error: "One or more tracks are invalid." },
        { status: 400 }
      );
    }

    const access = await getSendAccess();
    if (!access.allowed) {
      return NextResponse.json(
        {
          error: `Your first send is free. Extra mixtapes are ${SEND_PRICE_LABEL} each.`,
          requiresPayment: true,
          price: SEND_PRICE_LABEL,
          stripeConfigured: isStripeConfigured(),
        },
        { status: 402 }
      );
    }

    const mix: MixtapePayload = {
      recipientName: body.recipientName.trim(),
      recipientEmail: body.recipientEmail.trim(),
      senderName: body.senderName.trim(),
      title: body.title.trim().slice(0, 80),
      dedication: (body.dedication ?? "").trim().slice(0, 500),
      trackIds: body.trackIds,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const result = await sendMixtapeEmail(mix);
    const usage = await consumeSendAccess();

    return NextResponse.json({
      ok: true,
      id: result.id,
      simulated: result.simulated,
      provider: result.provider,
      used: access.reason,
      freeUsed: usage.freeUsed,
      creditsLeft: usage.credits,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not send the mixtape.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
