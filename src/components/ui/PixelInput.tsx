"use client";

import { Children, cloneElement, isValidElement, useId } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: FieldProps) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const enhanced = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(
      child as React.ReactElement<Record<string, unknown>>,
      {
        id: htmlFor,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
      }
    );
  });

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block font-display text-sm text-[var(--ll-ink)]"
      >
        {label}
      </label>
      {enhanced}
      {hint ? (
        <p id={hintId} className="text-xs text-[var(--ll-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-[var(--ll-lavender)] bg-white/90 px-3 py-2.5 text-sm text-[var(--ll-ink)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[var(--ll-muted)] focus:border-[var(--ll-pink-deep)] focus:ring-2 focus:ring-[var(--ll-pink-glow)] dark:bg-[#2a2118] dark:text-[#fff8ee]";

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
