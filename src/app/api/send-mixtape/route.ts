import { NextResponse } from "next/server";
import { sendMixtapeEmail } from "@/lib/resend";
import type { MixtapePayload } from "@/types";
import {
  consumeMixtapeSendAccess,
  getMixtapeSendAccess,
  isValidSenderEmail,
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
  mixtapePrice,
  normalizeSenderEmail,
} from "@/lib/usage";
import { isStripeConfigured } from "@/lib/stripe";
import {
  getTracksByIds,
  MAX_MIXTAPE_TRACKS,
  MIN_MIXTAPE_TRACKS,
  youtubeTrackId,
} from "@/lib/tracks";
import { addMixtapeExample } from "@/lib/shared-examples";
import { parseVoiceNote } from "@/lib/voice-note";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MixtapePayload> & {
      shareExample?: boolean;
      voiceNote?: unknown;
    };

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
    if (!body.senderEmail || !isValidSenderEmail(body.senderEmail)) {
      return NextResponse.json(
        { error: "Your email is required to track free mixtape sends." },
        { status: 400 }
      );
    }
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Mixtape title is required." },
        { status: 400 }
      );
    }

    const trackIds = Array.isArray(body.trackIds) ? body.trackIds : [];
    if (trackIds.length < MIN_MIXTAPE_TRACKS) {
      return NextResponse.json(
        { error: `Pick at least ${MIN_MIXTAPE_TRACKS} songs.` },
        { status: 400 }
      );
    }
    if (trackIds.length > MAX_MIXTAPE_TRACKS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_MIXTAPE_TRACKS} tracks.` },
        { status: 400 }
      );
    }

    const customTracks = Array.isArray(body.customTracks) ? body.customTracks : [];
    const tracks = getTracksByIds(trackIds, customTracks);
    if (tracks.length !== trackIds.length) {
      return NextResponse.json(
        { error: "One or more tracks are invalid." },
        { status: 400 }
      );
    }

    const senderEmail = normalizeSenderEmail(body.senderEmail);
    const access = await getMixtapeSendAccess(senderEmail);
    if (!access.allowed) {
      const price = mixtapePrice(trackIds.length);
      return NextResponse.json(
        {
          error: `Your first mixtape is free. Extra mixtapes are ${MIX_ONE_SONG_LABEL} for 1 song, or ${MIX_MULTI_SONG_LABEL} for 2 or more. This mix is ${price.label} — pay to send.`,
          requiresPayment: true,
          price: price.label,
          stripeConfigured: isStripeConfigured(),
        },
        { status: 402 }
      );
    }

    const mix: MixtapePayload = {
      recipientName: body.recipientName.trim(),
      recipientEmail: body.recipientEmail.trim(),
      senderName: body.senderName.trim(),
      senderEmail,
      title: body.title.trim().slice(0, 80),
      dedication: (body.dedication ?? "").trim().slice(0, 500),
      trackIds,
      customTracks: customTracks.filter(
        (t) =>
          trackIds.includes(t.id) ||
          trackIds.includes(youtubeTrackId(t.youtubeId))
      ),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    let voiceNote;
    try {
      voiceNote = parseVoiceNote(body.voiceNote);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Voice note is invalid." },
        { status: 400 }
      );
    }
    const result = await sendMixtapeEmail(mix, voiceNote);
    const usage = await consumeMixtapeSendAccess(senderEmail);

    if (body.shareExample) {
      try {
        await addMixtapeExample(mix);
      } catch {
        /* optional — never fail the send */
      }
    }

    return NextResponse.json({
      ok: true,
      id: result.id,
      simulated: result.simulated,
      provider: result.provider,
      used: access.reason,
      mixFreeUsed: usage.mixFreeUsed,
      creditsLeft: usage.credits,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not send the mixtape.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
