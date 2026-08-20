"use client";

import Script from "next/script";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { getAdsenseClientId } from "@/lib/adsense";

/** Loads AdSense only after the visitor accepts optional cookies. */
export function AdSenseLoader() {
  const { ready, marketingAllowed } = useCookieConsent();
  const client = getAdsenseClientId();

  if (!client || !ready || !marketingAllowed) return null;

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
