import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type YoutubeSearchHit = {
  youtubeId: string;
  title: string;
  artist: string;
};

function extractYoutubeId(raw: string): string | null {
  const q = raw.trim();
  if (/^[\w-]{11}$/.test(q)) return q;

  try {
    const url = new URL(q.startsWith("http") ? q : `https://${q}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") &&
        parts[1] &&
        /^[\w-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function cleanTitle(title: string) {
  return title.replace(/\s+/g, " ").trim().slice(0, 80);
}

async function lookupOEmbed(youtubeId: string): Promise<YoutubeSearchHit | null> {
  const watch = `https://www.youtube.com/watch?v=${youtubeId}`;
  const res = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { title?: string; author_name?: string };
  if (!data.title) return null;
  return {
    youtubeId,
    title: cleanTitle(data.title),
    artist: cleanTitle(data.author_name || "YouTube"),
  };
}

/** Official Data API — only when YOUTUBE_API_KEY is set. */
async function searchYoutubeDataApi(query: string): Promise<YoutubeSearchHit[] | null> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "8");
  url.searchParams.set("q", query);
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("key", key);

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: { title?: string; channelTitle?: string };
    }>;
  };

  return (data.items ?? [])
    .map((item) => {
      const youtubeId = item.id?.videoId;
      const title = item.snippet?.title;
      if (!youtubeId || !title) return null;
      return {
        youtubeId,
        title: cleanTitle(title),
        artist: cleanTitle(item.snippet?.channelTitle || "YouTube"),
      };
    })
    .filter((hit): hit is YoutubeSearchHit => Boolean(hit));
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function textFromRuns(value: unknown): string {
  const obj = asRecord(value);
  if (!obj) return "";
  if (typeof obj.simpleText === "string") return obj.simpleText;
  if (Array.isArray(obj.runs)) {
    return obj.runs
      .map((run) => {
        const r = asRecord(run);
        return typeof r?.text === "string" ? r.text : "";
      })
      .join("");
  }
  return "";
}

/**
 * Search via YouTube’s own web client API (no Google Cloud key required).
 * Used so song-name search works out of the box on Vercel.
 */
async function searchYoutubeInnertube(query: string): Promise<YoutubeSearchHit[]> {
  const res = await fetch(
    "https://www.youtube.com/youtubei/v1/search?prettyPrint=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20250313.00.00",
            hl: "en",
            gl: "US",
          },
        },
        query,
      }),
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) return [];
  const data = (await res.json()) as unknown;
  const hits: YoutubeSearchHit[] = [];
  const seen = new Set<string>();

  function walk(node: unknown) {
    const obj = asRecord(node);
    if (!obj) return;

    const renderer = asRecord(obj.videoRenderer);
    if (renderer && typeof renderer.videoId === "string") {
      const youtubeId = renderer.videoId;
      const title = cleanTitle(textFromRuns(renderer.title));
      const artist = cleanTitle(
        textFromRuns(renderer.ownerText) ||
          textFromRuns(renderer.shortBylineText) ||
          "YouTube"
      );
      if (
        /^[\w-]{11}$/.test(youtubeId) &&
        title &&
        !seen.has(youtubeId)
      ) {
        seen.add(youtubeId);
        hits.push({ youtubeId, title, artist });
      }
    }

    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") walk(value);
    }
  }

  walk(data);
  return hits.slice(0, 8);
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json(
      { error: "Type at least 2 characters." },
      { status: 400 }
    );
  }
  if (q.length > 80) {
    return NextResponse.json({ error: "Search is too long." }, { status: 400 });
  }

  try {
    const asId = extractYoutubeId(q);
    if (asId) {
      const hit = await lookupOEmbed(asId);
      return NextResponse.json({ results: hit ? [hit] : [] });
    }

    const official = await searchYoutubeDataApi(q);
    if (official && official.length) {
      return NextResponse.json({ results: official });
    }

    const results = await searchYoutubeInnertube(q);
    if (results.length) {
      return NextResponse.json({ results });
    }

    return NextResponse.json({
      results: [],
      hint: "No songs found. Try another name, or paste a YouTube link.",
    });
  } catch {
    return NextResponse.json(
      { error: "YouTube search failed. Try again, or paste a YouTube link." },
      { status: 500 }
    );
  }
}
