import type { MessageStyle, Occasion } from "@/types";

/**
 * Vintage letter stationery — paper, stamp & postmark.
 * Each look also carries a writing voice (merged Style + Stationery picker).
 * Envelope colour is always the classic cream/gold Little Letter look.
 */

/** Original cream & gold envelope — shared by every stationery option. */
export const CLASSIC_ENVELOPE = {
  envelopeBack: ["#fff6df", "#f6d58a", "#e4b05a"] as [string, string, string],
  envelopeFront: ["#f3cb72", "#d9a045"] as [string, string],
  envelopeFlap: ["#fff8e8", "#f0c96a"] as [string, string],
  envelopeStroke: "#8b5e34",
};
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
  /** Writing voice applied when this look is chosen (replaces separate Style picker) */
  writingStyle: MessageStyle;
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "❤️",
    stampLabel: "70p",
    stampColors: { bg: "#fff8e8", ink: "#8b5e34", border: "#8b5e34" },
    postmarkColor: "rgba(139,94,52,0.55)",
    decor: "none",
    accent: "#8b5e34",
    writingStyle: "cute",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "🖤",
    stampLabel: "1d",
    stampColors: { bg: "#f7ecd8", ink: "#5c3030", border: "#5c3030" },
    postmarkColor: "rgba(60,40,30,0.55)",
    decor: "lace",
    accent: "#6b4550",
    writingStyle: "romantic",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "◆",
    stampLabel: "2d",
    stampColors: { bg: "#f4efe4", ink: "#2a2a2a", border: "#2a2a2a" },
    postmarkColor: "rgba(40,40,40,0.55)",
    decor: "deco",
    accent: "#8a7a40",
    writingStyle: "poetic",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "💋",
    stampLabel: "3¢",
    stampColors: { bg: "#fff5f2", ink: "#8a4050", border: "#8a4050" },
    postmarkColor: "rgba(120,50,60,0.5)",
    decor: "roses",
    accent: "#a34d62",
    writingStyle: "romantic",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "✌️",
    stampLabel: "8p",
    stampColors: { bg: "#faf0d8", ink: "#6a4020", border: "#6a4020" },
    postmarkColor: "rgba(100,60,30,0.5)",
    decor: "retro",
    accent: "#b07040",
    writingStyle: "funny",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "⭐",
    stampLabel: "5p",
    stampColors: { bg: "#f4f8fc", ink: "#405870", border: "#405870" },
    postmarkColor: "rgba(60,80,100,0.5)",
    decor: "story",
    accent: "#5070a0",
    writingStyle: "whimsical",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "🌿",
    stampLabel: "4p",
    stampColors: { bg: "#f2f0e0", ink: "#4a5830", border: "#4a5830" },
    postmarkColor: "rgba(70,80,40,0.5)",
    decor: "botanical",
    accent: "#6a8040",
    writingStyle: "cute",
  },
  {
    id: "vintage-valentine",
    title: "Vintage Valentine",
    blurb: "Hearts, ribbons & antique postmarks on cream paper",
    emoji: "💘",
    era: "Valentine",
    occasionHints: ["valentines-day", "love"],
    paperBg: "#fff5f2",
    paperBorder: "#c04050",
    ink: "#4a2028",
    muted: "#8a4850",
    fontClass: "font-script",
    ...CLASSIC_ENVELOPE,
    sealEmoji: "💝",
    stampLabel: "♥",
    stampColors: { bg: "#fff5f2", ink: "#8a4050", border: "#8a4050" },
    postmarkColor: "rgba(140,30,40,0.5)",
    decor: "hearts",
    accent: "#c04050",
    writingStyle: "romantic",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "🎈",
    stampLabel: "HBD",
    stampColors: { bg: "#fff8e8", ink: "#8b5e34", border: "#8b5e34" },
    postmarkColor: "rgba(139,94,52,0.55)",
    decor: "cake",
    accent: "#b85c38",
    writingStyle: "funny",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "🤝",
    stampLabel: "TY",
    stampColors: { bg: "#f4f8ec", ink: "#5a7038", border: "#5a7038" },
    postmarkColor: "rgba(90,110,50,0.5)",
    decor: "birds",
    accent: "#6f8a45",
    writingStyle: "encouraging",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "🌟",
    stampLabel: "PLAY",
    stampColors: { bg: "#fff6ec", ink: "#8a5030", border: "#8a5030" },
    postmarkColor: "rgba(130,80,40,0.5)",
    decor: "toys",
    accent: "#c07040",
    writingStyle: "whimsical",
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
    ...CLASSIC_ENVELOPE,
    sealEmoji: "❄️",
    stampLabel: "XMAS",
    stampColors: { bg: "#fff8f0", ink: "#2a5a40", border: "#2a5a40" },
    postmarkColor: "rgba(40,60,40,0.55)",
    decor: "holly",
    accent: "#2a5a40",
    writingStyle: "cute",
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
  const base =
    id && isLetterStationeryId(id) ? BY_ID[id] : BY_ID["classic-honey"];
  /* Always keep the cream/gold envelope — themes only change paper & stamp. */
  return { ...base, ...CLASSIC_ENVELOPE };
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

/** Writing voice bundled with a stationery look. */
export function writingStyleForStationery(
  id: string | undefined | null
): MessageStyle {
  return getLetterStationery(id).writingStyle;
}
