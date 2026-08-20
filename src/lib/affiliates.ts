/** Affiliate / sponsored placements (publisher links). */
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
];

/** Cadbury + Social Stories each get their own side slide (not stacked in one panel). */
export const SIDE_SLIDE_OFFERS = AFFILIATE_OFFERS.filter(
  (o) => o.id === "cadbury" || o.id === "social-stories"
);

/** Offers shown in the footer banners (side-slide exclusives stay out). */
export const FOOTER_AFFILIATE_OFFERS = AFFILIATE_OFFERS.filter(
  (o) => o.id !== "social-stories"
);