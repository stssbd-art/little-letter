"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type EndPageAdProps = {
  className?: string;
};

/**
 * One quiet display ad at the end of the page.
 * Renders nothing unless NEXT_PUBLIC_ADSENSE_CLIENT_ID and SLOT are set at build time.
 */
export function EndPageAd({ className }: EndPageAdProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_END?.trim();
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch {
        /* AdSense may be blocked by extensions */
      }
    };

    // Script may load after this component mounts
    const existing = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.adsbygoogle) pushAd();
      else existing.addEventListener("load", pushAd, { once: true });
    }

    const timer = window.setTimeout(pushAd, 1200);
    return () => window.clearTimeout(timer);
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside
      className={cn("relative z-10 mx-auto mt-10 max-w-6xl px-4", className)}
      aria-label="Sponsored"
    >
      <div className="rounded-xl border-2 border-[var(--ll-lavender)]/70 bg-[var(--ll-window-bg)]/70 px-3 py-3">
        <p className="mb-2 text-center font-pixel text-[7px] tracking-widest text-[var(--ll-muted)]">
          SPONSORED · KEEPS THE SITE RUNNING
        </p>
        <ins
          className="adsbygoogle block min-h-[90px] w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
