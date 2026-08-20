"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import { CARD_DESIGNS } from "@/lib/card-designs";
import { useSound } from "@/components/providers/SoundProvider";

/** Featured covers shown beside / above the letter form */
const FEATURED = CARD_DESIGNS.filter((d) =>
  [
    "balloon-bash",
    "blush-hearts",
    "rose-garden",
    "starlit-love",
    "sunflower-thanks",
    "wedding-rings",
    "honey-classic",
    "moon-whisper",
  ].includes(d.id)
);

function RailHeader() {
  const { play } = useSound();
  return (
    <div className="flex items-end justify-between gap-3 px-0.5">
      <div>
        <p className="font-pixel text-[8px] text-[var(--ll-pink-deep)]">
          e-cards.exe
        </p>
        <h2 className="font-display text-lg text-[var(--ll-ink)] sm:text-xl">
          Or send an illustrated card
        </h2>
        <p className="mt-0.5 text-xs text-[var(--ll-muted)]">
          Same send flow — pick a cover, write inside, email it.
        </p>
      </div>
      <Link
        href="/cards"
        onClick={() => play("click")}
        className="shrink-0 font-pixel text-[8px] text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-2"
      >
        See all →
      </Link>
    </div>
  );
}

/** Horizontal swipe rail for phones / tablets */
export function CreatePageCardsRailMobile() {
  const { play } = useSound();

  return (
    <aside className="space-y-3" aria-label="Illustrated e-cards">
      <RailHeader />
      <div className="-mx-1 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
        <ul className="flex w-max gap-3 px-1">
          {FEATURED.map((design, i) => (
            <motion.li
              key={design.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.35) }}
              className="w-[148px] shrink-0"
            >
              <Link
                href={`/cards/${design.id}`}
                onClick={() => play("click")}
                className="block rounded-2xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ll-pink-deep)]"
              >
                <GreetingCard designId={design.id} compact />
                <p className="mt-1.5 truncate px-0.5 font-display text-xs text-[var(--ll-ink)]">
                  {design.title}
                </p>
              </Link>
            </motion.li>
          ))}
          <li className="flex w-[132px] shrink-0 items-stretch">
            <Link
              href="/cards"
              onClick={() => play("click")}
              className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-[var(--ll-lavender)] bg-white/40 px-3 text-center font-display text-sm text-[var(--ll-pink-deep)] dark:bg-white/5"
            >
              All {CARD_DESIGNS.length} cards →
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

/** Sticky vertical stack beside the form on desktop */
export function CreatePageCardsRailDesktop() {
  const { play } = useSound();

  return (
    <aside className="space-y-3" aria-label="Illustrated e-cards">
      <RailHeader />
      <ul className="space-y-4">
        {FEATURED.slice(0, 5).map((design, i) => (
          <motion.li
            key={design.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + Math.min(i * 0.06, 0.3) }}
          >
            <Link
              href={`/cards/${design.id}`}
              onClick={() => play("click")}
              className="group block rounded-2xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ll-pink-deep)]"
            >
              <GreetingCard designId={design.id} compact />
              <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
                <p className="font-display text-sm text-[var(--ll-ink)] transition group-hover:text-[var(--ll-pink-deep)]">
                  {design.title}
                </p>
                <span className="font-pixel text-[7px] text-[var(--ll-pink-deep)]">
                  OPEN →
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
        <li>
          <Link
            href="/cards"
            onClick={() => play("click")}
            className="flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--ll-lavender)] bg-white/40 px-3 py-4 font-display text-sm text-[var(--ll-pink-deep)] transition hover:border-[var(--ll-pink-deep)] hover:bg-[#fff6df]/70 dark:bg-white/5"
          >
            Browse all {CARD_DESIGNS.length} e-cards →
          </Link>
        </li>
      </ul>
    </aside>
  );
}
