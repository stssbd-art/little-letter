/** Visible maintenance dates for legal/content pages (ISO date strings). */
export const CONTENT_UPDATED = {
  site: "2026-09-19",
  about: "2026-09-19",
  faq: "2026-09-19",
  privacy: "2026-09-03",
  terms: "2026-08-20",
  paperless: "2026-09-19",
  guides: "2026-09-19",
} as const;

export function formatContentDate(iso: string) {
  const d = new Date(`${iso}T12:00:00.000Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
