import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageForm } from "@/components/features/MessageForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Create & Send a Birthday Card or Letter Online",
  description:
    "A few words can mean so much. Write a heartfelt thank-you or love letter — yourself or with help. Letters are free to send. Add a spoken voice note.",
  alternates: { canonical: "/create" },
  keywords: [
    "birthday card online",
    "create digital card",
    "send wish by email",
    "email a love letter",
    "personal letter generator",
  ],
  openGraph: {
    title: "Create & Send a Letter Online — Little Letter",
    description:
      "Write a heartfelt birthday card, thank-you, or love letter and email it. First two letters free.",
    url: "/create",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Create a Little Letter — send a personal letter by email",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create & Send a Letter Online — Little Letter",
    description:
      "Write a heartfelt birthday card, thank-you, or love letter and email it. First two letters free.",
    images: ["/opengraph-image"],
  },
};

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Create a Little Letter">
        <p className="text-[var(--ll-ink)]">A few words can mean so much.</p>
        <p className="mt-2">
          Write a heartfelt birthday card, a sweet thank-you, a love letter, or
          simply something to brighten their day. Write it yourself or let us
          help you find the perfect words.
        </p>
        <ul className="mt-3 space-y-1.5 text-[var(--ll-ink)]">
          <li>
            ✨ Letters are completely free to send — no limit.
          </li>
          <li>🎙️ Make it extra special with a personal spoken voice note.</li>
        </ul>
      </PageHeader>
      <Suspense
        fallback={
          <p className="text-left text-sm text-[var(--ll-muted)]">
            Loading form…
          </p>
        }
      >
        <MessageForm />
      </Suspense>
    </div>
  );
}
