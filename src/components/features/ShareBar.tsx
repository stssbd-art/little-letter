"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShareTarget = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

type ShareBarProps = {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
  /** Compact row for footer; default is a labelled panel */
  compact?: boolean;
};

function buildTargets(opts: {
  url: string;
  title: string;
  text: string;
  onCopy: () => void;
  onNative?: () => void;
  canNative: boolean;
}): ShareTarget[] {
  const encodedUrl = encodeURIComponent(opts.url);
  const encodedText = encodeURIComponent(opts.text);
  const encodedTitle = encodeURIComponent(opts.title);
  const mailBody = encodeURIComponent(`${opts.text}\n\n${opts.url}`);

  const targets: ShareTarget[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${opts.text} ${opts.url}`)}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${mailBody}`,
    },
    {
      id: "copy",
      label: "Copy link",
      onClick: opts.onCopy,
    },
  ];

  if (opts.canNative && opts.onNative) {
    targets.unshift({
      id: "native",
      label: "Share",
      onClick: opts.onNative,
    });
  }

  return targets;
}

export function ShareBar({
  url,
  title = SITE_NAME,
  text = SITE_TAGLINE,
  className,
  compact = false,
}: ShareBarProps) {
  const [pageUrl, setPageUrl] = useState(url || SITE_URL);
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setPageUrl(window.location.href);
    } else if (url) {
      setPageUrl(url);
    }
    setCanNative(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", pageUrl);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title,
        text,
        url: pageUrl,
      });
    } catch {
      /* user cancelled */
    }
  }

  const targets = useMemo(
    () =>
      buildTargets({
        url: pageUrl,
        title,
        text,
        onCopy: () => void copyLink(),
        onNative: () => void nativeShare(),
        canNative,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageUrl, title, text, canNative, copied]
  );

  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-lg border-2 border-[var(--ll-lavender)]",
    "bg-[#fffbf2]/90 px-2.5 py-1.5 font-pixel text-[8px] leading-none text-[var(--ll-ink)]",
    "shadow-[2px_2px_0_var(--ll-lavender-shadow)] transition hover:-translate-y-0.5",
    "hover:border-[var(--ll-pink-deep)] hover:text-[var(--ll-pink-deep)]",
    "dark:bg-white/10 dark:text-[#f5ecd9]"
  );

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      {!compact ? (
        <p className="font-display text-sm text-[var(--ll-ink)]">Share</p>
      ) : (
        <p className="font-display text-sm text-[var(--ll-ink)]">Share Little Letter</p>
      )}
      <div className="flex flex-wrap gap-2">
        {targets.map((target) =>
          target.href ? (
            <a
              key={target.id}
              href={target.href}
              target={target.id === "email" ? undefined : "_blank"}
              rel={target.id === "email" ? undefined : "noreferrer noopener"}
              className={buttonClass}
            >
              {target.label}
            </a>
          ) : (
            <button
              key={target.id}
              type="button"
              onClick={target.onClick}
              className={buttonClass}
            >
              {target.id === "copy" && copied ? "Copied!" : target.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
