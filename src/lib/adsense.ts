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

export function getAdsenseEndSlot() {
  return process.env.NEXT_PUBLIC_ADSENSE_SLOT_END?.trim() || "";
}

export function adsenseConfigured() {
  return Boolean(getAdsenseClientId() && getAdsenseEndSlot());
}
