# Little Letter

Nostalgic, whimsical site for creating and sending cute personal messages.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Framer Motion
- OpenAI API (message generation)
- Resend (email delivery)

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
| `GMAIL_USER` | For free sending | Your Gmail address |
| `GMAIL_APP_PASSWORD` | For free sending | Google App Password (not your normal password) |
| `GMAIL_FROM_NAME` | No | Defaults to `Little Letter` |
| `OPENAI_API_KEY` | For AI messages | Falls back to warm local templates if missing |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |
| `RESEND_API_KEY` | Optional | Use later with a verified custom domain |
| `RESEND_FROM_EMAIL` | No | Defaults to Resend onboarding sender |
| `NEXT_PUBLIC_SITE_URL` | No | Used for SEO metadata |

Gmail SMTP is preferred when configured — it can email any address for free (Google daily limits apply).

Pricing: first send free, then £0.50 via Stripe (`STRIPE_SECRET_KEY`).

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
- `/success` Celebration
- `/faq` FAQ

## Notes

Guestbook data is stored in `.data/guestbook.json` (created at runtime).
