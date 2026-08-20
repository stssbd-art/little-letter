"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { LetterProvider } from "@/components/providers/LetterProvider";
import { EasterEggProvider } from "@/components/providers/EasterEggProvider";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { CookieConsentBanner } from "@/components/features/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AdSenseLoader } from "@/components/ads/AdSenseLoader";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <ThemeProvider>
        <SoundProvider>
          <LetterProvider>
            <EasterEggProvider>
              {children}
              <CookieConsentBanner />
              <GoogleAnalytics />
              <AdSenseLoader />
            </EasterEggProvider>
          </LetterProvider>
        </SoundProvider>
      </ThemeProvider>
    </CookieConsentProvider>
  );
}
