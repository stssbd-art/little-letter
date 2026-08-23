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
    <header className="w-full space-y-1.5 text-left sm:space-y-2">
      {kicker ? (
        <p className="font-pixel text-[7px] tracking-widest text-[var(--ll-muted)] sm:text-[9px]">
          {kicker}
        </p>
      ) : null}
      <h1 className="font-pixel text-[11px] leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
        {title}
      </h1>
      {children ? (
        <div className="font-display text-sm leading-relaxed text-[var(--ll-muted)] sm:text-base">
          {children}
        </div>
      ) : null}
    </header>
  );
}
