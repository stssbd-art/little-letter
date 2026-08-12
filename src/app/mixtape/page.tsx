import type { Metadata } from "next";
import { Suspense } from "react";
import { MixtapeForm } from "@/components/features/MixtapeForm";
import { PixelWindow } from "@/components/ui/PixelWindow";

export const metadata: Metadata = {
  title: "Send a Romantic Mixtape Online",
  description:
    "Burn a romantic mixtape online and email it to someone you miss. Pick songs, label a cassette, add a dedication — £1.25 for 1 song, £1.55 for 2+.",
  alternates: { canonical: "/mixtape" },
  keywords: [
    "send mixtape online",
    "email a mixtape",
    "romantic mixtape",
    "digital cassette mixtape",
    "send love songs by email",
  ],
};

export default function MixtapePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-muted)]">
          SIDE A · PRESS RECORD
        </p>
        <h1 className="mt-2 font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Send a Mixtape
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-display text-[var(--ll-muted)]">
          Label a cassette, pick one or more songs, add a tiny dedication —
          £1.25 for 1 song, £1.55 for 2+.
          then mail the mix across the internet.
        </p>
      </div>

      <Suspense
        fallback={
          <PixelWindow title="loading_tape.wav" icon="⏳">
            <p className="text-sm text-[var(--ll-muted)]">Spooling the reels…</p>
          </PixelWindow>
        }
      >
        <MixtapeForm />
      </Suspense>
    </div>
  );
}
