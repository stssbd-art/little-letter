"use client";

import Script from "next/script";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

/** Awin publisher MasterTag — loads only after optional cookie consent. */
export function AwinMasterTag() {
  const { ready, marketingAllowed } = useCookieConsent();

  if (!ready || !marketingAllowed) return null;

  return (
    <Script
      id="awin-mastertag"
      src="https://www.dwin2.com/pub.3048693.min.js"
      strategy="afterInteractive"
    />
  );
}
