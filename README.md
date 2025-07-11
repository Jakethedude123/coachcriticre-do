# CoachCritic

A platform for connecting fitness coaches with clients, featuring:
- Coach profiles and verification.
- Subscription-based coaching packages
- Market insights and analytics
- Client reviews and ratings
- Stripe integration for payments
- Firebase backend
- Next.js 14 with App Router
- TypeScript and Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `REPLICATE_API_KEY`
- `DEEPGRAM_API_KEY`

<!-- Trigger redeploy: $(date) -->

// Triggering redeploy on Vercel
