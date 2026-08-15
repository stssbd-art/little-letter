"use client";

import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
};

export function TermsAcceptance({
  checked,
  onChange,
  id = "accept-terms",
}: Props) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/50 px-3 py-3 dark:bg-white/5"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 accent-[#8b5e34]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
      />
      <span className="min-w-0 text-sm leading-relaxed text-[var(--ll-muted)]">
        <span className="font-display text-[var(--ll-ink)]">
          I agree to the{" "}
          <Link
            href="/terms"
            target="_blank"
            className="text-[var(--ll-pink-deep)] underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Terms
          </Link>
          ,{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-[var(--ll-pink-deep)] underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </Link>
          , and{" "}
          <Link
            href="/terms#refunds"
            target="_blank"
            className="text-[var(--ll-pink-deep)] underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Refund Policy
          </Link>
          .
        </span>
        <span className="mt-1 block text-xs">
          Once the email has been sent, payments are non-refundable.
        </span>
      </span>
    </label>
  );
}
