import type { Metadata } from "next";
import { Suspense } from "react";
import { MixtapeForm } from "@/components/features/MixtapeForm";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Send a Romantic Mixtape Online",
  description:
    "Burn a romantic mixtape online and email it to someone you miss. Pick songs, label a cassette, add a dedication — first mixtape free, then £0.99 for 1 song, £1.20 for 2+.",
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
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader kicker="SIDE A · PRESS RECORD" title="Send a Mixtape">
        Label a cassette, pick songs, add a tiny dedication or a spoken voice
        note — first mixtape free, then £0.99 for 1 song or £1.20 for 2+ — then
        mail the mix.
      </PageHeader>

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
