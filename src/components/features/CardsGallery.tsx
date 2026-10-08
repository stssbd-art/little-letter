"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import { OccasionPicker } from "@/components/features/OccasionPicker";
import { CARD_DESIGNS, designsForOccasion } from "@/lib/card-designs";
import { OCCASIONS } from "@/lib/constants";
import type { Occasion } from "@/types";
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

  const options = filters.flatMap((f) => {
    const count =
      f.value === "all" ? CARD_DESIGNS.length : designsForOccasion(f.value).length;
    if (f.value !== "all" && count === 0) return [];
    return [
      {
        value: f.value,
        label: f.label,
        emoji: f.emoji,
        hint: `${count} card${count === 1 ? "" : "s"}`,
      },
    ];
  });
  const current =
    options.find((option) => option.value === filter) ?? options[0]!;

  return (
    <div className="space-y-5">
      <OccasionPicker
        label="Show cards for"
        current={current}
        options={options}
        onSelect={(value) => {
          play("click");
          setFilter(value as Filter);
        }}
      />

      <p className="text-sm text-[var(--ll-muted)]">
        {designs.length} illustrated e-card{designs.length === 1 ? "" : "s"} —
        each shows a big preview so you can see the style before you personalise.
      </p>

      <ul className="grid gap-8 sm:grid-cols-2">
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
                <p className="mt-2 text-center text-xs text-[var(--ll-muted)]">
                  {occasion?.emoji} {occasion?.label}
                  <span className="ml-2 text-[var(--ll-pink-deep)]">Open</span>
                </p>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
