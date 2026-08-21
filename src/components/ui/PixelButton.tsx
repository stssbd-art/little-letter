"use client";

import Link from "next/link";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

type CommonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<HTMLMotionProps<"button">, "children" | "href"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  title?: string;
};

export type PixelButtonProps = ButtonAsButton | ButtonAsLink;

export function PixelButton(props: PixelButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    disabled,
  } = props;
  const { play } = useSound();
  const reduceMotion = useReducedMotion();

  const variants = {
    primary:
      "bg-gradient-to-b from-[var(--ll-btn-from)] to-[var(--ll-btn-to)] text-[var(--ll-btn-text)] border-[var(--ll-btn-to)] shadow-[0_4px_0_var(--ll-pink-shadow)]",
    secondary:
      "bg-gradient-to-b from-[var(--ll-btn-mint-from)] to-[var(--ll-btn-mint-to)] text-[var(--ll-btn-mint-text)] border-[var(--ll-btn-mint-to)] shadow-[0_4px_0_var(--ll-mint-shadow)]",
    ghost:
      "bg-white/70 dark:bg-white/10 text-[var(--ll-ink)] border-[var(--ll-lavender)] shadow-[0_3px_0_var(--ll-lavender-shadow)]",
    danger:
      "bg-gradient-to-b from-orange-300 to-orange-400 text-[#3d2f22] border-orange-500 shadow-[0_4px_0_#c2410c]",
  };

  const sizes = {
    sm: "min-h-11 min-w-11 px-3 py-2 text-xs",
    md: "min-h-11 px-5 py-2.5 text-sm",
    lg: "min-h-12 px-7 py-3.5 text-base",
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 font-display tracking-wide no-underline",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ll-lavender-deep)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    variants[variant],
    sizes[size],
    className
  );

  const motionProps = reduceMotion
    ? {}
    : {
        whileHover: disabled ? undefined : { y: -2, scale: 1.03 },
        whileTap: disabled ? undefined : { y: 2, scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 500, damping: 18 },
      };

  if ("href" in props && props.href) {
    const { href, onClick, target, rel, ...rest } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-label={rest["aria-label"]}
        title={rest.title}
        className={cn(classes, disabled && "pointer-events-none opacity-50")}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          play("click");
          onClick?.(e);
        }}
      >
        {children}
      </Link>
    );
  }

  const {
    onClick,
    type = "button",
    href: _h,
    ...buttonProps
  } = props as ButtonAsButton;

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) play("click");
        onClick?.(e);
      }}
      {...motionProps}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
