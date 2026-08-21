"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { useSound } from "@/components/providers/SoundProvider";

export function CookieConsentBanner() {
  const { ready, consent, acceptAll, acceptNecessary } = useCookieConsent();
  const { play } = useSound();
  const reduceMotion = useReducedMotion();
  const show = ready && consent === null;
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!show) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      panel?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? [];

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        acceptNecessary();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const nodes = [...focusables()];
      if (nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [show, acceptNecessary]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          initial={reduceMotion ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div
            ref={panelRef}
            className="mx-auto max-w-3xl rounded-2xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]/95 p-4 shadow-[6px_6px_0_var(--ll-pink-shadow)] backdrop-blur-md sm:p-5"
          >
            <p
              id={titleId}
              className="font-pixel text-[9px] text-[var(--ll-pink-deep)]"
            >
              cookies.ini
            </p>
            <p
              id={descId}
              className="mt-2 font-display text-sm leading-relaxed text-[var(--ll-ink)] sm:text-base"
            >
              We use necessary cookies to run Little Letter (free-send limits,
              theme, sound). Optional cookies help with Analytics, ads, and
              affiliate tracking.{" "}
              <Link
                href="/privacy"
                className="text-[var(--ll-pink-deep)] underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <PixelButton
                size="sm"
                onClick={() => {
                  play("click");
                  acceptAll();
                }}
              >
                Accept all
              </PixelButton>
              <PixelButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  play("click");
                  acceptNecessary();
                }}
              >
                Necessary only
              </PixelButton>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
