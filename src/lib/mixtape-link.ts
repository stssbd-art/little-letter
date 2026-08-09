import { SITE_URL } from "@/lib/constants";
import { getTracksByIds, MIX_TRACKS } from "@/lib/tracks";

export type MixShare = {
  title: string;
  from: string;
  to: string;
  note: string;
  tracks: string[];
};

/** Browser + Node safe base64url helpers (no Buffer on the client). */
function toBase64Url(text: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(text, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(code: string): string {
  const padded = code.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const base64 = padded + pad;

  if (typeof window === "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeMixShare(mix: MixShare): string {
  const payload = {
    title: mix.title.slice(0, 80),
    from: mix.from.slice(0, 60),
    to: mix.to.slice(0, 60),
    note: mix.note.slice(0, 500),
    tracks: mix.tracks.filter((id) => MIX_TRACKS.some((t) => t.id === id)),
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeMixShare(code: string): MixShare | null {
  try {
    const raw = fromBase64Url(code.trim());
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
