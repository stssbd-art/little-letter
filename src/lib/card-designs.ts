import type { Occasion } from "@/types";

export type CardDesignId =
  | "honey"
  | "balloon"
  | "blush"
  | "garden"
  | "starlight"
  | "cassette";

export type CardDesign = {
  id: CardDesignId;
  label: string;
  blurb: string;
  emoji: string;
  /** Occasions this design is suggested for (still choosable for any). */
  bestFor: Occasion[];
  pageBg: string;
  cardBg: string;
  border: string;
  accent: string;
  ink: string;
  muted: string;
  badge: string;
  sparkles: string[];
};

export const CARD_DESIGNS: CardDesign[] = [
  {
    id: "honey",
    label: "Honey note",
    blurb: "Warm cream & soft gold — classic Little Letter",
    emoji: "💌",
    bestFor: ["friendship", "thinking-of-you", "sorry"],
    pageBg: "linear-gradient(160deg,#fff6df 0%,#faf4e8 50%,#f0e4c8 100%)",
    cardBg: "#fffbf2",
    border: "#d2a35a",
    accent: "#8b5e34",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "sealed with care",
    sparkles: ["✨", "☁️", "⭐"],
  },
  {
    id: "balloon",
    label: "Balloon party",
    blurb: "Birthday confetti & cake energy",
    emoji: "🎂",
    bestFor: ["birthday", "congratulations", "graduation", "promotion"],
    pageBg: "linear-gradient(160deg,#ffe8a3 0%,#fff6df 45%,#ffd6e8 100%)",
    cardBg: "#fff8ee",
    border: "#e8a05a",
    accent: "#b85c38",
    ink: "#3d2f22",
    muted: "#8b5e34",
    badge: "make a wish",
    sparkles: ["🎈", "🎉", "🧁"],
  },
  {
    id: "blush",
    label: "Blush hearts",
    blurb: "Soft rose for love & Valentine notes",
    emoji: "💕",
    bestFor: ["love", "valentines-day", "wedding"],
    pageBg: "linear-gradient(160deg,#ffe4ec 0%,#fff6f0 50%,#fde8d8 100%)",
    cardBg: "#fff9f8",
    border: "#d9899a",
    accent: "#a34d62",
    ink: "#3d2a30",
    muted: "#8a5a66",
    badge: "with all my heart",
    sparkles: ["💗", "🌹", "✨"],
  },
  {
    id: "garden",
    label: "Garden path",
    blurb: "Mint leaves for thank-yous & family days",
    emoji: "🌿",
    bestFor: ["thank-you", "mothers-day", "fathers-day", "good-luck"],
    pageBg: "linear-gradient(160deg,#e8f0d4 0%,#f5f7ec 50%,#e4efd8 100%)",
    cardBg: "#fbfef6",
    border: "#8fa86a",
    accent: "#4f6b35",
    ink: "#2f3a22",
    muted: "#5c6b4a",
    badge: "grown with gratitude",
    sparkles: ["🌷", "🍀", "☀️"],
  },
  {
    id: "starlight",
    label: "Starlight",
    blurb: "Night-sky sparkle for big moments",
    emoji: "⭐",
    bestFor: ["congratulations", "graduation", "promotion", "good-luck"],
    pageBg: "linear-gradient(160deg,#2a2438 0%,#3d3454 45%,#4a3f2e 100%)",
    cardBg: "#2f2838",
    border: "#c4a574",
    accent: "#f6d58a",
    ink: "#fff6df",
    muted: "#cbb892",
    badge: "written under stars",
    sparkles: ["✦", "🌙", "✧"],
  },
  {
    id: "cassette",
    label: "Mixtape cover",
    blurb: "Retro tape frame for playful notes",
    emoji: "📼",
    bestFor: ["friendship", "love", "thinking-of-you"],
    pageBg: "linear-gradient(160deg,#3d2f22 0%,#5c3d1e 40%,#8b5e34 100%)",
    cardBg: "#f7ecd4",
    border: "#8b5e34",
    accent: "#5c3d1e",
    ink: "#3d2f22",
    muted: "#6b5a44",
    badge: "side A · forever",
    sparkles: ["🎵", "♥", "♪"],
  },
];

const BY_ID = Object.fromEntries(
  CARD_DESIGNS.map((d) => [d.id, d])
) as Record<CardDesignId, CardDesign>;

export function isCardDesignId(value: string): value is CardDesignId {
  return value in BY_ID;
}

export function getCardDesign(id: string | undefined | null): CardDesign {
  if (id && isCardDesignId(id)) return BY_ID[id];
  return BY_ID.honey;
}

/** Default card when the occasion changes (user can still override). */
export function defaultCardDesignForOccasion(occasion: Occasion): CardDesignId {
  const match = CARD_DESIGNS.find((d) => d.bestFor.includes(occasion));
  return match?.id ?? "honey";
}

export function designsForOccasion(occasion: Occasion): CardDesign[] {
  const preferred = CARD_DESIGNS.filter((d) => d.bestFor.includes(occasion));
  const rest = CARD_DESIGNS.filter((d) => !d.bestFor.includes(occasion));
  return [...preferred, ...rest];
}
