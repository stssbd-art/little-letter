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
        "overflow-hidden rounded-xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),5px_6px_0_var(--ll-window-shadow)] dark:shadow-[5px_6px_0_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b-2 border-[var(--ll-window-border)] bg-gradient-to-b from-[#d8cdb6] to-[#c4b594] px-3 py-2 dark:from-[#3a2f22] dark:to-[#241c14]">
        <span className="text-sm" aria-hidden>
          {icon}
        </span>
        <h2 className="flex-1 font-pixel text-[10px] leading-relaxed tracking-wide text-[#3d2f22] dark:text-[#f5ecd9] sm:text-[11px]">
          {title}
        </h2>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-sm border border-[#8a7a62]/50 bg-[#c5d4a0]" />
          <span className="h-3 w-3 rounded-sm border border-[#8a7a62]/50 bg-[#ffe8a3]" />
          <span className="h-3 w-3 rounded-sm border border-[#8a7a62]/50 bg-[#c4a574]" />
        </div>
      </header>
      <div className="p-4 text-left sm:p-6 [&_p:not(.font-pixel)]:text-justify [&_p:not(.font-pixel)]:[text-justify:inter-word] [&_p:not(.font-pixel)]:hyphens-auto">
        {children}
      </div>
    </motion.section>
  );
}
