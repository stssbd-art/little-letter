"use client";

import Script from "next/script";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { getGaMeasurementId } from "@/lib/analytics";

/** Loads GA4 only after the visitor accepts optional cookies. */
export function GoogleAnalytics() {
  const { ready, marketingAllowed } = useCookieConsent();
  const id = getGaMeasurementId();

  if (!id || !ready || !marketingAllowed) return null;

  return (
    <>
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
`}
      </Script>
    </>
  );
}
