"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type EndPageAdProps = {
  client: string;
  slot: string;
  className?: string;
};

/**
 * One quiet display ad at the end of the page.
 * Client/slot are passed from the server so Sensitive Vercel env vars still work.
 * Collapses after Google reports unfilled so visitors never see a blank box.
 */
export function EndPageAd({ client, slot, className }: EndPageAdProps) {
  const pushed = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const [adStatus, setAdStatus] = useState<"pending" | "filled" | "unfilled">(
    "pending"
  );

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

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    const sync = () => {
      const fill = el.getAttribute("data-ad-status");
      if (fill === "filled") setAdStatus("filled");
      else if (fill === "unfilled") setAdStatus("unfilled");
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-ad-status", "data-adsbygoogle-status"],
    });
    const polls = [800, 2000, 4000, 8000].map((ms) => window.setTimeout(sync, ms));
    const giveUp = window.setTimeout(() => {
      if (el.getAttribute("data-ad-status") !== "filled") setAdStatus("unfilled");
    }, 6000);

    return () => {
      observer.disconnect();
      polls.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(giveUp);
    };
  }, [client, slot]);

  if (!client || !slot) return null;
  if (adStatus === "unfilled") return null;

  const showChrome = adStatus === "filled";

  return (
    <aside
      className={cn(
        "relative z-10 mx-auto max-w-6xl px-4",
        showChrome ? "mt-10" : "mt-0",
        className
      )}
      aria-label="Sponsored"
      aria-hidden={!showChrome}
    >
      <div
        className={cn(
          showChrome &&
            "rounded-xl border-2 border-[var(--ll-lavender)]/70 bg-[var(--ll-window-bg)]/70 px-3 py-3"
        )}
      >
        {showChrome ? (
          <p className="mb-2 text-center font-pixel text-[7px] tracking-widest text-[var(--ll-muted)]">
            SPONSORED · KEEPS THE SITE RUNNING
          </p>
        ) : null}
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
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
