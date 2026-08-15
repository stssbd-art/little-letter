# Little Letter

Nostalgic, whimsical site for creating and sending cute personal messages and romantic mixtapes.

**Live:** https://sendlittleletter.vercel.app

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
| `RESEND_API_KEY` | Recommended | Resend API key (best with a verified domain) |
| `RESEND_FROM_EMAIL` | With Resend | Must be on a **verified** domain — never `@resend.dev` |
| `GMAIL_USER` | Alternative | Gmail address (App Password SMTP) |
| `GMAIL_APP_PASSWORD` | With Gmail | Google App Password (not your normal password) |
| `GMAIL_FROM_NAME` | No | Your real name (as in Gmail). Leave blank or never set to `Little Letter` |
| `OPENAI_API_KEY` | For AI messages | Falls back to warm local templates if missing |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |
| `STRIPE_SECRET_KEY` | For paid sends | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For paid sends | Stripe publishable key |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production URL for SEO + Stripe returns |
| `DEMO_MODE` | No | Set `true` only for free testing (disables charges) |

**Inbox placement:** Prefer Resend + a verified custom domain (SPF, DKIM, DMARC). Shared senders like `onboarding@resend.dev` are blocked because they land in spam. Gmail SMTP is the fallback and can email any address (Google daily limits apply).

**Pricing (public):** first two letters free · then £0.99 · first mixtape free · then £1.25 (1 song) / £1.55 (2+ songs).

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
