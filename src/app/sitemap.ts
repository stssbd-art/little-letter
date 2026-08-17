import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { OCCASION_SEO_LIST } from "@/lib/occasion-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/occasions", priority: 0.95, changeFrequency: "weekly" },
    { path: "/create", priority: 0.95, changeFrequency: "weekly" },
    { path: "/mixtape", priority: 0.95, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
    ...OCCASION_SEO_LIST.map((o) => ({
      path: `/${o.slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
