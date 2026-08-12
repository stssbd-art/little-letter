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
    id: "always-love-you",
    title: "I Will Always Love You",
    artist: "Whitney Houston",
    year: "1992",
    mood: "romantic",
    youtubeId: "3JWTaaS7LdU",
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
    id: "alice",
    title: "Alice",
    artist: "Calema",
    year: "2017",
    mood: "romantic",
    youtubeId: "Fzl5kg8kV3c",
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
    id: "because-loved",
    title: "Because You Loved Me",
    artist: "Céline Dion",
    year: "1996",
    mood: "romantic",
    youtubeId: "fpl4if07ics",
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

export function getTracksByIds(ids: string[]): MixTrack[] {
  return ids
    .map((id) => MIX_TRACKS.find((t) => t.id === id))
    .filter((t): t is MixTrack => Boolean(t));
}

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
