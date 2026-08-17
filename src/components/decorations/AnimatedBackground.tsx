export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 crt-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 mp3-bezel opacity-40 dark:opacity-25"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
      <div className="sun-glitter" aria-hidden>
        <span className="sun-glitter-glow" />
        <span className="sun-glitter-core">☀️</span>
      </div>
      <div className="sun-catchers" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className={`sun-catcher sun-catcher-${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
