import Script from "next/script";

/** Loads AdSense only when a publisher ID is configured. */
export function AdSenseLoader() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!client) return null;

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
