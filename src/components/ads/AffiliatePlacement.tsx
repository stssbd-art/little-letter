"use client";

import { usePathname } from "next/navigation";
import { AffiliateBanner } from "@/components/ads/AffiliateBanner";
import { AffiliateSideSlide } from "@/components/ads/AffiliateSideSlide";

/**
 * Sponsored placements only on tool / home surfaces — not on thin SEO,
 * legal, or editorial pages where ads:content ratio looks poor to reviewers.
 */
function showAffiliates(pathname: string | null) {
  if (!pathname) return false;
  if (pathname === "/") return true;
  if (pathname.startsWith("/create")) return true;
  if (pathname.startsWith("/cards")) return true;
  if (pathname.startsWith("/mixtape")) return true;
  if (pathname.startsWith("/success")) return true;
  return false;
}

export function AffiliatePlacement() {
  const pathname = usePathname();
  if (!showAffiliates(pathname)) return null;
  return (
    <>
      <AffiliateBanner />
      <AffiliateSideSlide />
    </>
  );
}
