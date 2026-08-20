"use client";

import { EndPageAd } from "@/components/ads/EndPageAd";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

type Props = {
  client: string;
  slot: string;
};

/** Client gate — end-page ads only render after optional cookie consent. */
export function EndPageAdConsent({ client, slot }: Props) {
  const { ready, marketingAllowed } = useCookieConsent();
  if (!ready || !marketingAllowed) return null;
  return <EndPageAd client={client} slot={slot} />;
}
