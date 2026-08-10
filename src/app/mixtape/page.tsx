import type { Metadata } from "next";
import { Suspense } from "react";
import { MixtapeForm } from "@/components/features/MixtapeForm";
import { PixelWindow } from "@/components/ui/PixelWindow";

export const metadata: Metadata = {
  title: "Send a Mixtape",
  description:
    "Burn a romantic cassette mixtape and email it to someone you miss.",
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
          Label a cassette, pick at least 3 songs, add a tiny dedication —
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
