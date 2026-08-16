/** Normalize AdSense publisher ID to `ca-pub-…`. */
export function normalizeAdsenseClientId(raw?: string | null) {
  const value = raw?.trim();
  if (!value) return "";
  if (value.startsWith("ca-pub-")) return value;
  if (value.startsWith("pub-")) return `ca-${value}`;
  return value;
}

export function getAdsenseClientId() {
  return normalizeAdsenseClientId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);
}

/** Ad unit slot — must be the data-ad-slot from AdSense, not the publisher ID. */
export function getAdsenseEndSlot() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_END?.trim() || "";
  if (!slot) return "";

  const clientDigits = getAdsenseClientId().replace(/\D/g, "");
  const slotDigits = slot.replace(/\D/g, "");
  // Common mistake: pasting pub-… / ca-pub-… digits into the slot env var.
  if (clientDigits && slotDigits && clientDigits === slotDigits) return "";

  return slot;
}

export function adsenseConfigured() {
  return Boolean(getAdsenseClientId() && getAdsenseEndSlot());
}
