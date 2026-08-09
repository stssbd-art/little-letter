"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-sm sm:text-base",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-5xl",
  };

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ll-pink-deep)]"
      aria-label="Little Letter home"
    >
      <motion.span
        aria-hidden
        animate={{ y: [0, -3, 0], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={size === "lg" ? "text-4xl sm:text-5xl" : "text-xl"}
      >
        💌
      </motion.span>
      <span
        className={`font-pixel leading-relaxed text-[var(--ll-pink-deep)] drop-shadow-[2px_2px_0_var(--ll-pink-glow)] dark:text-[var(--ll-pink)] ${sizes[size]}`}
      >
        Little Letter
      </span>
    </Link>
  );
}

export function Mascot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative inline-flex flex-col items-center ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border-4 border-[var(--ll-pink-deep)] bg-gradient-to-b from-[#fff6df] to-[#f6d58a] shadow-[6px_6px_0_var(--ll-pink-shadow)] dark:from-[#5c3d1e] dark:to-[#3d2f22]">
        <div className="absolute left-7 top-9 h-3.5 w-3.5 rounded-sm bg-[var(--ll-ink)]" />
        <div className="absolute right-7 top-9 h-3.5 w-3.5 rounded-sm bg-[var(--ll-ink)]" />
        <div
          className="absolute bottom-8 left-1/2 h-5 w-10 -translate-x-1/2 rounded-b-full border-b-[3.5px] border-l-[3.5px] border-r-[3.5px] border-[var(--ll-pink-deep)]"
          aria-hidden
        />
        <motion.div
          className="absolute -right-2 -top-2 text-lg"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -left-3 text-base"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          ⭐
        </motion.div>
      </div>
      <p className="mt-3 font-pixel text-[9px] text-[var(--ll-muted)]">
        Pip the Envelope
      </p>
    </motion.div>
  );
}
