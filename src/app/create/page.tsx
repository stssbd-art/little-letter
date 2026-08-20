import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageForm } from "@/components/features/MessageForm";
import {
  CreatePageCardsRailDesktop,
  CreatePageCardsRailMobile,
} from "@/components/features/CreatePageCardsRail";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Create & Send a Birthday Card or Letter Online",
  description:
    "Create a digital birthday card, occasion wish, or personal letter and email it to someone you care about. First two letters free, then £0.99.",
  alternates: { canonical: "/create" },
  keywords: [
    "birthday card online",
    "create digital card",
    "send wish by email",
    "email a love letter",
    "personal letter generator",
  ],
};

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Create a Little Letter">
        Birthday cards, thank you notes, love letters, and more — write it
        yourself or get help. Prefer a flip-open illustrated e-card? Browse the
        designs beside the form. First two free, then £0.99 each.
      </PageHeader>

      {/* Sideways scroll of e-cards — visible above the form on small screens */}
      <div className="lg:hidden">
        <CreatePageCardsRailMobile />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Suspense
          fallback={
            <p className="text-left text-sm text-[var(--ll-muted)]">
              Loading form…
            </p>
          }
        >
          <MessageForm />
        </Suspense>

        <div className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-4">
          <CreatePageCardsRailDesktop />
        </div>
      </div>
    </div>
  );
}
