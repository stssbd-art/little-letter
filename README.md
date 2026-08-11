# Little Letter

Nostalgic, whimsical site for creating and sending cute personal messages and romantic mixtapes.

**Live:** https://little-letter-sage.vercel.app

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Framer Motion
- OpenAI API (message generation)
- Gmail SMTP / Resend (email delivery)
- Stripe (paid sends after free allowance)
- YouTube embeds (original mixtape songs)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Description |
|---|---|---|
| `GMAIL_USER` | For sending | Your Gmail address |
| `GMAIL_APP_PASSWORD` | For sending | Google App Password (not your normal password) |
| `GMAIL_FROM_NAME` | No | Defaults to `Little Letter` |
| `OPENAI_API_KEY` | For AI messages | Falls back to warm local templates if missing |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |
| `STRIPE_SECRET_KEY` | For paid sends | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For paid sends | Stripe publishable key |
| `RESEND_API_KEY` | Optional | Use later with a verified custom domain |
| `RESEND_FROM_EMAIL` | No | Defaults to Resend onboarding sender |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production URL for SEO + Stripe returns |
| `DEMO_MODE` | No | Set `true` only for free testing (disables charges) |

Gmail SMTP is preferred when configured — it can email any address (Google daily limits apply).

**Pricing (public):** first letter free · first two mixtapes free · then £0.50 per extra send via Stripe.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — ESLint

## Pages

- `/` Home
- `/about` About
- `/create` Message creator
- `/preview` Letter preview + send
- `/mixtape` Cassette mixtape builder
- `/mix/[code]` Playable mixtape
- `/success` Celebration
- `/faq` FAQ

## Notes

Guestbook data is stored in `.data/guestbook.json` (created at runtime).
