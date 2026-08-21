import type { Occasion } from "@/types";

export type CardDesignId =
  | "balloon-bash"
  | "cake-candles"
  | "confetti-pop"
  | "blush-hearts"
  | "rose-garden"
  | "starlit-love"
  | "buddy-highfive"
  | "rainbow-note"
  | "clover-luck"
  | "sunflower-thanks"
  | "sparkler-congrats"
  | "soft-sorry"
  | "wedding-rings"
  | "cap-toss"
  | "promo-rocket"
  | "valentine-box"
  | "tulip-mum"
  | "tie-dad"
  | "honey-classic"
  | "moon-whisper";

export type CardDesign = {
  id: CardDesignId;
  title: string;
  blurb: string;
  emoji: string;
  occasion: Occasion;
  pageBg: string;
  cardBg: string;
  border: string;
  accent: string;
  ink: string;
  muted: string;
  badge: string;
  sparkles: string[];
  /** Extra motion flavour + decorative layer preset for animated previews */
  vibe: "party" | "soft" | "garden" | "night" | "retro";
};

export const CARD_DESIGNS: CardDesign[] = [
  {
    id: "balloon-bash",
    title: "Balloon Bash",
    blurb: "Party balloons and cake energy",
    emoji: "🎈",
    occasion: "birthday",
    pageBg: "linear-gradient(160deg,#ffe8a3 0%,#fff6df 45%,#ffd6e8 100%)",
    cardBg: "#fff8ee",
    border: "#e8a05a",
    accent: "#b85c38",
    ink: "#3d2f22",
    muted: "#8b5e34",
    badge: "make a wish",
    sparkles: ["🎈", "🎉", "🧁"],
    vibe: "party",
  },
  {
    id: "cake-candles",
    title: "Cake & Candles",
    blurb: "Warm frosting and soft gold",
    emoji: "🎂",
    occasion: "birthday",
    pageBg: "linear-gradient(165deg,#fff0d4 0%,#ffe4b8 50%,#f5c98a 100%)",
    cardBg: "#fffaf0",
    border: "#d2a35a",
    accent: "#8b5e34",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "another trip around the sun",
    sparkles: ["✨", "🎂", "⭐"],
    vibe: "party",
  },
  {
    id: "confetti-pop",
    title: "Confetti Pop",
    blurb: "Celebrate anything loud and bright",
    emoji: "🎊",
    occasion: "congratulations",
    pageBg: "linear-gradient(155deg,#ffe0f0 0%,#fff6df 40%,#d4f0ff 100%)",
    cardBg: "#fffcf5",
    border: "#e07a9a",
    accent: "#a34d62",
    ink: "#3d2a30",
    muted: "#8a5a66",
    badge: "you did the thing",
    sparkles: ["🎊", "✨", "🌟"],
    vibe: "party",
  },
  {
    id: "blush-hearts",
    title: "Blush Hearts",
    blurb: "Soft rose for love notes",
    emoji: "💕",
    occasion: "love",
    pageBg: "linear-gradient(160deg,#ffe4ec 0%,#fff6f0 50%,#fde8d8 100%)",
    cardBg: "#fff9f8",
    border: "#d9899a",
    accent: "#a34d62",
    ink: "#3d2a30",
    muted: "#8a5a66",
    badge: "with all my heart",
    sparkles: ["💗", "🌹", "✨"],
    vibe: "soft",
  },
  {
    id: "rose-garden",
    title: "Rose Garden",
    blurb: "Petals and quiet romance",
    emoji: "🌹",
    occasion: "love",
    pageBg: "linear-gradient(170deg,#f8e0e8 0%,#fff5f0 55%,#e8f0d8 100%)",
    cardBg: "#fff8f6",
    border: "#c97888",
    accent: "#8b4555",
    ink: "#3d2a30",
    muted: "#7a5560",
    badge: "blooming for you",
    sparkles: ["🌹", "🦋", "✦"],
    vibe: "garden",
  },
  {
    id: "starlit-love",
    title: "Starlit Love",
    blurb: "Night sky and soft gold ink",
    emoji: "🌙",
    occasion: "love",
    pageBg: "linear-gradient(165deg,#1a2238 0%,#2a3550 45%,#3d2f4a 100%)",
    cardBg: "#f7ecd4",
    border: "#c4a574",
    accent: "#5c3d1e",
    ink: "#3d2f22",
    muted: "#6b5a44",
    badge: "written under stars",
    sparkles: ["✦", "🌙", "✧"],
    vibe: "night",
  },
  {
    id: "buddy-highfive",
    title: "Buddy High-Five",
    blurb: "Minty friendship vibes",
    emoji: "🤝",
    occasion: "friendship",
    pageBg: "linear-gradient(160deg,#e8f0d4 0%,#f5f7ec 50%,#dfead0 100%)",
    cardBg: "#fbfef5",
    border: "#a3b875",
    accent: "#6f8a45",
    ink: "#2f3a22",
    muted: "#5f6f48",
    badge: "best-friend energy",
    sparkles: ["⭐", "🤝", "☁️"],
    vibe: "garden",
  },
  {
    id: "rainbow-note",
    title: "Rainbow Note",
    blurb: "Just because you're on my mind",
    emoji: "🌈",
    occasion: "thinking-of-you",
    pageBg: "linear-gradient(145deg,#ffe4ec 0%,#fff6df 35%,#e0f0ff 70%,#e8f0d4 100%)",
    cardBg: "#fffcf8",
    border: "#c4a574",
    accent: "#6b4f36",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "a soft hello",
    sparkles: ["🌈", "✨", "☁️"],
    vibe: "soft",
  },
  {
    id: "clover-luck",
    title: "Clover Luck",
    blurb: "Good luck before the big day",
    emoji: "🍀",
    occasion: "good-luck",
    pageBg: "linear-gradient(160deg,#e4f0d8 0%,#f5f7ec 50%,#d8ead0 100%)",
    cardBg: "#f8fcf4",
    border: "#7aab6a",
    accent: "#4a7a3a",
    ink: "#2a3a22",
    muted: "#5a6f48",
    badge: "fingers crossed",
    sparkles: ["🍀", "✨", "🌟"],
    vibe: "garden",
  },
  {
    id: "sunflower-thanks",
    title: "Sunflower Thanks",
    blurb: "Grateful golden yellows",
    emoji: "🌻",
    occasion: "thank-you",
    pageBg: "linear-gradient(160deg,#fff3c4 0%,#fff9e8 50%,#e8f0d4 100%)",
    cardBg: "#fffdf5",
    border: "#d2a35a",
    accent: "#8b5e34",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "thank you so much",
    sparkles: ["🌻", "☀️", "✨"],
    vibe: "garden",
  },
  {
    id: "sparkler-congrats",
    title: "Sparkler Congrats",
    blurb: "Bright cheers for a win",
    emoji: "🎉",
    occasion: "congratulations",
    pageBg: "linear-gradient(155deg,#ffe8a3 0%,#ffd6e8 50%,#d4e8ff 100%)",
    cardBg: "#fffaf2",
    border: "#e8a05a",
    accent: "#b85c38",
    ink: "#3d2f22",
    muted: "#8b5e34",
    badge: "well done you",
    sparkles: ["🎉", "⭐", "💫"],
    vibe: "party",
  },
  {
    id: "soft-sorry",
    title: "Soft Sorry",
    blurb: "Gentle blue apology note",
    emoji: "💙",
    occasion: "sorry",
    pageBg: "linear-gradient(165deg,#e0ecf8 0%,#f4f7fb 55%,#e8e4f0 100%)",
    cardBg: "#f8fafc",
    border: "#8aa4c4",
    accent: "#4a6a8a",
    ink: "#2a3540",
    muted: "#5a6a7a",
    badge: "from the heart",
    sparkles: ["💙", "☁️", "✨"],
    vibe: "soft",
  },
  {
    id: "wedding-rings",
    title: "Wedding Rings",
    blurb: "Ivory and champagne toast",
    emoji: "💒",
    occasion: "wedding",
    pageBg: "linear-gradient(160deg,#f8f0e4 0%,#fffaf2 50%,#f0e4d4 100%)",
    cardBg: "#fffcf7",
    border: "#c4a574",
    accent: "#8b6a44",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "with love & joy",
    sparkles: ["💍", "✨", "🥂"],
    vibe: "soft",
  },
  {
    id: "cap-toss",
    title: "Cap Toss",
    blurb: "Proud grad energy",
    emoji: "🎓",
    occasion: "graduation",
    pageBg: "linear-gradient(155deg,#e0e8f8 0%,#fff6df 50%,#e8f0d4 100%)",
    cardBg: "#fbfcff",
    border: "#6a8ab8",
    accent: "#3a5a88",
    ink: "#2a3545",
    muted: "#5a6a7a",
    badge: "you earned this",
    sparkles: ["🎓", "⭐", "📜"],
    vibe: "party",
  },
  {
    id: "promo-rocket",
    title: "Promo Rocket",
    blurb: "New role, big cheers",
    emoji: "🚀",
    occasion: "promotion",
    pageBg: "linear-gradient(160deg,#ffe8d4 0%,#fff6df 45%,#e0f0ff 100%)",
    cardBg: "#fffaf5",
    border: "#e09060",
    accent: "#a05030",
    ink: "#3d2f22",
    muted: "#7a5540",
    badge: "next level unlocked",
    sparkles: ["🚀", "✨", "📈"],
    vibe: "party",
  },
  {
    id: "valentine-box",
    title: "Valentine Box",
    blurb: "Classic hearts for Feb 14",
    emoji: "💝",
    occasion: "valentines-day",
    pageBg: "linear-gradient(160deg,#ffd0dc 0%,#fff0f4 50%,#ffe4ec 100%)",
    cardBg: "#fff8fa",
    border: "#d06080",
    accent: "#a03050",
    ink: "#3d2030",
    muted: "#8a5060",
    badge: "be my valentine",
    sparkles: ["💝", "💕", "✨"],
    vibe: "soft",
  },
  {
    id: "tulip-mum",
    title: "Tulip for Mum",
    blurb: "Spring blooms for Mother's Day",
    emoji: "🌷",
    occasion: "mothers-day",
    pageBg: "linear-gradient(160deg,#ffe4ec 0%,#f5f7ec 50%,#e8f0d4 100%)",
    cardBg: "#fffaf8",
    border: "#d9899a",
    accent: "#8b5a6a",
    ink: "#3d2a30",
    muted: "#7a5a66",
    badge: "for the best mum",
    sparkles: ["🌷", "💕", "☀️"],
    vibe: "garden",
  },
  {
    id: "tie-dad",
    title: "Tie for Dad",
    blurb: "Warm navy & gold for Father's Day",
    emoji: "👔",
    occasion: "fathers-day",
    pageBg: "linear-gradient(165deg,#d8e4f0 0%,#f0f4f8 50%,#e8e0d0 100%)",
    cardBg: "#f8fafc",
    border: "#6a7a98",
    accent: "#3a4a68",
    ink: "#2a3040",
    muted: "#5a6a7a",
    badge: "for the best dad",
    sparkles: ["👔", "⭐", "☕"],
    vibe: "retro",
  },
  {
    id: "honey-classic",
    title: "Honey Classic",
    blurb: "The cosy Little Letter look",
    emoji: "💌",
    occasion: "friendship",
    pageBg: "linear-gradient(160deg,#fff6df 0%,#faf4e8 50%,#f0e4c8 100%)",
    cardBg: "#fffbf2",
    border: "#d2a35a",
    accent: "#8b5e34",
    ink: "#3d2f22",
    muted: "#7a654f",
    badge: "sealed with care",
    sparkles: ["✨", "☁️", "⭐"],
    vibe: "soft",
  },
  {
    id: "moon-whisper",
    title: "Moon Whisper",
    blurb: "Quiet night thinking-of-you",
    emoji: "🌙",
    occasion: "thinking-of-you",
    pageBg: "linear-gradient(170deg,#1e2840 0%,#2c3858 50%,#3a2e48 100%)",
    cardBg: "#f5ecd8",
    border: "#a89070",
    accent: "#5c3d1e",
    ink: "#3d2f22",
    muted: "#6b5a44",
    badge: "thinking of you",
    sparkles: ["🌙", "✦", "✧"],
    vibe: "night",
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
  return BY_ID["honey-classic"];
}

export function designsForOccasion(occasion: Occasion | "all"): CardDesign[] {
  if (occasion === "all") return CARD_DESIGNS;
  return CARD_DESIGNS.filter((d) => d.occasion === occasion);
}

export function defaultDesignForOccasion(occasion: Occasion): CardDesignId {
  const match = CARD_DESIGNS.find((d) => d.occasion === occasion);
  return match?.id ?? "honey-classic";
}
