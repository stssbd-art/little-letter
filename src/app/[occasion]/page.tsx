import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccasionLanding } from "@/components/features/OccasionLanding";
import {
  getOccasionSeo,
  OCCASION_SEO_LIST,
} from "@/lib/occasion-seo";

type Props = {
  params: Promise<{ occasion: string }>;
};

export function generateStaticParams() {
  return OCCASION_SEO_LIST.map(({ slug }) => ({ occasion: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { occasion: slug } = await params;
  const data = getOccasionSeo(slug);
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: `/${data.slug}` },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url: `/${data.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.metaDescription,
    },
  };
}

export default async function OccasionPage({ params }: Props) {
  const { occasion: slug } = await params;
  const data = getOccasionSeo(slug);
  if (!data) notFound();

  return <OccasionLanding occasion={data} />;
}
