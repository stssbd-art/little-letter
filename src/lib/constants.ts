import type { MessageStyle, Occasion, Relationship } from "@/types";

export const SITE_NAME = "Little Letter";
export const SITE_TAGLINE = "Send a little happiness to someone today.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://little-letter.vercel.app";

export const OCCASIONS: {
  value: Occasion;
  label: string;
  emoji: string;
}[] = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "love", label: "Love", emoji: "❤️" },
  { value: "friendship", label: "Friendship", emoji: "🌸" },
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
  guestbook: "little-letter-guestbook",
  soundMuted: "little-letter-sound-muted",
  theme: "little-letter-theme",
  visitorCount: "little-letter-visitor-count",
  mood: "little-letter-mood",
} as const;

export const MOODS = [
  { emoji: "🌸", label: "Blooming" },
  { emoji: "☁️", label: "Dreamy" },
  { emoji: "✨", label: "Sparkly" },
  { emoji: "🍀", label: "Lucky" },
  { emoji: "💌", label: "Letter-y" },
  { emoji: "🌙", label: "Cosy" },
  { emoji: "🦋", label: "Fluttery" },
  { emoji: "🌈", label: "Rainbow" },
] as const;
