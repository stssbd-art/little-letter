import type { MessageStyle, Occasion, Relationship } from "@/types";

export const SITE_NAME = "Little Letter";
export const SITE_TAGLINE =
  "Send a sweet little letter or a romantic mixtape straight to their inbox. 💕";
export const SITE_TAGLINE_EXTRA =
  "Perfect for sharing cosy thoughts, sweet memories, and a little love with someone you miss. 🎶✨";
export const SITE_DESCRIPTION =
  "Little Letter helps you send digital birthday cards, occasion wishes, personal letters, and romantic mixtapes by email. Write a warm message for birthdays, weddings, Valentine's, thank you notes, and more — or burn a cassette-style mix. First two letters free · then £0.70.";
const DEFAULT_SITE_URL = "https://sendlittleletter.vercel.app";

function resolveSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

/** Public support / privacy contact (shown in footer and legal pages). */
export const CONTACT_EMAIL = "sendlittleletter@gmail.com";

export const SEO_KEYWORDS = [
  "birthday card",
  "birthday wish",
  "digital birthday card",
  "occasion card",
  "send wish online",
  "digital greeting card",
  "e-card",
  "send a letter online",
  "send mixtape online",
  "valentines day card",
  "mothers day card",
  "thank you card online",
  "wedding congratulations card",
  "send love letter online",
  "personal email letter",
  "little letter",
];

export const OCCASIONS: {
  value: Occasion;
  label: string;
  emoji: string;
}[] = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "love", label: "Love", emoji: "❤️" },
  { value: "friendship", label: "Friendship", emoji: "🤝" },
  { value: "good-luck", label: "Good Luck", emoji: "🍀" },
  { value: "thinking-of-you", label: "Thinking of You", emoji: "🌈" },
  { value: "thank-you", label: "Thank You", emoji: "🌻" },
  { value: "congratulations", label: "Congratulations", emoji: "🎉" },
  { value: "sorry", label: "Sorry", emoji: "💙" },
  { value: "wedding", label: "Wedding", emoji: "💒" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "promotion", label: "Promotion", emoji: "🚀" },
  { value: "valentines-day", label: "Valentine's Day", emoji: "💝" },
  { value: "mothers-day", label: "Mother's Day", emoji: "🌷" },
  { value: "fathers-day", label: "Father's Day", emoji: "👔" },
];

export const STYLES: {
  value: MessageStyle;
  label: string;
  description: string;
}[] = [
  { value: "cute", label: "Cute", description: "Soft, sweet and smile-inducing" },
  { value: "funny", label: "Funny", description: "Light jokes with a warm heart" },
  { value: "romantic", label: "Romantic", description: "Gentle butterflies and soft glow" },
  { value: "whimsical", label: "Whimsical", description: "Magic, daydreams and sparkles" },
  { value: "poetic", label: "Poetic", description: "Quiet beauty in carefully chosen words" },
  { value: "encouraging", label: "Encouraging", description: "A soft pep talk in letter form" },
];

export const RELATIONSHIPS: {
  value: Relationship;
  label: string;
}[] = [
  { value: "friend", label: "Friend" },
  { value: "family", label: "Family" },
  { value: "partner", label: "Partner" },
  { value: "colleague", label: "Colleague" },
  { value: "other", label: "Other" },
];

export const STORAGE_KEYS = {
  letterDraft: "little-letter-draft",
  mixtapeDraft: "little-letter-mixtape-draft",
  guestbook: "little-letter-guestbook",
  soundMuted: "little-letter-sound-muted",
  theme: "little-letter-theme",
  visitorCount: "little-letter-visitor-count",
  mood: "little-letter-mood",
  cookieConsent: "little-letter-cookie-consent",
} as const;

export const MOODS = [
  { emoji: "🍃", label: "Calm" },
  { emoji: "☁️", label: "Dreamy" },
  { emoji: "✨", label: "Sparkly" },
  { emoji: "🍀", label: "Lucky" },
  { emoji: "💌", label: "Letter-y" },
  { emoji: "🌙", label: "Cosy" },
  { emoji: "📼", label: "Mixtape-y" },
  { emoji: "🌈", label: "Rainbow" },
] as const;
