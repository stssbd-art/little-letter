/** Affiliate / sponsored placements (publisher links). */

/** Awin publisher ID — MasterTag + cread affiliate links */
export const AWIN_PUBLISHER_ID = "3048693";

/** Official Publisher MasterTag script (Toolbox → Publisher MasterTag). */
export const AWIN_MASTER_TAG_SRC = `https://www.dwin2.com/pub.${AWIN_PUBLISHER_ID}.min.js`;

export type AffiliateOffer = {
  id: string;
  href: string;
  label: string;
  blurb: string;
  emoji: string;
  /** Tailwind-friendly colour classes for the banner chrome */
  tone: {
    border: string;
    bg: string;
    iconBg: string;
    muted: string;
    title: string;
    ctaBorder: string;
    ctaBg: string;
  };
};

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "cadbury",
    href: "https://www.awin1.com/cread.php?awinmid=736&awinaffid=3048693&ued=https%3A%2F%2Fwww.cadburygiftsdirect.co.uk%2F",
    label: "Cadbury Gifts Direct",
    blurb: "Send a chocolate gift — shop Cadbury Gifts Direct",
    emoji: "🍫",
    tone: {
      border: "border-[#6b3a2a]/40",
      bg: "bg-gradient-to-r from-[#4a2018] via-[#6b3a2a] to-[#8b4a32]",
      iconBg: "bg-[#f5e6c8]",
      muted: "text-[#f5e6c8]/80",
      title: "text-[#fff6df]",
      ctaBorder: "border-[#f5e6c8]/35",
      ctaBg: "bg-[#f5e6c8]/15 group-hover:bg-[#f5e6c8]/25",
    },
  },
  {
    id: "social-stories",
    href: "https://www.awin1.com/cread.php?awinmid=125422&awinaffid=3048693&ued=https%3A%2F%2Fsocialstoriesclub.com%2F",
    label: "Social Stories Club",
    blurb: "Personalised story books for little ones — Social Stories Club",
    emoji: "📖",
    tone: {
      border: "border-[#7a4a5a]/40",
      bg: "bg-gradient-to-r from-[#4a2838] via-[#6a3a4a] to-[#8a5a6a]",
      iconBg: "bg-[#ffe8f0]",
      muted: "text-[#ffe0ea]/85",
      title: "text-[#fff5f8]",
      ctaBorder: "border-[#ffe0ea]/35",
      ctaBg: "bg-[#ffe0ea]/15 group-hover:bg-[#ffe0ea]/25",
    },
  },
  {
    id: "happy-days",
    href: "https://tidd.ly/468RNB4",
    label: "Happy Days Factory",
    blurb: "Personalised gifts & keepsakes — visit Happy Days Factory",
    emoji: "🎁",
    tone: {
      border: "border-[#3a5a4a]/35",
      bg: "bg-gradient-to-r from-[#2a4a3a] via-[#3d6a52] to-[#5a8a68]",
      iconBg: "bg-[#e8f5ec]",
      muted: "text-[#d8f0e0]/85",
      title: "text-[#f4fff8]",
      ctaBorder: "border-[#d8f0e0]/35",
      ctaBg: "bg-[#d8f0e0]/15 group-hover:bg-[#d8f0e0]/25",
    },
  },
  {
    id: "dean-morris",
    href: "https://www.awin1.com/cread.php?awinmid=28517&awinaffid=3048693&ued=https%3A%2F%2Fdeanmorriscards.co.uk%2F",
    label: "Dean Morris Cards",
    blurb: "Funny, heartfelt greeting cards — shop Dean Morris Cards",
    emoji: "🃏",
    tone: {
      border: "border-[#4a5a7a]/40",
      bg: "bg-gradient-to-r from-[#2a3548] via-[#3d4a68] to-[#5a6a88]",
      iconBg: "bg-[#e8eef8]",
      muted: "text-[#d8e4f8]/85",
      title: "text-[#f4f7ff]",
      ctaBorder: "border-[#d8e4f8]/35",
      ctaBg: "bg-[#d8e4f8]/15 group-hover:bg-[#d8e4f8]/25",
    },
  },
  {
    id: "vintage-wine",
    href: "https://tidd.ly/4xUTqOJ",
    label: "Vintage Wine Gifts",
    blurb: "Anniversary vintage wine & port gifts — Vintage Wine Gifts",
    emoji: "🍷",
    tone: {
      border: "border-[#5a2a3a]/40",
      bg: "bg-gradient-to-r from-[#3a1520] via-[#5a2030] to-[#7a3040]",
      iconBg: "bg-[#f8e8ec]",
      muted: "text-[#f0d8e0]/85",
      title: "text-[#fff5f8]",
      ctaBorder: "border-[#f0d8e0]/35",
      ctaBg: "bg-[#f0d8e0]/15 group-hover:bg-[#f0d8e0]/25",
    },
  },
];

/** Desktop right-edge slides. */
export const SIDE_SLIDE_OFFERS = AFFILIATE_OFFERS.filter(
  (o) =>
    o.id === "cadbury" ||
    o.id === "social-stories" ||
    o.id === "dean-morris" ||
    o.id === "vintage-wine"
);

/** Offers shown in the footer banners (side-only exclusives stay out). */
export const FOOTER_AFFILIATE_OFFERS = AFFILIATE_OFFERS.filter(
  (o) =>
    o.id !== "social-stories" &&
    o.id !== "dean-morris" &&
    o.id !== "vintage-wine"
);