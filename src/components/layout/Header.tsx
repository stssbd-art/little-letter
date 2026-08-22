"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { PixelButton } from "@/components/ui/PixelButton";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/create", label: "Letter" },
  { href: "/cards", label: "Cards" },
  { href: "/mixtape", label: "Mixtape" },
  { href: "/wall", label: "The Wall" },
  { href: "/paperless", label: "Planet" },
  { href: "/faq", label: "FAQ" },
];

function linkIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/create") {
    return (
      pathname === "/create" ||
      pathname === "/preview" ||
      pathname.startsWith("/preview/")
    );
  }
  if (href === "/cards") {
    return pathname === "/cards" || pathname.startsWith("/cards/");
  }
  if (href === "/mixtape") {
    return (
      pathname === "/mixtape" ||
      pathname.startsWith("/mixtape/") ||
      pathname.startsWith("/mix/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusables = [
        ...drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ];
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
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
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-[var(--ll-ink)]/25 backdrop-blur-[2px] md:hidden"
              aria-label="Close menu"
              onClick={() => {
                play("click");
                closeMenu();
              }}
            />
            <motion.nav
              ref={drawerRef}
              id="mobile-menu"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "fixed inset-y-0 right-0 z-[70] flex h-dvh max-h-dvh w-[min(100%,20rem)] flex-col",
                "border-l-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]",
                "pb-[env(safe-area-inset-bottom)] shadow-[-8px_0_24px_rgba(0,0,0,0.12)] md:hidden"
              )}
              aria-label="Site"
            >
              <div className="flex shrink-0 items-center justify-between border-b-2 border-[var(--ll-window-border)] px-4 py-3">
                <span className="font-pixel text-[10px] text-[var(--ll-muted)]">
                  Menu
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[var(--ll-lavender)] text-[var(--ll-ink)]"
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
                {LINKS.map((link) => {
                  const active = linkIsActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        play("click");
                        closeMenu();
                      }}
                      className={cn(
                        "block rounded-xl px-4 py-3 font-display text-base transition",
                        active
                          ? "bg-[var(--ll-pink-soft)] text-[var(--ll-pink-deep)]"
                          : "text-[var(--ll-ink)] hover:bg-white/60 dark:hover:bg-white/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
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
                    ✉️ Create a letter
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0 shrink">
          <Logo size="sm" />
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => {
            const active = linkIsActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => play("click")}
                className={cn(
                  "rounded-md px-3 py-2 font-display text-sm transition",
                  active
                    ? "bg-[var(--ll-pink-soft)] text-[var(--ll-pink-deep)]"
                    : "text-[var(--ll-ink)] hover:bg-white/60 dark:hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <PixelButton
            size="sm"
            variant="ghost"
            className="!min-h-9 !min-w-9 !px-0 !py-0 text-base sm:!min-h-10 sm:!min-w-10"
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
            className="!min-h-9 !min-w-9 !px-0 !py-0 text-base sm:!min-h-10 sm:!min-w-10"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </PixelButton>
          <button
            ref={menuButtonRef}
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--ll-lavender)] sm:h-10 sm:w-10",
              "bg-white/70 text-[var(--ll-ink)] shadow-[0_3px_0_var(--ll-lavender-shadow)]",
              "transition hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15 md:hidden"
            )}
            onClick={() => {
              play("click");
              setOpen((value) => !value);
            }}
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
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
