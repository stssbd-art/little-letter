"use client";

import { motion } from "framer-motion";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useSound } from "@/components/providers/SoundProvider";

export function MoonEasterEgg() {
  const { triggerStars } = useEasterEggs();
  const { play } = useSound();

  return (
    <motion.button
      type="button"
      className="absolute right-[8%] top-6 z-20 cursor-pointer border-0 bg-transparent text-4xl sm:text-5xl"
      whileHover={{ scale: 1.1, rotate: 8 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      onClick={() => {
        play("sparkle");
        triggerStars();
      }}
      aria-label="Click the moon to make stars appear"
      title="Click me for stars!"
    >
      🌙
    </motion.button>
  );
}

export function FlowerEasterEgg() {
  const { triggerPetals } = useEasterEggs();
  const { play } = useSound();

  return (
    <motion.button
      type="button"
      className="absolute bottom-24 left-[6%] z-20 cursor-pointer border-0 bg-transparent text-3xl"
      whileHover={{ scale: 1.15, rotate: -10 }}
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 3, repeat: Infinity }}
      onClick={() => {
        play("sparkle");
        triggerPetals();
      }}
      aria-label="Click flower to make petals fall"
      title="Click me for petals!"
    >
      🌷
    </motion.button>
  );
}
