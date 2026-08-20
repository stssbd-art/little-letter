"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { useSound } from "@/components/providers/SoundProvider";

export function CookieConsentBanner() {
  const { ready, consent, acceptAll, acceptNecessary } = useCookieConsent();
  const { play } = useSound();
  const show = ready && consent === null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          aria-live="polite"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]/95 p-4 shadow-[6px_6px_0_var(--ll-pink-shadow)] backdrop-blur-md sm:p-5">
            <p className="font-pixel text-[9px] text-[var(--ll-pink-deep)]">
              cookies.ini
            </p>
            <p className="mt-2 font-display text-sm leading-relaxed text-[var(--ll-ink)] sm:text-base">
              We use necessary cookies to run Little Letter (free-send limits,
              theme, sound). Optional cookies help with Analytics and ads.{" "}
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
