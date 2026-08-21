import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/** Private share links + utility pages — keep out of Google’s index. */
const DISALLOW = ["/api/", "/open/", "/mix/", "/preview", "/success"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
