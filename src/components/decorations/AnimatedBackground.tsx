"use client";

export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 crt-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 mp3-bezel opacity-40 dark:opacity-25"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
