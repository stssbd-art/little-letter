import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { MixShare } from "@/lib/mixtape-link";
import { MIX_TRACKS } from "@/lib/tracks";
import { SITE_URL } from "@/lib/constants";

const DATA_DIR = path.join(process.cwd(), ".data", "mixtapes");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function cleanShare(mix: MixShare): MixShare {
  return {
    title: mix.title.slice(0, 80),
    from: mix.from.slice(0, 60),
    to: mix.to.slice(0, 60),
    note: mix.note.slice(0, 500),
    tracks: mix.tracks.filter((id) => MIX_TRACKS.some((t) => t.id === id)),
  };
}

export async function saveMixShare(mix: MixShare): Promise<string> {
  const payload = cleanShare(mix);
  if (!payload.title.trim()) {
    throw new Error("Mixtape needs a title.");
  }
  if (!payload.tracks.length && !payload.note.trim()) {
    throw new Error("Mixtape needs a note or tracks.");
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
  const base = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "");
  return `${base}/mix/${id}`;
}
