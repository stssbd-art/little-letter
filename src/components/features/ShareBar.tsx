"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShareId =
  | "native"
  | "whatsapp"
  | "facebook"
  | "x"
  | "telegram"
  | "linkedin"
  | "reddit"
  | "email"
  | "copy";

type ShareTarget = {
  id: ShareId;
  label: string;
  href?: string;
  onClick?: () => void;
};

type ShareBarProps = {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
  compact?: boolean;
};

function Icon({
  children,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function ShareIcon({ id, copied }: { id: ShareId; copied?: boolean }) {
  switch (id) {
    case "native":
      return (
        <Icon>
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
        </Icon>
      );
    case "whatsapp":
      return (
        <Icon>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.5 2 2.01 6.49 2.01 12.03c0 1.78.47 3.52 1.36 5.05L2 22l5.07-1.33c1.48.81 3.15 1.24 4.97 1.24h.01c5.54 0 10.03-4.49 10.03-10.03C22.08 6.49 17.58 2 12.04 2zm0 18.3c-1.61 0-3.19-.43-4.57-1.25l-.33-.2-3.28.86.88-3.2-.21-.33A8.27 8.27 0 0 1 3.74 12c0-4.58 3.73-8.3 8.3-8.3 4.58 0 8.3 3.72 8.3 8.3 0 4.57-3.72 8.3-8.3 8.3z" />
        </Icon>
      );
    case "facebook":
      return (
        <Icon>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" />
        </Icon>
      );
    case "x":
      return (
        <Icon>
          <path d="M18.24 2H21.5l-7.19 8.22L22.5 22h-6.56l-5.14-6.72L5.2 22H1.93l7.69-8.79L1.5 2h6.72l4.64 6.16L18.24 2zm-1.15 18h1.81L7.01 3.9H5.07L17.09 20z" />
        </Icon>
      );
    case "telegram":
      return (
        <Icon>
          <path d="M9.78 15.34 9.5 19.1c.39 0 .56-.17.76-.37l1.83-1.75 3.79 2.79c.7.39 1.19.18 1.38-.64l2.5-11.77c.23-1.02-.37-1.42-1.04-1.17L3.9 10.3c-.99.39-.98.94-.17 1.19l3.99 1.25 9.27-5.84c.44-.27.84-.12.51.17l-7.72 7.27z" />
        </Icon>
      );
    case "linkedin":
      return (
        <Icon>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
        </Icon>
      );
    case "reddit":
      return (
        <Icon>
          <path d="M14.24 15.53a1.12 1.12 0 1 1-1.12-1.12 1.12 1.12 0 0 1 1.12 1.12zm-3.36 0a1.12 1.12 0 1 1-1.12-1.12 1.12 1.12 0 0 1 1.12 1.12zm8.2-3.2a1.74 1.74 0 0 0-1.22.5 8.5 8.5 0 0 0-4.55-1.4l.77-3.63 2.52.53a1.27 1.27 0 1 0 .13-.65l-2.82-.6a.45.45 0 0 0-.52.35l-.87 4.1a8.6 8.6 0 0 0-4.66 1.4 1.74 1.74 0 1 0-1.9 2.85 3.5 3.5 0 0 0-.1.83c0 2.56 2.98 4.64 6.65 4.64s6.65-2.08 6.65-4.64a3.5 3.5 0 0 0-.1-.82 1.74 1.74 0 0 0 .52-3.35zm-8.76 5.4c-1.55 0-2.64-.72-2.64-1.3s1.09-1.3 2.64-1.3 2.64.72 2.64 1.3-1.09 1.3-2.64 1.3zm4.56 0c-1.55 0-2.64-.72-2.64-1.3s1.09-1.3 2.64-1.3 2.64.72 2.64 1.3-1.09 1.3-2.64 1.3z" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18.2A8.2 8.2 0 1 1 20.2 12 8.21 8.21 0 0 1 12 20.2z" />
        </Icon>
      );
    case "email":
      return (
        <Icon>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
        </Icon>
      );
    case "copy":
      return copied ? (
        <Icon>
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </Icon>
      ) : (
        <Icon>
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </Icon>
      );
    default:
      return null;
  }
}

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
    setCanNative(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
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
    [pageUrl, title, text, canNative]
  );

  const buttonClass = cn(
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ll-lavender)]",
    "bg-[#fffbf2]/90 text-[var(--ll-ink)]",
    "shadow-[2px_2px_0_var(--ll-lavender-shadow)] transition hover:-translate-y-0.5",
    "hover:border-[var(--ll-pink-deep)] hover:text-[var(--ll-pink-deep)]",
    "dark:bg-white/10 dark:text-[#f5ecd9]"
  );

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3", className)}>
      <p className="font-display text-sm text-[var(--ll-ink)]">
        {compact ? "Share Little Letter" : "Share"}
      </p>
      <div className="flex flex-wrap gap-2">
        {targets.map((target) =>
          target.href ? (
            <a
              key={target.id}
              href={target.href}
              target={target.id === "email" ? undefined : "_blank"}
              rel={target.id === "email" ? undefined : "noreferrer noopener"}
              className={buttonClass}
              aria-label={target.label}
              title={target.label}
            >
              <ShareIcon id={target.id} />
            </a>
          ) : (
            <button
              key={target.id}
              type="button"
              onClick={target.onClick}
              className={buttonClass}
              aria-label={
                target.id === "copy" && copied ? "Link copied" : target.label
              }
              title={
                target.id === "copy" && copied ? "Copied!" : target.label
              }
            >
              <ShareIcon id={target.id} copied={copied} />
            </button>
          )
        )}
      </div>
    </div>
  );
}
