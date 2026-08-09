import { SITE_URL } from "@/lib/constants";
import { getTracksByIds, MIX_TRACKS } from "@/lib/tracks";

export type MixShare = {
  title: string;
  from: string;
  to: string;
  note: string;
  tracks: string[];
};

export function encodeMixShare(mix: MixShare): string {
  const payload = {
    title: mix.title.slice(0, 80),
    from: mix.from.slice(0, 60),
    to: mix.to.slice(0, 60),
    note: mix.note.slice(0, 500),
    tracks: mix.tracks.filter((id) => MIX_TRACKS.some((t) => t.id === id)),
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeMixShare(code: string): MixShare | null {
  try {
    const raw = Buffer.from(code, "base64url").toString("utf8");
    const data = JSON.parse(raw) as Partial<MixShare>;
    if (!data.title || !Array.isArray(data.tracks) || data.tracks.length < 1) {
      return null;
    }
    const tracks = data.tracks.filter((id) =>
      MIX_TRACKS.some((t) => t.id === id)
    );
    if (!tracks.length) return null;
    return {
      title: String(data.title).slice(0, 80),
      from: String(data.from ?? "").slice(0, 60),
      to: String(data.to ?? "").slice(0, 60),
      note: String(data.note ?? "").slice(0, 500),
      tracks,
    };
  } catch {
    return null;
  }
}

export function buildMixPlayUrl(mix: MixShare): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "");
  return `${base}/mix/${encodeMixShare(mix)}`;
}

export function resolveShareTracks(mix: MixShare) {
  return getTracksByIds(mix.tracks);
}
