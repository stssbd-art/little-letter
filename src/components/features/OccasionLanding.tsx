import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { OccasionSeo } from "@/lib/occasion-seo";
import { OCCASION_SEO_LIST } from "@/lib/occasion-seo";
import { SITE_URL } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";

type Props = {
  occasion: OccasionSeo;
};

export function OccasionLanding({ occasion }: Props) {
  const others = OCCASION_SEO_LIST.filter((o) => o.slug !== occasion.slug).slice(
    0,
    6
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: occasion.title,
    description: occasion.metaDescription,
    url: `${SITE_URL}/${occasion.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Little Letter",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: `${occasion.label} card and wish by email`,
    },
  };

  const faqJsonLd =
    occasion.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: occasion.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="space-y-3 text-left">
        <p className="text-4xl" aria-hidden>
          {occasion.emoji}
        </p>
        <PageHeader title={occasion.h1}>{occasion.tagline}</PageHeader>
      </div>

      <PixelWindow title={`${occasion.slug}_card.txt`} icon={occasion.emoji}>
        <div className="space-y-4 font-display text-base leading-relaxed text-[var(--ll-ink)]">
          <p>{occasion.intro}</p>
          {occasion.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-[var(--ll-muted)]">
              {paragraph}
            </p>
          ))}
          <p className="text-sm text-[var(--ll-muted)]">
            Little Letter sends a <strong>digital email letter</strong>, not a
            printed greeting card — but it arrives with the same warmth and
            personal touch.
          </p>
        </div>
      </PixelWindow>

      {occasion.exampleWishes.length > 0 ? (
        <PixelWindow title="example_wishes.txt" icon="✨">
          <ul className="space-y-3 text-sm leading-relaxed text-[var(--ll-muted)]">
            {occasion.exampleWishes.map((wish) => (
              <li
                key={wish.slice(0, 32)}
                className="rounded-xl border border-[var(--ll-lavender)] bg-white/50 px-3 py-2 dark:bg-white/5"
              >
                &ldquo;{wish}&rdquo;
              </li>
            ))}
          </ul>
        </PixelWindow>
      ) : null}

      {occasion.faq.length > 0 ? (
        <PixelWindow title="faq.txt" icon="❓">
          <dl className="space-y-4">
            {occasion.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-display text-sm text-[var(--ll-ink)]">
                  {item.q}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--ll-muted)]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </PixelWindow>
      ) : null}

      <div className="flex flex-wrap justify-start gap-3">
        <Link href={`/create?occasion=${occasion.slug}`}>
          <PixelButton size="lg">
            {occasion.emoji} Create this {occasion.label.toLowerCase()} letter
          </PixelButton>
        </Link>
        <Link href="/occasions">
          <PixelButton variant="ghost">All occasions</PixelButton>
        </Link>
      </div>

      <section className="rounded-2xl border-2 border-[var(--ll-lavender)] bg-white/40 p-5 dark:bg-white/5">
        <h2 className="font-pixel text-[10px] text-[var(--ll-pink-deep)]">
          More cards & wishes
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${o.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--ll-lavender)] bg-white/70 px-3 py-1 text-xs text-[var(--ll-ink)] hover:border-[var(--ll-pink-deep)] dark:bg-white/10"
              >
                <span aria-hidden>{o.emoji}</span>
                {o.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/occasions"
              className="inline-flex items-center rounded-full border border-dashed border-[var(--ll-lavender)] px-3 py-1 text-xs text-[var(--ll-muted)] hover:text-[var(--ll-pink-deep)]"
            >
              View all →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
