"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-[10px] sm:text-base",
    md: "text-lg sm:text-2xl",
    lg: "text-xl sm:text-5xl",
  };

  return (
    <Link
      href="/"
      className="group inline-flex max-w-full items-center gap-1.5 rounded-sm outline-none focus-visible:outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4 sm:gap-2"
      aria-label="Little Letter home"
    >
      <motion.span
        aria-hidden
        animate={{ y: [0, -3, 0], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={
          size === "lg"
            ? "text-2xl sm:text-5xl"
            : size === "sm"
              ? "text-base sm:text-lg"
              : "text-lg sm:text-xl"
        }
      >
        💌
      </motion.span>
      <span
        className={`truncate font-pixel leading-relaxed text-[var(--ll-pink-deep)] drop-shadow-[2px_2px_0_var(--ll-pink-glow)] dark:text-[var(--ll-pink)] ${sizes[size]}`}
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
      role="img"
      aria-label="Pip the Envelope, Little Letter’s friendly mascot"
    >
      <div
        className="relative flex h-20 w-20 items-center justify-center overflow-visible rounded-[22px] border-[3px] border-[var(--ll-pink-deep)] bg-gradient-to-b from-[#fff6df] to-[#f6d58a] shadow-[4px_4px_0_var(--ll-pink-shadow)] sm:h-28 sm:w-28 sm:rounded-[28px] sm:border-4 sm:shadow-[6px_6px_0_var(--ll-pink-shadow)] dark:from-[#5c3d1e] dark:to-[#3d2f22]"
        aria-hidden
      >
        {/* Percent-based so eyes stay visible at any face size */}
        <div className="absolute left-[22%] top-[34%] h-[12%] w-[12%] rounded-sm bg-[var(--ll-ink)]" />
        <div className="absolute right-[22%] top-[34%] h-[12%] w-[12%] rounded-sm bg-[var(--ll-ink)]" />
        <div className="absolute bottom-[28%] left-1/2 h-[7%] w-[22%] -translate-x-1/2 rounded-full bg-[var(--ll-pink-deep)]" />
        <motion.div
          className="absolute -right-1.5 -top-1.5 text-sm sm:-right-2 sm:-top-2 sm:text-lg"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-0.5 -left-2 text-sm sm:-bottom-1 sm:-left-3 sm:text-base"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          ⭐
        </motion.div>
      </div>
      <p className="mt-2 font-pixel text-[7px] text-[var(--ll-muted)] sm:mt-3 sm:text-[9px]" aria-hidden>
        Pip the Envelope
      </p>
    </motion.div>
  );
}
