"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

interface PixelButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
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

  const variants = {
    primary:
      "bg-gradient-to-b from-[var(--ll-pink)] to-[var(--ll-pink-deep)] text-white border-[var(--ll-pink-deep)] shadow-[0_4px_0_var(--ll-pink-shadow)]",
    secondary:
      "bg-gradient-to-b from-[var(--ll-mint)] to-[var(--ll-mint-deep)] text-white border-[var(--ll-mint-deep)] shadow-[0_4px_0_var(--ll-mint-shadow)]",
    ghost:
      "bg-white/70 dark:bg-white/10 text-[var(--ll-ink)] border-[var(--ll-lavender)] shadow-[0_3px_0_var(--ll-lavender-shadow)]",
    danger:
      "bg-gradient-to-b from-orange-300 to-orange-400 text-white border-orange-500 shadow-[0_4px_0_#c2410c]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { y: -2, scale: 1.03 }}
      whileTap={disabled ? undefined : { y: 2, scale: 0.97 }}
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
