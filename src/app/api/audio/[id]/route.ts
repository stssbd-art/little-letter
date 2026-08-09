import { NextResponse } from "next/server";
import { MIX_TRACKS } from "@/lib/tracks";

export const dynamic = "force-dynamic";

/** Proxy redirect so playback stays same-origin for picky browsers. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const track = MIX_TRACKS.find((t) => t.id === id);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  return NextResponse.redirect(track.src, 302);
}
