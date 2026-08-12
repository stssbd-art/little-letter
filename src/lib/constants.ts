import type { MessageStyle, Occasion, Relationship } from "@/types";

export const SITE_NAME = "Little Letter";
export const SITE_TAGLINE =
  "Send a cute letter or romantic mixtape by email — cosy notes for someone you miss.";
export const SITE_DESCRIPTION =
  "Little Letter helps you send a personal letter or romantic mixtape online. Write a warm message or burn a cassette-style mix, then email it to a friend, partner, or family member. First two letters free · then £0.99. Mixtapes from £1.25.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sendlittleletter.vercel.app";

export const SEO_KEYWORDS = [
  "send a letter online",
  "send a letter by email",
  "send mixtape online",
  "email a mixtape",
  "romantic mixtape email",
  "send cute message",
  "send love letter online",
  "digital mixtape for someone",
  "personal email letter",
  "little letter",
  "nostalgic email letter",
  "cassette mixtape gift",
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
} as const;

export const MOODS = [
  { emoji: "🍃", label: "Calm" },
  { emoji: "☁️", label: "Dreamy" },
  { emoji: "✨", label: "Sparkly" },
  { emoji: "🍀", label: "Lucky" },
  { emoji: "💌", label: "Letter-y" },
  { emoji: "🌙", label: "Cosy" },
  { emoji: "🦋", label: "Fluttery" },
  { emoji: "🌈", label: "Rainbow" },
] as const;
