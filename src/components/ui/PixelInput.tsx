"use client";

import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block font-display text-sm text-[var(--ll-ink)]"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-[var(--ll-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-[var(--ll-lavender)] bg-white/90 px-3 py-2.5 text-sm text-[var(--ll-ink)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition focus:border-[var(--ll-pink-deep)] focus:ring-2 focus:ring-[var(--ll-pink-glow)] dark:bg-white/10";

export function PixelInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function PixelSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

export function PixelTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(inputClass, "min-h-[110px] resize-y", props.className)}
    />
  );
}
