"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { useSound } from "@/components/providers/SoundProvider";

export function CookieSettingsButton() {
  const { ready, resetConsent } = useCookieConsent();
  const { play } = useSound();

  if (!ready) return null;

  return (
    <button
      type="button"
      className="underline decoration-dotted underline-offset-2 hover:text-[var(--ll-pink-deep)]"
      onClick={() => {
        play("click");
        resetConsent();
      }}
    >
      Cookie settings
    </button>
  );
}
