"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo, Mascot } from "@/components/ui/Logo";
import { PixelButton } from "@/components/ui/PixelButton";
import { RetroMp3Player } from "@/components/features/RetroMp3Player";
import { DailyQuote } from "@/components/features/DailyQuote";
import { CuteFact } from "@/components/features/CuteFact";
import { FortuneCookie } from "@/components/features/FortuneCookie";
import { VisitorCounter } from "@/components/features/VisitorCounter";
import { TodaysMood } from "@/components/features/TodaysMood";
import { Guestbook } from "@/components/features/Guestbook";
import { SharedExamples } from "@/components/features/SharedExamples";
import { SITE_TAGLINE } from "@/lib/constants";

export function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Logo size="lg" />
        <div className="mt-8">
          <Mascot />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-lg text-center font-display text-lg text-[var(--ll-muted)] sm:text-xl"
        >
          {SITE_TAGLINE}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/create">
            <PixelButton size="lg">💌 Create a Little Letter</PixelButton>
          </Link>
          <Link href="/mixtape">
            <PixelButton size="lg" variant="secondary">
              📼 Send a Mixtape
            </PixelButton>
          </Link>
        </motion.div>
        <p className="mt-4 font-pixel text-[9px] leading-relaxed text-[var(--ll-muted)]">
          Press play · write a note · burn a tape
        </p>

        <div className="mt-10 w-full max-w-lg">
          <RetroMp3Player />
        </div>
      </section>

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
            <Link href="/create">
              <PixelButton variant="secondary">Send a paperless wish</PixelButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <DailyQuote />
        <CuteFact />
        <FortuneCookie />
        <VisitorCounter />
      </section>

      <TodaysMood />
      <SharedExamples />
      <Guestbook />
    </div>
  );
}
