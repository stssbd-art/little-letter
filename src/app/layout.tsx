import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand, Press_Start_2P, Great_Vibes } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { AnimatedBackground } from "@/components/decorations/AnimatedBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EndPageAdGate } from "@/components/ads/EndPageAdGate";
import { AffiliateBanner } from "@/components/ads/AffiliateBanner";
import { AffiliateSideSlide } from "@/components/ads/AffiliateSideSlide";
import {
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";
import { getAdsenseClientId } from "@/lib/adsense";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Send a Letter or Mixtape Online`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} — Send a Letter or Mixtape Online`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Send a letter or mixtape online`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Send a Letter or Mixtape Online`,
    description: SITE_TAGLINE,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
  ...(getAdsenseClientId()
    ? { other: { "google-adsense-account": getAdsenseClientId() } }
    : {}),
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      "HUX-yvyyic4hnUXuMcr8_z-SDzlxSHFNOchsSeRACNQ",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf4e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1610" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "GBP",
    description:
      "First two letters free, then £0.99. First mixtape free, then £1.25 for 1 song or £1.55 for 2+ songs.",
  },
  featureList: [
    "Send a personal letter by email",
    "Send a romantic mixtape by email",
    "Cute retro letter design",
    "Cassette-style mixtape player",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${quicksand.variable} ${pressStart.variable} ${greatVibes.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>
          <AnimatedBackground>
            <Header />
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:py-12">
              {children}
            </main>
            <EndPageAdGate />
            <AffiliateBanner />
            <AffiliateSideSlide />
            <Footer />
          </AnimatedBackground>
        </AppProviders>
      </body>
    </html>
  );
}
