/** Classic 90s playlist labels. Audio uses free demo streams (not original masters). */
export type MixTrack = {
  id: string;
  title: string;
  artist: string;
  year: string;
  src: string;
  mood?: "romantic" | "upbeat" | "soft";
};

export const MIX_TRACKS: MixTrack[] = [
  // Romantic favourites
  {
    id: "truly-madly",
    title: "Truly Madly Deeply",
    artist: "Savage Garden",
    year: "1997",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
  {
    id: "kiss-me",
    title: "Kiss Me",
    artist: "Sixpence None the Richer",
    year: "1998",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  },
  {
    id: "unbreak",
    title: "Un-Break My Heart",
    artist: "Toni Braxton",
    year: "1996",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
  {
    id: "all-my-life",
    title: "All My Life",
    artist: "K-Ci & JoJo",
    year: "1998",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
  {
    id: "miss-a-thing",
    title: "I Don't Want to Miss a Thing",
    artist: "Aerosmith",
    year: "1998",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  },
  {
    id: "my-heart",
    title: "My Heart Will Go On",
    artist: "Celine Dion",
    year: "1997",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  },
  {
    id: "lovefool",
    title: "Lovefool",
    artist: "The Cardigans",
    year: "1996",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: "as-long",
    title: "As Long As You Love Me",
    artist: "Backstreet Boys",
    year: "1997",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "angel",
    title: "Angel",
    artist: "Sarah McLachlan",
    year: "1997",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "crush",
    title: "Crush",
    artist: "Jennifer Paige",
    year: "1998",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "more-than-words",
    title: "More Than Words",
    artist: "Extreme",
    year: "1991",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "end-of-road",
    title: "End of the Road",
    artist: "Boyz II Men",
    year: "1992",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  // Soft / familiar
  {
    id: "iris",
    title: "Iris",
    artist: "Goo Goo Dolls",
    year: "1998",
    mood: "soft",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: "torn",
    title: "Torn",
    artist: "Natalie Imbruglia",
    year: "1997",
    mood: "soft",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    year: "1995",
    mood: "soft",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: "that-way",
    title: "I Want It That Way",
    artist: "Backstreet Boys",
    year: "1999",
    mood: "romantic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
  },
  // Upbeat classics
  {
    id: "wannabe",
    title: "Wannabe",
    artist: "Spice Girls",
    year: "1996",
    mood: "upbeat",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  },
  {
    id: "barbie",
    title: "Barbie Girl",
    artist: "Aqua",
    year: "1997",
    mood: "upbeat",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  },
  {
    id: "mmmbop",
    title: "MMMBop",
    artist: "Hanson",
    year: "1997",
    mood: "upbeat",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
  {
    id: "semi-charmed",
    title: "Semi-Charmed Life",
    artist: "Third Eye Blind",
    year: "1997",
    mood: "upbeat",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
];

export const MAX_MIXTAPE_TRACKS = 6;
export const MIN_MIXTAPE_TRACKS = 3;

export function getTracksByIds(ids: string[]): MixTrack[] {
  return ids
    .map((id) => MIX_TRACKS.find((t) => t.id === id))
    .filter((t): t is MixTrack => Boolean(t))
    .map((t) => ({
      ...t,
      // Same-origin proxy — more reliable than third-party hotlinking in some browsers
      src: `/api/audio/${t.id}`,
    }));
}
