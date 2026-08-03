"use client";

import { useState } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { CUTE_FACTS } from "@/lib/facts";
import { pickRandom } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

export function CuteFact() {
  const { play } = useSound();
  const [fact, setFact] = useState(() => pickRandom(CUTE_FACTS));

  return (
    <PixelWindow title="cute_facts.exe" icon="🐰">
      <p className="text-sm leading-relaxed text-[var(--ll-ink)]">{fact}</p>
      <PixelButton
        size="sm"
        variant="secondary"
        className="mt-4"
        onClick={() => {
          play("click");
          setFact(pickRandom(CUTE_FACTS));
        }}
      >
        Another fact ✨
      </PixelButton>
    </PixelWindow>
  );
}
