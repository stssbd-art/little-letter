"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out",
          open && "translate-y-[7px] rotate-45"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out",
          open && "scale-x-0 opacity-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out",
          open && "-translate-y-[7px] -rotate-45"
        )}
      />
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { muted, toggleMute, play } = useSound();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-[var(--ll-ink)]/25 backdrop-blur-[2px] md:hidden"
              aria-label="Close menu"
              onClick={() => {
                play("click");
                closeMenu();
              }}
            />
            <motion.nav
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "fixed inset-y-0 right-0 z-[70] flex h-dvh max-h-dvh w-[min(100%,20rem)] flex-col",
                "border-l-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]",
                "pb-[env(safe-area-inset-bottom)] shadow-[-8px_0_24px_rgba(0,0,0,0.12)] md:hidden"
              )}
              aria-label="Mobile"
            >
              <div className="flex shrink-0 items-center justify-between border-b-2 border-[var(--ll-window-border)] px-4 py-3">
                <span className="font-pixel text-[10px] text-[var(--ll-muted)]">
                  Menu
                </span>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ll-lavender)] text-[var(--ll-ink)]"
                  onClick={() => {
                    play("click");
                    closeMenu();
                  }}
                  aria-label="Close menu"
                >
                  <BurgerIcon open />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4">
                {LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        play("click");
                        closeMenu();
                      }}
                      className={cn(
                        "block rounded-xl px-4 py-3 font-display text-base transition",
                        pathname === link.href
                          ? "bg-[var(--ll-pink-soft)] text-[var(--ll-pink-deep)]"
                          : "text-[var(--ll-ink)] hover:bg-white/60 dark:hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="shrink-0 border-t-2 border-[var(--ll-window-border)] p-4">
                <Link
                  href="/create"
                  onClick={() => {
                    play("click");
                    closeMenu();
                  }}
                  className="block"
                >
                  <PixelButton size="md" className="w-full whitespace-normal">
                    💌 Create a letter
                  </PixelButton>
                </Link>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>,
      document.body
    );

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
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </PixelButton>
          <Link href="/create" className="hidden sm:block">
            <PixelButton size="sm">💌 Create</PixelButton>
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ll-lavender)]",
              "bg-white/70 text-[var(--ll-ink)] shadow-[0_3px_0_var(--ll-lavender-shadow)]",
              "transition hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15 md:hidden"
            )}
            onClick={() => {
              play("click");
              setOpen((value) => !value);
            }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {mobileMenu}
    </header>
  );
}
