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
import { OCCASION_SEO_LIST } from "@/lib/occasion-seo";
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
          className="mt-6 max-w-lg font-display text-lg text-[var(--ll-muted)] sm:text-xl"
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

      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Send birthday cards, wishes & letters online
        </h1>
        <p className="font-display text-base leading-relaxed text-[var(--ll-muted)]">
          Little Letter lets you email digital birthday cards, occasion wishes,
          personal letters, and romantic mixtapes to someone you care about.
          Write a cute note for birthdays, weddings, Valentine&apos;s,
          Mother&apos;s or Father&apos;s Day, love, friendship, or
          &ldquo;thinking of you&rdquo; — or label a cassette, pick songs, and
          send a playable mix.
        </p>
        <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
          Your first two letters are free, then £0.99 each. Your first mixtape
          is free; extra mixes are £1.25 for 1 song, or £1.55 for 2 or more.
        </p>
        <div className="pt-2">
          <Link
            href="/occasions"
            className="text-sm font-display text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-4 hover:opacity-80"
          >
            Browse all occasion cards & wishes →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl">
        <h2 className="text-center font-pixel text-[10px] text-[var(--ll-pink-deep)]">
          Popular cards & wishes
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {OCCASION_SEO_LIST.slice(0, 8).map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${o.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--ll-lavender)] bg-white/60 px-3 py-1.5 text-xs text-[var(--ll-ink)] hover:border-[var(--ll-pink-deep)] dark:bg-white/10"
              >
                <span aria-hidden>{o.emoji}</span>
                {o.label}
              </Link>
            </li>
          ))}
        </ul>
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
