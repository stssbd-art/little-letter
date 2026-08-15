import { SITE_URL } from "@/lib/constants";
import {
  getTracksByIds,
  isValidYoutubeId,
  MIX_TRACKS,
  parseYoutubeIdFromTrackId,
  youtubeTrackId,
  type MixTrack,
} from "@/lib/tracks";

export type MixShare = {
  title: string;
  from: string;
  to: string;
  note: string;
  tracks: string[];
  extras?: MixTrack[];
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

function sanitizeField(text: string, max: number) {
  return text.replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Compact share codes keep email / SMS links short so clients don't truncate
 * them (which made mixtapes look like they "disappeared").
 * Format 1: 1.<base64url(title\x1ffrom\x1fto\x1fnote\x1f0.3.5)>  catalog only
 * Format 2: 2.<base64url(...\x1fc0\x1eyVIDEO\x1dTitle\x1dArtist)>  catalog + YouTube
 */
export function encodeMixShare(mix: MixShare): string {
  const extras = mix.extras ?? [];
  const catalogIndices: number[] = [];
  const v2Items: string[] = [];

  for (const id of mix.tracks) {
    const catalogIndex = MIX_TRACKS.findIndex((t) => t.id === id);
    if (catalogIndex >= 0) {
      catalogIndices.push(catalogIndex);
      v2Items.push(`c${catalogIndex}`);
      continue;
    }
    const youtubeId = parseYoutubeIdFromTrackId(id);
    if (!youtubeId || !isValidYoutubeId(youtubeId)) continue;
    const extra = extras.find((t) => t.id === id || t.youtubeId === youtubeId);
    const title = sanitizeField(extra?.title || "Song", 48);
    const artist = sanitizeField(extra?.artist || "YouTube", 36);
    v2Items.push(`y${youtubeId}\u001d${title}\u001d${artist}`);
  }

  if (!v2Items.length) {
    throw new Error("Mixtape needs playable tracks.");
  }

  const payloadHead = [
    mix.title.slice(0, 80),
    mix.from.slice(0, 60),
    mix.to.slice(0, 60),
    mix.note.slice(0, 500),
  ];

  if (v2Items.length === catalogIndices.length) {
    return `1.${toBase64Url([...payloadHead, catalogIndices.join(".")].join("\u001f"))}`;
  }

  return `2.${toBase64Url([...payloadHead, v2Items.join("\u001e")].join("\u001f"))}`;
}

function decodeCompactV1(code: string): MixShare | null {
  if (!code.startsWith("1.")) return null;
  try {
    const raw = fromBase64Url(code.slice(2));
    const [title, from, to, note, indexPart] = raw.split("\u001f");
    if (!title || !indexPart) return null;
    const tracks = indexPart
      .split(".")
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < MIX_TRACKS.length)
      .map((n) => MIX_TRACKS[n]!.id);
    if (!tracks.length) return null;
    return {
      title: title.slice(0, 80),
      from: (from ?? "").slice(0, 60),
      to: (to ?? "").slice(0, 60),
      note: (note ?? "").slice(0, 500),
      tracks,
    };
  } catch {
    return null;
  }
}

function decodeCompactV2(code: string): MixShare | null {
  if (!code.startsWith("2.")) return null;
  try {
    const raw = fromBase64Url(code.slice(2));
    const [title, from, to, note, trackPart] = raw.split("\u001f");
    if (!title || !trackPart) return null;

    const tracks: string[] = [];
    const extras: MixTrack[] = [];

    for (const item of trackPart.split("\u001e")) {
      if (item.startsWith("c")) {
        const n = Number(item.slice(1));
        if (!Number.isInteger(n) || n < 0 || n >= MIX_TRACKS.length) continue;
        tracks.push(MIX_TRACKS[n]!.id);
        continue;
      }
      if (!item.startsWith("y")) continue;
      const [idPart, titlePart, artistPart] = item.slice(1).split("\u001d");
      if (!idPart || !isValidYoutubeId(idPart)) continue;
      const id = youtubeTrackId(idPart);
      tracks.push(id);
      extras.push({
        id,
        title: sanitizeField(titlePart || "Song", 48),
        artist: sanitizeField(artistPart || "YouTube", 36),
        year: "",
        youtubeId: idPart,
      });
    }

    if (!tracks.length) return null;
    return {
      title: title.slice(0, 80),
      from: (from ?? "").slice(0, 60),
      to: (to ?? "").slice(0, 60),
      note: (note ?? "").slice(0, 500),
      tracks,
      extras: extras.length ? extras : undefined,
    };
  } catch {
    return null;
  }
}

function decodeLegacyJson(code: string): MixShare | null {
  try {
    const raw = fromBase64Url(code.trim());
    const data = JSON.parse(raw) as Partial<MixShare>;
    if (!data.title || !Array.isArray(data.tracks) || data.tracks.length < 1) {
      return null;
    }
    const extras = Array.isArray(data.extras) ? data.extras : [];
    const tracks = data.tracks.filter(
      (id) =>
        MIX_TRACKS.some((t) => t.id === id) ||
        Boolean(parseYoutubeIdFromTrackId(id))
    );
    if (!tracks.length) return null;
    return {
      title: String(data.title).slice(0, 80),
      from: String(data.from ?? "").slice(0, 60),
      to: String(data.to ?? "").slice(0, 60),
      note: String(data.note ?? "").slice(0, 500),
      tracks,
      extras,
    };
  } catch {
    return null;
  }
}

export function decodeMixShare(code: string): MixShare | null {
  const trimmed = code.trim();
  return decodeCompactV2(trimmed) ?? decodeCompactV1(trimmed) ?? decodeLegacyJson(trimmed);
}

export function buildMixPlayUrl(mix: MixShare): string {
  const base = SITE_URL;
  return `${base}/mix/${encodeMixShare(mix)}`;
}

export function resolveShareTracks(mix: MixShare) {
  return getTracksByIds(mix.tracks, mix.extras);
}