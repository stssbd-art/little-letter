"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import { CARD_DESIGNS, designsForOccasion } from "@/lib/card-designs";
import { OCCASIONS } from "@/lib/constants";
import type { Occasion } from "@/types";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

type Filter = Occasion | "all";

export function CardsGallery() {
  const { play } = useSound();
  const [filter, setFilter] = useState<Filter>("all");

  const designs = useMemo(() => designsForOccasion(filter), [filter]);

  const filters: { value: Filter; label: string; emoji: string }[] = [
    { value: "all", label: "All cards", emoji: "✨" },
    ...OCCASIONS.map((o) => ({
      value: o.value,
      label: o.label,
      emoji: o.emoji,
    })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.value === "all"
              ? CARD_DESIGNS.length
              : designsForOccasion(f.value).length;
          if (f.value !== "all" && count === 0) return null;
          const selected = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                play("click");
                setFilter(f.value);
              }}
              className={cn(
                "rounded-full border-2 px-3 py-1.5 font-display text-xs transition",
                selected
                  ? "border-[var(--ll-pink-deep)] bg-[#fff6df] text-[var(--ll-ink)] shadow-[2px_2px_0_var(--ll-lavender-shadow)]"
                  : "border-[var(--ll-lavender)] bg-white/50 text-[var(--ll-muted)] hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
              )}
              aria-pressed={selected}
            >
              <span aria-hidden>{f.emoji}</span> {f.label}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-[var(--ll-muted)]">
        {designs.length} illustrated e-card{designs.length === 1 ? "" : "s"} —
        each shows a big preview so you can see the style before you personalise.
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((design, index) => {
          const occasion = OCCASIONS.find((o) => o.value === design.occasion);
          return (
            <motion.li
              key={design.id}
              initial={{ opacity: 0, y: 22, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                delay: Math.min(index * 0.045, 0.5),
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
            >
              <Link
                href={`/cards/${design.id}`}
                onClick={() => play("click")}
                className="group block rounded-2xl outline-offset-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ll-pink-deep)]"
                aria-label={`Personalise and send ${design.title} digital greeting card`}
              >
                <GreetingCard designId={design.id} compact />
                <div className="mt-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/60 px-3 py-2.5 dark:bg-white/5">
                  <p className="font-display text-sm font-semibold text-[var(--ll-ink)] transition group-hover:text-[var(--ll-pink-deep)]">
                    {design.emoji} {design.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-[var(--ll-muted)]">
                    {design.blurb}
                  </p>
                  <p className="mt-1.5 text-[10px] text-[var(--ll-muted)]">
                    {occasion?.emoji} {occasion?.label}
                    <span className="ml-2 font-pixel text-[7px] text-[var(--ll-pink-deep)]">
                      TAP TO OPEN →
                    </span>
                  </p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
