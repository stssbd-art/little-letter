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
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
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

async function searchYoutubeApi(query: string): Promise<YoutubeSearchHit[] | null> {
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

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ error: "Type at least 2 characters." }, { status: 400 });
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

    const results = await searchYoutubeApi(q);
    if (results) {
      return NextResponse.json({ results });
    }

    return NextResponse.json({
      results: [],
      hint: "Paste a YouTube link, or add YOUTUBE_API_KEY on Vercel to search by song name.",
    });
  } catch {
    return NextResponse.json({ error: "YouTube search failed." }, { status: 500 });
  }
}
