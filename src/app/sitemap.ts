import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/create", "/preview", "/success", "/faq"];
  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/create" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
