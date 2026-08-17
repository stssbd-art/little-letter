"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { PixelButton } from "@/components/ui/PixelButton";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/create", label: "Create" },
  { href: "/mixtape", label: "Mixtape" },
  { href: "/occasions", label: "Occasions" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { muted, toggleMute, play } = useSound();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Logo size="sm" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => play("click")}
              className={cn(
                "rounded-md px-3 py-1.5 font-display text-sm transition",
                pathname === link.href
                  ? "bg-[var(--ll-pink-soft)] text-[var(--ll-pink-deep)]"
                  : "text-[var(--ll-ink)] hover:bg-white/60 dark:hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <PixelButton
            size="sm"
            variant="ghost"
            onClick={() => {
              toggleMute();
              if (muted) play("click");
            }}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </PixelButton>
          <PixelButton
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </PixelButton>
          <Link href="/create" className="hidden sm:block">
            <PixelButton size="sm">💌 Create</PixelButton>
          </Link>
          <button
            type="button"
            className="rounded-lg border-2 border-[var(--ll-lavender)] px-2 py-1 font-pixel text-[10px] md:hidden"
            onClick={() => {
              play("click");
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-[var(--ll-window-border)] md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    play("click");
                    setOpen(false);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-2 font-display text-sm",
                    pathname === link.href
                      ? "bg-[var(--ll-pink-soft)] text-[var(--ll-pink-deep)]"
                      : "text-[var(--ll-ink)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
