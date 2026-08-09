/** Classic 90s playlist labels. Audio uses free demo streams (not original masters). */
export type MixTrack = {
  id: string;
  title: string;
  artist: string;
  year: string;
  src: string;
};

export const MIX_TRACKS: MixTrack[] = [
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    year: "1995",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "that-way",
    title: "I Want It That Way",
    artist: "Backstreet Boys",
    year: "1999",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "wannabe",
    title: "Wannabe",
    artist: "Spice Girls",
    year: "1996",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "barbie",
    title: "Barbie Girl",
    artist: "Aqua",
    year: "1997",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: "mmmbop",
    title: "MMMBop",
    artist: "Hanson",
    year: "1997",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  {
    id: "semi-charmed",
    title: "Semi-Charmed Life",
    artist: "Third Eye Blind",
    year: "1997",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "torn",
    title: "Torn",
    artist: "Natalie Imbruglia",
    year: "1997",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "iris",
    title: "Iris",
    artist: "Goo Goo Dolls",
    year: "1998",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: "no-scrub",
    title: "No Scrubs",
    artist: "TLC",
    year: "1999",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: "everybody",
    title: "Everybody (Backstreet's Back)",
    artist: "Backstreet Boys",
    year: "1997",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
];

export const MAX_MIXTAPE_TRACKS = 6;
export const MIN_MIXTAPE_TRACKS = 3;

export function getTracksByIds(ids: string[]): MixTrack[] {
  return ids
    .map((id) => MIX_TRACKS.find((t) => t.id === id))
    .filter((t): t is MixTrack => Boolean(t));
}
