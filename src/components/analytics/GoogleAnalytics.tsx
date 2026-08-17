import Script from "next/script";
import { getGaMeasurementId } from "@/lib/analytics";

/** Loads the Google tag (gtag.js) when a GA4 Measurement ID is set. */
export function GoogleAnalytics() {
  const id = getGaMeasurementId();
  if (!id) return null;

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
