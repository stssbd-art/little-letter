"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { LetterProvider } from "@/components/providers/LetterProvider";
import { EasterEggProvider } from "@/components/providers/EasterEggProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <LetterProvider>
          <EasterEggProvider>{children}</EasterEggProvider>
        </LetterProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
