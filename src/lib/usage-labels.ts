/** Client-safe pricing (no DB / Stripe / Node-only imports). */

/** Letters: completely free, no send limit (audience growth). */
export const LETTERS_ARE_FREE = true;
export const FREE_LETTERS = 0;
export const LETTER_PRICE_LABEL = "Free";
export const LETTER_PRICE_PENCE = 0;

/** E-cards: every send is paid */
export const CARDS_ARE_FREE = false;
export const FREE_CARDS = 0;
export const CARD_PRICE_LABEL = "£0.70";
export const CARD_PRICE_PENCE = 70;

/** Mixtapes: first one free, then tiered */
export const FREE_MIXTAPES = 1;
export const MIX_ONE_SONG_LABEL = "£0.99";
export const MIX_MULTI_SONG_LABEL = "£1.20";
export const MIX_ONE_SONG_PENCE = 99;
export const MIX_MULTI_SONG_PENCE = 120;

export type CheckoutKind = "letter" | "mixtape" | "card";

export function mixtapePrice(trackCount: number) {
  const count = Math.max(0, Math.floor(trackCount));
  if (count <= 1) {
    return {
      pence: MIX_ONE_SONG_PENCE,
      label: MIX_ONE_SONG_LABEL,
      name: "Little Letter mixtape (1 song)",
      description: "Send a one-song mixtape by email",
    };
  }
  return {
    pence: MIX_MULTI_SONG_PENCE,
    label: MIX_MULTI_SONG_LABEL,
    name: "Little Letter mixtape (multi-song)",
    description: "Send a multi-song mixtape by email",
  };
}

export function isDemoMode() {
  return process.env.DEMO_MODE?.trim() === "true";
}
