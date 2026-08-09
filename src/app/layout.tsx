import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand, Press_Start_2P } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { AnimatedBackground } from "@/components/decorations/AnimatedBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cosy notes for cosy people`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  keywords: [
    "little letter",
    "send cute messages",
    "nostalgic email",
    "pixel art letters",
    "friendship notes",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf4e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1610" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${quicksand.variable} ${pressStart.variable} antialiased`}
      >
        <AppProviders>
          <AnimatedBackground>
            <Header />
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:py-12">
              {children}
            </main>
            <Footer />
          </AnimatedBackground>
        </AppProviders>
      </body>
    </html>
  );
}
