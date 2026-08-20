import { EndPageAdConsent } from "@/components/ads/EndPageAdConsent";
import { getAdsenseClientId, getAdsenseEndSlot } from "@/lib/adsense";

/** Server wrapper — reads Sensitive env vars and passes them into the client ad unit. */
export function EndPageAdGate() {
  const client = getAdsenseClientId();
  const slot = getAdsenseEndSlot();
  if (!client || !slot) return null;
  return <EndPageAdConsent client={client} slot={slot} />;
}
