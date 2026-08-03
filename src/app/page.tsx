"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo, Mascot } from "@/components/ui/Logo";
import { PixelButton } from "@/components/ui/PixelButton";
import { DailyQuote } from "@/components/features/DailyQuote";
import { CuteFact } from "@/components/features/CuteFact";
import { FortuneCookie } from "@/components/features/FortuneCookie";
import { VisitorCounter } from "@/components/features/VisitorCounter";
import { TodaysMood } from "@/components/features/TodaysMood";
import { Guestbook } from "@/components/features/Guestbook";
import { SITE_TAGLINE } from "@/lib/constants";

const FLOATING = ["💌", "🌸", "⭐", "🦋", "💖", "☁️", "🍀", "✨"];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center">
        {FLOATING.map((emoji, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute text-2xl opacity-70"
            style={{
              left: `${8 + (i % 4) * 24}%`,
              top: `${12 + Math.floor(i / 4) * 55}%`,
            }}
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            aria-hidden
          >
            {emoji}
          </motion.span>
        ))}

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
          className="mt-8"
        >
          <Link href="/create">
            <PixelButton size="lg">💌 Create a Little Letter</PixelButton>
          </Link>
        </motion.div>
        <p className="mt-4 font-pixel text-[9px] leading-relaxed text-[var(--ll-muted)]">
          Windows of wonder · since forever-ish
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <DailyQuote />
        <CuteFact />
        <FortuneCookie />
        <VisitorCounter />
      </section>

      <TodaysMood />
      <Guestbook />
    </div>
  );
}
