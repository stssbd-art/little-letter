import type { Metadata } from "next";
import { HomePage } from "@/components/features/HomePage";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Send a Letter or Mixtape Online`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Send a Letter or Mixtape Online`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function Page() {
  return <HomePage />;
}
