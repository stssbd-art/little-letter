import type { Metadata } from "next";
import { PixelButton } from "@/components/ui/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Paperless Wishes — Care for the Planet",
  description:
    "Little Letter spreads paperless wishes — warm digital letters and mixtapes that are softer on the planet than printed cards.",
  alternates: { canonical: "/paperless" },
};

export default function PaperlessPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Paperless wishes">
        Softer on the planet. Still full of heart.
      </PageHeader>

      <section aria-labelledby="paperless-heading">
        <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--ll-mint-deep)] bg-gradient-to-br from-[#e8f0d4] via-[#f2f7e4] to-[var(--ll-mint)] px-5 py-7 shadow-[4px_4px_0_var(--ll-mint-shadow)] dark:from-[#2a3220] dark:via-[#24301c] dark:to-[#1e2818] sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute -right-6 -top-6 text-7xl opacity-20 sm:text-8xl"
            aria-hidden
          >
            🌿
          </div>
          <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-mint-deep)]">
            LITTLE PLANET · PAPERLESS WISHES
          </p>
          <h2
            id="paperless-heading"
            className="mt-2 max-w-xl font-display text-2xl leading-snug text-[var(--ll-ink)] sm:text-3xl"
          >
            We care about the environment
          </h2>
          <p className="mt-3 max-w-2xl font-display text-base leading-relaxed text-[var(--ll-ink)]/85">
            Every card printed is paper, ink, and a trip through the post. We
            like to spread{" "}
            <span className="font-semibold text-[var(--ll-mint-deep)]">
              paperless wishes
            </span>{" "}
            instead — warm letters and mixtapes that reach someone you miss
            without cutting down a tree. Softer on the planet. Still full of
            heart.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ll-muted)]">
            Send love digitally. Keep the forests for walks, shade, and rainy
            days.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <PixelButton href="/create" variant="secondary">Send a paperless wish</PixelButton>
            <PixelButton href="/mixtape" variant="ghost">Or a mixtape</PixelButton>
          </div>
        </div>
      </section>
    </div>
  );
}
