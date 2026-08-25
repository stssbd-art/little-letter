export type Occasion =
  | "birthday"
  | "love"
  | "friendship"
  | "good-luck"
  | "thinking-of-you"
  | "thank-you"
  | "congratulations"
  | "sorry"
  | "wedding"
  | "graduation"
  | "promotion"
  | "valentines-day"
  | "mothers-day"
  | "fathers-day";

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

export type LetterWriteMode = "ai" | "own";

export type { CardDesignId } from "@/lib/card-designs";
import type { CardDesignId } from "@/lib/card-designs";
export type { LetterStationeryId } from "@/lib/letter-stationery";
import type { LetterStationeryId } from "@/lib/letter-stationery";

export interface LetterFormData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  /** Used to track free/paid sends without an account */
  senderEmail: string;
  relationship: Relationship;
  occasion: Occasion;
  style: MessageStyle;
  customNote: string;
  /** ai = generate with AI; own = sender writes the letter */
  writeMode: LetterWriteMode;
  ownSubject: string;
  ownMessage: string;
  /** Set when sending from the Cards gallery flow */
  cardDesign?: CardDesignId;
  /** Vintage paper look — also sets AI writing voice (see writingStyle on stationery) */
  stationery?: LetterStationeryId;
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

/** Opt-in Wall example — short preview only, never emails. */
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
  /** Used to track free/paid sends without an account */
  senderEmail: string;
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
