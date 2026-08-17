export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="w-full space-y-2 text-left">
      {kicker ? (
        <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-muted)]">
          {kicker}
        </p>
      ) : null}
      <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
        {title}
      </h1>
      {children ? (
        <p className="ll-copy font-display leading-relaxed text-[var(--ll-muted)]">
          {children}
        </p>
      ) : null}
    </header>
  );
}
