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
          className="mt-8 flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <Link href="/create" className="sm:w-auto">
            <PixelButton size="lg" className="w-full sm:w-auto">
              ✉️ Create a Little Letter
            </PixelButton>
          </Link>
          <Link href="/cards" className="sm:w-auto">
            <PixelButton size="lg" variant="secondary" className="w-full sm:w-auto">
              💌 Send a Card
            </PixelButton>
          </Link>
          <Link href="/mixtape" className="sm:w-auto">
            <PixelButton size="lg" variant="ghost" className="w-full sm:w-auto">
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

      <section className="grid gap-5 md:grid-cols-2">
        <DailyQuote />
        <CuteFact />
        <FortuneCookie />
        <VisitorCounter />
      </section>

      <TodaysMood />
      <Guestbook />
      <div className="flex justify-center">
        <Link href="/wall">
          <PixelButton variant="secondary" size="lg">
            🧱 See shared peeks on The Wall
          </PixelButton>
        </Link>
      </div>
    </div>
  );
}
