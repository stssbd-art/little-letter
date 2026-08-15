export type Occasion =
  | "birthday"
  | "love"
  | "friendship"
  | "good-luck"
  | "thinking-of-you"
  | "thank-you"
  | "congratulations"
  | "sorry";

export type MessageStyle =
  | "cute"
  | "funny"
  | "romantic"
  | "whimsical"
  | "poetic"
  | "encouraging";

export type Relationship =
  | "friend"
  | "family"
  | "partner"
  | "colleague"
  | "other";

export interface LetterFormData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  relationship: Relationship;
  occasion: Occasion;
  style: MessageStyle;
  customNote: string;
}

export interface GeneratedLetter {
  subject: string;
  message: string;
  form: LetterFormData;
  createdAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  emoji: string;
  createdAt: string;
}

/** Opt-in homepage example — short preview only, never emails. */
export interface SharedExample {
  id: string;
  kind: "letter" | "mixtape";
  fromName: string;
  toName: string;
  /** Occasion label (letter) or mixtape title */
  label: string;
  snippet: string;
  createdAt: string;
}

export interface MixtapePayload {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  title: string;
  dedication: string;
  trackIds: string[];
  customTracks?: Array<{
    id: string;
    title: string;
    artist: string;
    year: string;
    youtubeId: string;
  }>;
  createdAt: string;
}

export interface ApiError {
  error: string;
}
