"use client";

import Link from "next/link";
import { GreetingCard } from "@/components/features/GreetingCard";
import { CARD_DESIGNS } from "@/lib/card-designs";

export function CardsDesignShowcase() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARD_DESIGNS.map((design) => {
        const occasion = design.bestFor[0] ?? "friendship";
        return (
          <li key={design.id}>
            <Link
              href={`/create?occasion=${occasion}`}
              className="block rounded-2xl outline-offset-4 transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ll-pink-deep)]"
            >
              <GreetingCard designId={design.id} compact />
              <div className="mt-2 px-1">
                <p className="font-display text-sm text-[var(--ll-ink)]">
                  {design.emoji} {design.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--ll-muted)]">
                  {design.blurb}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
