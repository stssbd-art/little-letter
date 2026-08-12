/** Romantic favourites — only verified playable YouTube embeds. */
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
];

export const MAX_MIXTAPE_TRACKS = 5;
export const MIN_MIXTAPE_TRACKS = 3;

export function getTracksByIds(ids: string[]): MixTrack[] {
  return ids
    .map((id) => MIX_TRACKS.find((t) => t.id === id))
    .filter((t): t is MixTrack => Boolean(t));
}

export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
