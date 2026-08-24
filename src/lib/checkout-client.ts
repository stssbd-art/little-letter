/** Client-side checkout helpers — prefetch so Pay feels instant. */

export type CheckoutRequest = {
  returnPath: string;
  kind: "letter" | "card" | "mixtape";
  senderEmail: string;
  trackCount?: number;
};

type CacheEntry = { key: string; url: string; at: number };

const TTL_MS = 20 * 60 * 1000; // Stripe sessions last ~24h; refresh earlier
let cached: CacheEntry | null = null;
let inflight: { key: string; promise: Promise<string> } | null = null;

function cacheKey(req: CheckoutRequest) {
  return [
    req.kind,
    req.returnPath,
    req.senderEmail.trim().toLowerCase(),
    String(req.trackCount ?? 0),
  ].join("|");
}

async function createCheckout(req: CheckoutRequest): Promise<string> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      returnPath: req.returnPath,
      kind: req.kind,
      trackCount: req.trackCount,
      senderEmail: req.senderEmail.trim(),
    }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Could not start payment");
  }
  return data.url;
}

/** Warm a checkout session in the background while the user reads the preview. */
export function prefetchCheckout(req: CheckoutRequest) {
  const email = req.senderEmail?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

  const key = cacheKey(req);
  if (cached && cached.key === key && Date.now() - cached.at < TTL_MS) return;
  if (inflight?.key === key) return;

  const promise = createCheckout(req)
    .then((url) => {
      cached = { key, url, at: Date.now() };
      return url;
    })
    .catch(() => {
      /* Prefetch is best-effort; Pay click will retry. */
      return "";
    })
    .finally(() => {
      if (inflight?.key === key) inflight = null;
    });

  inflight = { key, promise };
}

/** Returns a Stripe Checkout URL, reusing a prefetched session when possible. */
export async function getCheckoutUrl(req: CheckoutRequest): Promise<string> {
  const key = cacheKey(req);
  if (cached && cached.key === key && Date.now() - cached.at < TTL_MS) {
    const url = cached.url;
    cached = null; // one-shot — Stripe URLs should not be reused after open
    return url;
  }

  if (inflight?.key === key) {
    const url = await inflight.promise;
    if (url) {
      cached = null;
      return url;
    }
  }

  const url = await createCheckout(req);
  cached = null;
  return url;
}
