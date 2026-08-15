import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { MixShare } from "@/lib/mixtape-link";
import {
  isValidYoutubeId,
  MIX_TRACKS,
  parseYoutubeIdFromTrackId,
  youtubeTrackId,
} from "@/lib/tracks";
import { SITE_URL } from "@/lib/constants";

const DATA_DIR = path.join(process.cwd(), ".data", "mixtapes");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function cleanShare(mix: MixShare): MixShare {
  const extras = (mix.extras ?? []).filter((t) => isValidYoutubeId(t.youtubeId));
  const tracks = mix.tracks.filter((id) => {
    if (MIX_TRACKS.some((t) => t.id === id)) return true;
    const youtubeId = parseYoutubeIdFromTrackId(id);
    return Boolean(
      youtubeId && extras.some((t) => t.youtubeId === youtubeId || t.id === id)
    );
  });
  return {
    title: mix.title.slice(0, 80),
    from: mix.from.slice(0, 60),
    to: mix.to.slice(0, 60),
    note: mix.note.slice(0, 500),
    tracks,
    extras: extras.length
      ? extras.map((t) => ({
          ...t,
          id: t.id.startsWith("yt:") ? t.id : youtubeTrackId(t.youtubeId),
        }))
      : undefined,
  };
}

export async function saveMixShare(mix: MixShare): Promise<string> {
  const payload = cleanShare(mix);
  if (!payload.tracks.length) {
    throw new Error("Mixtape needs playable tracks.");
  }

  await ensureDir();
  const id = randomBytes(4).toString("hex");
  await fs.writeFile(
    path.join(DATA_DIR, `${id}.json`),
    JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
    "utf8"
  );
  return id;
}

export async function loadMixShare(id: string): Promise<MixShare | null> {
  if (!/^[a-f0-9]{8}$/i.test(id)) return null;
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf8");
    const data = JSON.parse(raw) as MixShare;
    const cleaned = cleanShare(data);
    return cleaned.tracks.length ? cleaned : null;
  } catch {
    return null;
  }
}

export function buildShortMixPlayUrl(id: string): string {
  const base = SITE_URL;
  return `${base}/mix/${id}`;
}
