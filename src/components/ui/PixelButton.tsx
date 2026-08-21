"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

interface PixelButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tape" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function PixelButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled,
  ...props
}: PixelButtonProps) {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();

  const variants = {
    primary:
      "bg-[linear-gradient(to_bottom,var(--ll-btn-from),var(--ll-btn-to))] text-[var(--ll-btn-text)] border-[var(--ll-btn-to)] shadow-[0_4px_0_var(--ll-pink-shadow)] [text-shadow:0_1px_0_rgba(61,47,34,0.35)]",
    secondary:
      "bg-[linear-gradient(to_bottom,var(--ll-btn-mint-from),var(--ll-btn-mint-to))] text-[var(--ll-btn-mint-text)] border-[var(--ll-btn-mint-to)] shadow-[0_4px_0_var(--ll-mint-shadow)] [text-shadow:0_1px_0_rgba(47,58,30,0.4)]",
    tape:
      "bg-[linear-gradient(to_bottom,var(--ll-btn-tape-from),var(--ll-btn-tape-to))] text-[var(--ll-btn-tape-text)] border-[var(--ll-btn-tape-to)] shadow-[0_4px_0_var(--ll-tape-shadow)] [text-shadow:0_1px_0_rgba(61,40,36,0.35)]",
    ghost:
      "bg-white/70 dark:bg-white/10 text-[var(--ll-ink)] border-[var(--ll-lavender)] shadow-[0_3px_0_var(--ll-lavender-shadow)]",
    danger:
      "bg-gradient-to-b from-orange-300 to-orange-400 text-white border-orange-500 shadow-[0_4px_0_#c2410c]",
  };

  const sizes = {
    sm: "min-h-11 min-w-11 px-3 py-2 text-xs",
    md: "min-h-11 px-5 py-2.5 text-sm",
    lg: "min-h-12 px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      type={type}
      whileHover={
        disabled || reduceMotion ? undefined : { y: -2, scale: 1.03 }
      }
      whileTap={
        disabled || reduceMotion ? undefined : { y: 2, scale: 0.97 }
      }
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border-2 font-display tracking-wide",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ll-lavender-deep)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) play("click");
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
