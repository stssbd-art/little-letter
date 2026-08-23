import type { Occasion } from "@/types";

/**
 * Vintage letter stationery — paper, envelope, stamp & postmark.
 * `classic-honey` matches the live cream/gold envelope (safe default).
 */
export type LetterStationeryId =
  | "classic-honey"
  | "victorian-romance"
  | "art-deco-1920s"
  | "love-letter-1950s"
  | "nostalgia-1970s"
  | "storybook"
  | "cottagecore"
  | "vintage-valentine"
  | "birthday-vintage"
  | "thank-you-friendship"
  | "childhood-nostalgia"
  | "christmas-vintage";

export type LetterStationeryDecor =
  | "none"
  | "lace"
  | "deco"
  | "roses"
  | "retro"
  | "story"
  | "botanical"
  | "hearts"
  | "cake"
  | "birds"
  | "toys"
  | "holly";

export type LetterStationery = {
  id: LetterStationeryId;
  title: string;
  blurb: string;
  emoji: string;
  era: string;
  occasionHints: Occasion[];
  paperBg: string;
  paperBorder: string;
  ink: string;
  muted: string;
  /** Tailwind font utility already in the app */
  fontClass: "font-display" | "font-script" | "font-pixel";
  envelopeBack: [string, string, string];
  envelopeFront: [string, string];
  envelopeFlap: [string, string];
  envelopeStroke: string;
  sealEmoji: string;
  stampLabel: string;
  stampColors: { bg: string; ink: string; border: string };
  postmarkColor: string;
  decor: LetterStationeryDecor;
  /** Soft accent used in email theme merge */
  accent: string;
};

export const LETTER_STATIONERY: LetterStationery[] = [
  {
    id: "classic-honey",
    title: "Classic Honey",
    blurb: "The original cream & gold Little Letter look",
    emoji: "💌",
    era: "Little Letter",
    occasionHints: [],
    paperBg: "#fffefb",
    paperBorder: "#cbb892",
    ink: "#3d2f22",
    muted: "#7a654f",
    fontClass: "font-display",
    envelopeBack: ["#fff6df", "#f6d58a", "#e4b05a"],
    envelopeFront: ["#f3cb72", "#d9a045"],
    envelopeFlap: ["#fff8e8", "#f0c96a"],
    envelopeStroke: "#8b5e34",
    sealEmoji: "❤️",
    stampLabel: "LL",
    stampColors: { bg: "#fff6df", ink: "#8b5e34", border: "#8b5e34" },
    postmarkColor: "rgba(139,94,52,0.45)",
    decor: "none",
    accent: "#8b5e34",
  },
  {
    id: "victorian-romance",
    title: "Victorian Romance",
    blurb: "Cream paper, lace borders & antique stamps",
    emoji: "🥀",
    era: "Victorian",
    occasionHints: ["love", "wedding", "valentines-day", "mothers-day"],
    paperBg: "#faf3e6",
    paperBorder: "#8b6f4e",
    ink: "#3a2a1c",
    muted: "#7a6048",
    fontClass: "font-script",
    envelopeBack: ["#f3e6d0", "#d4b896", "#a67c52"],
    envelopeFront: ["#c9a87a", "#8b6340"],
    envelopeFlap: ["#f7ecda", "#c9a87a"],
    envelopeStroke: "#5c4030",
    sealEmoji: "🖤",
    stampLabel: "1d",
    stampColors: { bg: "#f0e2c8", ink: "#5c3030", border: "#5c3030" },
    postmarkColor: "rgba(60,40,30,0.5)",
    decor: "lace",
    accent: "#6b4550",
  },
  {
    id: "art-deco-1920s",
    title: "1920s Art Deco",
    blurb: "Geometric borders & glamorous muted gold",
    emoji: "🥂",
    era: "1920s",
    occasionHints: ["love", "congratulations", "wedding", "promotion"],
    paperBg: "#f4efe4",
    paperBorder: "#2a2a2a",
    ink: "#1a1a1a",
    muted: "#5a5a5a",
    fontClass: "font-pixel",
    envelopeBack: ["#e8e0d0", "#b8a878", "#5a5040"],
    envelopeFront: ["#2a2a2a", "#1a1a1a"],
    envelopeFlap: ["#d8d0c0", "#8a7a58"],
    envelopeStroke: "#1a1a1a",
    sealEmoji: "◆",
    stampLabel: "DEC",
    stampColors: { bg: "#1a1a1a", ink: "#e8d890", border: "#e8d890" },
    postmarkColor: "rgba(40,40,40,0.55)",
    decor: "deco",
    accent: "#8a7a40",
  },
  {
    id: "love-letter-1950s",
    title: "1950s Love Letter",
    blurb: "Soft paper, tiny roses & authentic postmarks",
    emoji: "🌹",
    era: "1950s",
    occasionHints: ["love", "valentines-day", "thinking-of-you"],
    paperBg: "#fff8f4",
    paperBorder: "#d9899a",
    ink: "#4a3038",
    muted: "#8a5a66",
    fontClass: "font-script",
    envelopeBack: ["#ffe8e0", "#f0b8b0", "#d07080"],
    envelopeFront: ["#e898a0", "#c06070"],
    envelopeFlap: ["#fff0ec", "#f0b8b0"],
    envelopeStroke: "#8a4050",
    sealEmoji: "💋",
    stampLabel: "3¢",
    stampColors: { bg: "#fff0f4", ink: "#a04050", border: "#a04050" },
    postmarkColor: "rgba(120,50,60,0.45)",
    decor: "roses",
    accent: "#a34d62",
  },
  {
    id: "nostalgia-1970s",
    title: "1970s Nostalgia",
    blurb: "Warm retro paper & faded flower power",
    emoji: "🌼",
    era: "1970s",
    occasionHints: ["friendship", "thinking-of-you", "thank-you", "birthday"],
    paperBg: "#faf0d8",
    paperBorder: "#c47840",
    ink: "#4a3020",
    muted: "#8a6040",
    fontClass: "font-display",
    envelopeBack: ["#f0d8a8", "#d4a060", "#b07040"],
    envelopeFront: ["#c87838", "#905828"],
    envelopeFlap: ["#f8e8c0", "#d4a060"],
    envelopeStroke: "#6a4020",
    sealEmoji: "✌️",
    stampLabel: "70",
    stampColors: { bg: "#e8c878", ink: "#6a4020", border: "#6a4020" },
    postmarkColor: "rgba(100,60,30,0.45)",
    decor: "retro",
    accent: "#b07040",
  },
  {
    id: "storybook",
    title: "Old Storybook",
    blurb: "Whimsical animals, clouds & hand-drawn charm",
    emoji: "📖",
    era: "Storybook",
    occasionHints: ["birthday", "friendship", "thinking-of-you", "good-luck"],
    paperBg: "#fffaf0",
    paperBorder: "#7a9ab0",
    ink: "#3d3a50",
    muted: "#6a6880",
    fontClass: "font-display",
    envelopeBack: ["#e8f0f8", "#b0c8e0", "#7090b0"],
    envelopeFront: ["#88a8c8", "#5070a0"],
    envelopeFlap: ["#f0f6fc", "#b0c8e0"],
    envelopeStroke: "#405870",
    sealEmoji: "⭐",
    stampLabel: "ONCE",
    stampColors: { bg: "#e8f4ff", ink: "#405870", border: "#405870" },
    postmarkColor: "rgba(60,80,100,0.45)",
    decor: "story",
    accent: "#5070a0",
  },
  {
    id: "cottagecore",
    title: "Cottagecore",
    blurb: "Pressed flowers, kraft paper & butterflies",
    emoji: "🦋",
    era: "Cottage",
    occasionHints: ["thank-you", "friendship", "mothers-day", "thinking-of-you"],
    paperBg: "#f5ecd8",
    paperBorder: "#8a9a60",
    ink: "#3d3a28",
    muted: "#6a6848",
    fontClass: "font-script",
    envelopeBack: ["#e8dcc0", "#c4b890", "#8a9a60"],
    envelopeFront: ["#a8b878", "#6a8040"],
    envelopeFlap: ["#f0e8d0", "#c4b890"],
    envelopeStroke: "#4a5830",
    sealEmoji: "🌿",
    stampLabel: "BLOOM",
    stampColors: { bg: "#e8f0d0", ink: "#4a5830", border: "#4a5830" },
    postmarkColor: "rgba(70,80,40,0.45)",
    decor: "botanical",
    accent: "#6a8040",
  },
  {
    id: "vintage-valentine",
    title: "Vintage Valentine",
    blurb: "Hearts, ribbons, cherubs & antique red marks",
    emoji: "💘",
    era: "Valentine",
    occasionHints: ["valentines-day", "love"],
    paperBg: "#fff5f2",
    paperBorder: "#c04050",
    ink: "#4a2028",
    muted: "#8a4850",
    fontClass: "font-script",
    envelopeBack: ["#ffd8d8", "#f09090", "#c04050"],
    envelopeFront: ["#e06070", "#a02838"],
    envelopeFlap: ["#ffe8e8", "#f09090"],
    envelopeStroke: "#801828",
    sealEmoji: "💝",
    stampLabel: "♥",
    stampColors: { bg: "#ffe0e4", ink: "#a02838", border: "#a02838" },
    postmarkColor: "rgba(140,30,40,0.5)",
    decor: "hearts",
    accent: "#c04050",
  },
  {
    id: "birthday-vintage",
    title: "Birthday Vintage",
    blurb: "Tiny cakes, candles & a special birthday stamp",
    emoji: "🎂",
    era: "Birthday",
    occasionHints: ["birthday"],
    paperBg: "#fffaf0",
    paperBorder: "#e8a05a",
    ink: "#3d2f22",
    muted: "#8b5e34",
    fontClass: "font-display",
    envelopeBack: ["#ffe8a3", "#ffd090", "#e8a05a"],
    envelopeFront: ["#f0b060", "#c87830"],
    envelopeFlap: ["#fff4d8", "#ffd090"],
    envelopeStroke: "#8b5e34",
    sealEmoji: "🎈",
    stampLabel: "HBD",
    stampColors: { bg: "#fff0d0", ink: "#b85c38", border: "#b85c38" },
    postmarkColor: "rgba(139,94,52,0.45)",
    decor: "cake",
    accent: "#b85c38",
  },
  {
    id: "thank-you-friendship",
    title: "Thank You / Friendship",
    blurb: "Birds, little envelopes & warm nostalgic notes",
    emoji: "🕊️",
    era: "Friendship",
    occasionHints: ["thank-you", "friendship", "thinking-of-you"],
    paperBg: "#f8faf2",
    paperBorder: "#a3b875",
    ink: "#3d2f22",
    muted: "#6f8a45",
    fontClass: "font-display",
    envelopeBack: ["#e8f0d4", "#c5d4a0", "#a3b875"],
    envelopeFront: ["#a3b875", "#6f8a45"],
    envelopeFlap: ["#f3f6e8", "#c5d4a0"],
    envelopeStroke: "#5a7038",
    sealEmoji: "🤝",
    stampLabel: "TY",
    stampColors: { bg: "#f0f6e0", ink: "#5a7038", border: "#5a7038" },
    postmarkColor: "rgba(90,110,50,0.45)",
    decor: "birds",
    accent: "#6f8a45",
  },
  {
    id: "childhood-nostalgia",
    title: "Childhood Nostalgia",
    blurb: "Teddy bears, toys, stars & tiny houses",
    emoji: "🧸",
    era: "Childhood",
    occasionHints: ["birthday", "friendship", "thinking-of-you", "good-luck"],
    paperBg: "#fff8f0",
    paperBorder: "#e8a878",
    ink: "#4a3828",
    muted: "#8a6848",
    fontClass: "font-display",
    envelopeBack: ["#ffe8d0", "#f0c090", "#d09060"],
    envelopeFront: ["#e8a870", "#c07040"],
    envelopeFlap: ["#fff0e0", "#f0c090"],
    envelopeStroke: "#8a5030",
    sealEmoji: "🌟",
    stampLabel: "PLAY",
    stampColors: { bg: "#fff0e0", ink: "#8a5030", border: "#8a5030" },
    postmarkColor: "rgba(130,80,40,0.45)",
    decor: "toys",
    accent: "#c07040",
  },
  {
    id: "christmas-vintage",
    title: "Christmas Vintage",
    blurb: "Holly, snowflakes & old Christmas postcards",
    emoji: "🎄",
    era: "Christmas",
    occasionHints: ["thinking-of-you", "love", "friendship", "thank-you"],
    paperBg: "#faf8f4",
    paperBorder: "#2a5a40",
    ink: "#2a3028",
    muted: "#5a6848",
    fontClass: "font-script",
    envelopeBack: ["#e8f0e8", "#c0d8c0", "#2a5a40"],
    envelopeFront: ["#c04040", "#802028"],
    envelopeFlap: ["#f0f6f0", "#a0c0a0"],
    envelopeStroke: "#2a4028",
    sealEmoji: "❄️",
    stampLabel: "XMAS",
    stampColors: { bg: "#fff8f0", ink: "#802028", border: "#2a5a40" },
    postmarkColor: "rgba(40,60,40,0.5)",
    decor: "holly",
    accent: "#802028",
  },
];

const BY_ID = Object.fromEntries(
  LETTER_STATIONERY.map((s) => [s.id, s])
) as Record<LetterStationeryId, LetterStationery>;

export function isLetterStationeryId(
  value: string
): value is LetterStationeryId {
  return value in BY_ID;
}

export function getLetterStationery(
  id: string | undefined | null
): LetterStationery {
  if (id && isLetterStationeryId(id)) return BY_ID[id];
  return BY_ID["classic-honey"];
}

/** Soft-ranked list for the picker (matching occasion first, classic always first). */
export function stationeryForOccasion(
  occasion: Occasion | undefined
): LetterStationery[] {
  const classic = BY_ID["classic-honey"];
  const rest = LETTER_STATIONERY.filter((s) => s.id !== "classic-honey");
  if (!occasion) return [classic, ...rest];
  const matched = rest.filter((s) => s.occasionHints.includes(occasion));
  const others = rest.filter((s) => !s.occasionHints.includes(occasion));
  return [classic, ...matched, ...others];
}
