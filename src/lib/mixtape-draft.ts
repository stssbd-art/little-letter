import { STORAGE_KEYS } from "@/lib/constants";
import type { MixTrack } from "@/lib/tracks";

export type MixtapeDraft = {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  title: string;
  dedication: string;
  trackIds: string[];
  customTracks: MixTrack[];
};

export const EMPTY_MIXTAPE_DRAFT: MixtapeDraft = {
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  senderEmail: "",
  title: "",
  dedication: "",
  trackIds: [],
  customTracks: [],
};

function normalizeDraft(parsed: Partial<MixtapeDraft> | null | undefined): MixtapeDraft | null {
  if (!parsed || typeof parsed !== "object") return null;
  const trackIds = Array.isArray(parsed.trackIds)
    ? parsed.trackIds.filter((id): id is string => typeof id === "string")
    : [];
  const customTracks = Array.isArray(parsed.customTracks)
    ? parsed.customTracks.filter(
        (t): t is MixTrack =>
          Boolean(t && typeof t === "object" && typeof t.id === "string")
      )
    : [];
  return {
    recipientName: typeof parsed.recipientName === "string" ? parsed.recipientName : "",
    recipientEmail:
      typeof parsed.recipientEmail === "string" ? parsed.recipientEmail : "",
    senderName: typeof parsed.senderName === "string" ? parsed.senderName : "",
    senderEmail:
      typeof parsed.senderEmail === "string" ? parsed.senderEmail : "",
    title: typeof parsed.title === "string" ? parsed.title : "",
    dedication: typeof parsed.dedication === "string" ? parsed.dedication : "",
    trackIds,
    customTracks,
  };
}

/** Prefer session, fall back to local — local survives new tabs (Preview mix). */
export function loadMixtapeDraft(): MixtapeDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const sessionRaw = sessionStorage.getItem(STORAGE_KEYS.mixtapeDraft);
    const localRaw = localStorage.getItem(STORAGE_KEYS.mixtapeDraft);
    const session = sessionRaw
      ? normalizeDraft(JSON.parse(sessionRaw) as Partial<MixtapeDraft>)
      : null;
    const local = localRaw
      ? normalizeDraft(JSON.parse(localRaw) as Partial<MixtapeDraft>)
      : null;
    if (session?.trackIds.length) return session;
    if (local?.trackIds.length) return local;
    return session ?? local;
  } catch {
    return null;
  }
}

export function saveMixtapeDraft(draft: MixtapeDraft) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(draft);
  try {
    sessionStorage.setItem(STORAGE_KEYS.mixtapeDraft, payload);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(STORAGE_KEYS.mixtapeDraft, payload);
  } catch {
    /* ignore */
  }
}

export function clearMixtapeDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.mixtapeDraft);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.mixtapeDraft);
  } catch {
    /* ignore */
  }
}

export function draftHasSongs(draft: MixtapeDraft | null | undefined) {
  return Boolean(draft?.trackIds?.length);
}
