"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { FORTUNES } from "@/lib/fortunes";
import { pickRandom } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

export function FortuneCookie() {
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [fortune, setFortune] = useState("");

  return (
    <PixelWindow title="fortune_cookie.com" icon="🥠">
      <div className="flex flex-col items-center text-center">
        <motion.button
          type="button"
          className="cursor-pointer border-0 bg-transparent text-5xl"
          whileHover={{ scale: 1.08, rotate: open ? 0 : 8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            play("sparkle");
            if (!open) {
              setFortune(pickRandom(FORTUNES));
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          aria-label={open ? "Close fortune cookie" : "Open fortune cookie"}
        >
          🥠
        </motion.button>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.p
              key={fortune}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 max-w-sm font-display text-base text-[var(--ll-ink)]"
            >
              {fortune}
            </motion.p>
          ) : (
            <motion.p
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-[var(--ll-muted)]"
            >
              Crack open for a tiny prophecy
            </motion.p>
          )}
        </AnimatePresence>
        {open ? (
          <PixelButton
            size="sm"
            variant="ghost"
            className="mt-3"
            onClick={() => {
              play("sparkle");
              setFortune(pickRandom(FORTUNES));
            }}
          >
            New fortune
          </PixelButton>
        ) : null}
      </div>
    </PixelWindow>
  );
}
