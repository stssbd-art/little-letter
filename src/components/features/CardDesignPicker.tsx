"use client";

import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import {
  designsForOccasion,
  type CardDesignId,
} from "@/lib/card-designs";
import type { Occasion } from "@/types";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

type Props = {
  occasion: Occasion;
  value: CardDesignId;
  onChange: (id: CardDesignId) => void;
};

export function CardDesignPicker({ occasion, value, onChange }: Props) {
  const { play } = useSound();
  const designs = designsForOccasion(occasion);

  return (
    <div>
      <p className="mb-1 font-display text-sm text-[var(--ll-ink)]">
        Pick a card design
      </p>
      <p className="mb-3 text-xs text-[var(--ll-muted)]">
        Designs suggested for this occasion come first — tap any style you like.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {designs.map((design, index) => {
          const selected = value === design.id;
          const suggested = design.bestFor.includes(occasion);
          return (
            <motion.button
              key={design.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => {
                play("click");
                onChange(design.id);
              }}
              className={cn(
                "rounded-2xl border-2 p-2 text-left transition",
                selected
                  ? "border-[var(--ll-pink-deep)] bg-[#fff6df] shadow-[3px_3px_0_var(--ll-lavender-shadow)]"
                  : "border-[var(--ll-lavender)] bg-white/50 hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
              )}
              aria-pressed={selected}
            >
              <GreetingCard designId={design.id} compact />
              <div className="mt-2 flex items-center justify-between gap-1 px-0.5">
                <span className="font-display text-xs text-[var(--ll-ink)]">
                  {design.label}
                </span>
                {suggested ? (
                  <span className="font-pixel text-[6px] text-[var(--ll-mint-deep)]">
                    FITS
                  </span>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
