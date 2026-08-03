"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  as?: "div" | "button";
}

export function PixelCard({
  children,
  className,
  onClick,
  selected,
  as = "div",
}: PixelCardProps) {
  const Comp = as === "button" ? motion.button : motion.div;

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={as === "button" ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 bg-white/80 p-4 text-left backdrop-blur-sm transition-colors dark:bg-white/10",
        selected
          ? "border-[var(--ll-pink-deep)] bg-[var(--ll-pink-soft)] shadow-[0_0_0_3px_var(--ll-pink-glow)]"
          : "border-[var(--ll-lavender)] shadow-[3px_3px_0_var(--ll-lavender-shadow)]",
        className
      )}
    >
      {children}
    </Comp>
  );
}
