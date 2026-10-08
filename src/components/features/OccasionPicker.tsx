"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type OccasionOption = {
  value: string;
  label: string;
  emoji: string;
  hint?: string;
};

export function OccasionPicker({
  label = "Occasion",
  current,
  options,
  onSelect,
}: {
  label?: string;
  current: OccasionOption;
  options: OccasionOption[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const previous = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open]);

  return (
    <div>
      <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">{label}</p>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-[var(--ll-lavender)] bg-white/70 px-4 py-3 text-left transition hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
      >
        <span className="text-2xl" aria-hidden>
          {current.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base text-[var(--ll-ink)]">
            {current.label}
          </span>
          {current.hint ? (
            <span className="block text-xs text-[var(--ll-muted)]">{current.hint}</span>
          ) : null}
        </span>
        <span className="font-display text-sm text-[var(--ll-pink-deep)]">Change</span>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
              <button
                type="button"
                className="absolute inset-0 bg-[#3d2f22]/45"
                aria-label="Close occasions"
                onClick={() => setOpen(false)}
              />
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className="relative z-10 max-h-[min(88dvh,36rem)] w-full overflow-y-auto rounded-t-2xl border border-[var(--ll-window-border)] bg-[var(--ll-window-bg)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[8px_10px_0_rgba(61,47,34,0.18)] outline-none sm:max-w-lg sm:rounded-2xl sm:p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2
                    id={titleId}
                    className="font-display text-lg text-[var(--ll-ink)]"
                  >
                    Choose an occasion
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-1 font-display text-sm text-[var(--ll-muted)] hover:text-[var(--ll-ink)]"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {options.map((option) => {
                    const selected = option.value === current.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSelect(option.value);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex min-h-11 items-center gap-2 rounded-xl px-3 py-3 text-left transition",
                          selected
                            ? "bg-[#fff6df] text-[var(--ll-ink)] ring-2 ring-[var(--ll-pink-deep)]"
                            : "bg-white/50 text-[var(--ll-ink)] hover:bg-[#fff6df] dark:bg-white/5"
                        )}
                      >
                        <span className="text-xl" aria-hidden>
                          {option.emoji}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-sm leading-tight">
                            {option.label}
                          </span>
                          {option.hint ? (
                            <span className="block text-[11px] text-[var(--ll-muted)]">
                              {option.hint}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
