/** Romantic favourites — verified playable YouTube embeds. */
export type MixTrack = {
  id: string;
  title: string;
  artist: string;
  year: string;
  youtubeId: string;
  mood?: "romantic" | "upbeat" | "soft";
};

export const MIX_TRACKS: MixTrack[] = [
  {
    id: "alice",
    title: "Alice",
    artist: "Calema",
    year: "2024",
    mood: "romantic",
    youtubeId: "Fzl5kg8kV3c",
  },
  {
    id: "always-love-you",
    title: "I Will Always Love You",
    artist: "Whitney Houston",
    year: "1992",
    mood: "romantic",
    youtubeId: "3JWTaaS7LdU",
  },
  {
    id: "everything-i-do",
    title: "(Everything I Do) I Do It for You",
    artist: "Bryan Adams",
    year: "1991",
    mood: "romantic",
    youtubeId: "Y0pdQU87dc8",
  },
  {
    id: "your-song",
    title: "Your Song",
    artist: "Elton John",
    year: "1970",
    mood: "romantic",
    youtubeId: "CrznwpD-2tk",
  },
  {
    id: "all-of-me",
    title: "All of Me",
    artist: "John Legend",
    year: "2013",
    mood: "romantic",
    youtubeId: "450p7goxZqg",
  },
  {
    id: "thinking-out-loud",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    year: "2014",
    mood: "romantic",
    youtubeId: "lp-EO5I60KA",
  },
  {
    id: "thousand-years",
    title: "A Thousand Years",
    artist: "Christina Perri",
    year: "2011",
    mood: "romantic",
    youtubeId: "rtOvBOTyX00",
  },
  {
    id: "just-the-way",
    title: "Just the Way You Are",
    artist: "Bruno Mars",
    year: "2010",
    mood: "romantic",
    youtubeId: "LjhCEhWiKXk",
  },
  {
    id: "know-love",
    title: "I Want to Know What Love Is",
    artist: "Foreigner",
    year: "1984",
    mood: "romantic",
    youtubeId: "r3Pr1_v7hsw",
  },
  {
    id: "chasing-cars",
    title: "Chasing Cars",
    artist: "Snow Patrol",
    year: "2006",
    mood: "soft",
    youtubeId: "GemKqzILV4w",
  },
  {
    id: "how-long",
    title: "How Long Will I Love You",
    artist: "Ellie Goulding",
    year: "2013",
    mood: "romantic",
    youtubeId: "an4ySOlsUMY",
  },
  {
    id: "truly-madly",
    title: "Truly Madly Deeply",
    artist: "Savage Garden",
    year: "1997",
    mood: "romantic",
    youtubeId: "WQnAxOQxQIU",
  },
  {
    id: "everything-buble",
    title: "Everything",
    artist: "Michael Bublé",
    year: "2007",
    mood: "romantic",
    youtubeId: "SPUJIbXN0WY",
  },
  {
    id: "stand-by-me",
    title: "Stand By Me",
    artist: "Ben E. King",
    year: "1961",
    mood: "romantic",
    youtubeId: "z5i9vT8wGY8",
  },
  {
    id: "my-hero",
    title: "My Hero",
    artist: "Foo Fighters",
    year: "1998",
    mood: "soft",
    youtubeId: "EqWRaAF6_WY",
  },
];

export const MAX_MIXTAPE_TRACKS = 6;
export const MIN_MIXTAPE_TRACKS = 1;

export function youtubeTrackId(youtubeId: string) {
  return `yt:${youtubeId}`;
}

export function isCustomTrackId(id: string) {
  return id.startsWith("yt:");
}

export function parseYoutubeIdFromTrackId(id: string) {
  return id.startsWith("yt:") ? id.slice(3) : null;
}

export function isValidYoutubeId(id: string) {
  return /^[\w-]{6,20}$/.test(id);
}

export function getTracksByIds(ids: string[], extras?: MixTrack[]): MixTrack[] {
  const extraTracks = extras ?? [];
  return ids
    .map((id) => {
      const catalog = MIX_TRACKS.find((t) => t.id === id);
      if (catalog) return catalog;

      const extra = extraTracks.find(
        (t) => t.id === id || youtubeTrackId(t.youtubeId) === id
      );
      if (extra && isValidYoutubeId(extra.youtubeId)) {
        return {
          id: extra.id.startsWith("yt:") ? extra.id : youtubeTrackId(extra.youtubeId),
          title: extra.title,
          artist: extra.artist,
          year: extra.year || "",
          youtubeId: extra.youtubeId,
        };
      }

      const youtubeId = parseYoutubeIdFromTrackId(id);
      if (youtubeId && isValidYoutubeId(youtubeId)) {
        return {
          id,
          title: "YouTube song",
          artist: "YouTube",
          year: "",
          youtubeId,
        };
      }

      return undefined;
    })
    .filter((t): t is MixTrack => Boolean(t));
}

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
