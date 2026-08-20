import { SITE_URL } from "@/lib/constants";
import {
  isCardDesignId,
  type CardDesignId,
} from "@/lib/card-designs";
import type { Occasion } from "@/types";
import { OCCASIONS } from "@/lib/constants";

export type CardShare = {
  designId: CardDesignId;
  from: string;
  to: string;
  subject: string;
  message: string;
  occasion: Occasion;
};

function toBase64Url(text: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(text, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(code: string): string {
  const padded = code.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const base64 = padded + pad;

  if (typeof window === "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function sanitize(text: string, max: number) {
  return text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
}

function isOccasion(value: string): value is Occasion {
  return OCCASIONS.some((o) => o.value === value);
}

/**
 * Compact open-card codes for email links.
 * Format: c1.<base64url(design\x1ffrom\x1fto\x1fsubject\x1foccasion\x1fmessage)>
 */
export function encodeCardShare(card: CardShare): string {
  const parts = [
    card.designId,
    sanitize(card.from, 60),
    sanitize(card.to, 60),
    sanitize(card.subject, 120),
    card.occasion,
    sanitize(card.message, 2500),
  ];
  return `c1.${toBase64Url(parts.join("\u001f"))}`;
}

export function decodeCardShare(code: string): CardShare | null {
  const trimmed = code.trim();
  if (!trimmed.startsWith("c1.")) return null;
  try {
    const raw = fromBase64Url(trimmed.slice(3));
    const [designId, from, to, subject, occasion, message] = raw.split("\u001f");
    if (!designId || !isCardDesignId(designId)) return null;
    if (!occasion || !isOccasion(occasion)) return null;
    if (!from?.trim() || !to?.trim() || !message?.trim()) return null;
    return {
      designId,
      from: sanitize(from, 60),
      to: sanitize(to, 60),
      subject: sanitize(subject || designId, 120),
      occasion,
      message: sanitize(message, 2500),
    };
  } catch {
    return null;
  }
}

export function buildCardOpenUrl(card: CardShare): string {
  return `${SITE_URL}/open/${encodeURIComponent(encodeCardShare(card))}`;
}

export function cardShareFromLetter(letter: {
  subject: string;
  message: string;
  form: {
    cardDesign?: string;
    senderName: string;
    recipientName: string;
    occasion: Occasion;
  };
}): CardShare | null {
  const designId = letter.form.cardDesign;
  if (!designId || !isCardDesignId(designId)) return null;
  return {
    designId,
    from: letter.form.senderName,
    to: letter.form.recipientName,
    subject: letter.subject,
    message: letter.message,
    occasion: letter.form.occasion,
  };
}
