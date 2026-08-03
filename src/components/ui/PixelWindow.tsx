"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PixelWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
  liftOnHover?: boolean;
}

export function PixelWindow({
  title,
  children,
  className,
  icon = "💌",
  liftOnHover = true,
}: PixelWindowProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={liftOnHover ? { y: -4 } : undefined}
      transition={{ duration: 0.35 }}
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]",
        "shadow-[6px_6px_0_var(--ll-window-shadow)] dark:shadow-[6px_6px_0_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b-2 border-[var(--ll-window-border)] bg-gradient-to-r from-[var(--ll-title-from)] via-[var(--ll-title-via)] to-[var(--ll-title-to)] px-3 py-2">
        <span className="text-sm" aria-hidden>
          {icon}
        </span>
        <h2 className="flex-1 font-pixel text-[10px] leading-relaxed tracking-wide text-white sm:text-[11px]">
          {title}
        </h2>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-sm border border-white/40 bg-[#86efac]" />
          <span className="h-3 w-3 rounded-sm border border-white/40 bg-[#fde68a]" />
          <span className="h-3 w-3 rounded-sm border border-white/40 bg-[#fda4af]" />
        </div>
      </header>
      <div className="p-4 sm:p-6">{children}</div>
    </motion.section>
  );
}
