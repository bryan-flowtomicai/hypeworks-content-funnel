# Hypeworks — A+ Content Generator

AI-powered A+ content generation for Amazon sellers and e-commerce brands.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, TypeScript
- **Auth & Database**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: [fal.ai](https://fal.ai) (FLUX image generation)
- **Payments**: Stripe (subscriptions)
- **Hosting**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_schema.sql` via the SQL editor
3. Enable Google OAuth in Authentication > Providers (optional)
4. Copy your project URL and anon key to `.env.local`

### 4. Set up Stripe

1. Create products and prices in the Stripe dashboard
2. Add your keys to `.env.local`
3. For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Set up fal.ai

1. Create an account at [fal.ai](https://fal.ai)
2. Generate an API key and add it to `.env.local` as `FAL_KEY`

### 6. Run the dev server

```bash
npm run dev
```

## Database Schema

See `supabase/migrations/001_schema.sql` for the full schema including:

- **profiles** — user profiles linked to Supabase Auth
- **projects** — product input data and settings
- **uploaded_assets** — user-uploaded product images
- **generated_images** — AI-generated A+ content images
- **subscriptions** — Stripe subscription state

All tables have RLS enabled. A trigger auto-creates profiles on signup.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/projects` | GET, POST | List / create projects |
| `/api/projects/[id]` | GET, PUT, DELETE | Single project CRUD |
| `/api/projects/[id]/generate` | POST | Trigger fal.ai generation |
| `/api/projects/[id]/images` | GET | List generated images |
| `/api/projects/[id]/scrape` | POST | Scrape product URL |
| `/api/stripe/checkout` | POST | Create Stripe checkout |
| `/api/stripe/portal` | POST | Stripe customer portal |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |
| `/api/user/profile` | GET, PUT | User profile |

## Subscription Tiers

| Feature | Free | Pro ($29/mo) | Agency ($99/mo) |
|---------|------|--------------|-----------------|
| Generations | 5 total | 100/month | Unlimited |
| Projects | 2 | Unlimited | Unlimited |
| Image formats | Standard only | All | All |
| URL scraping | No | Yes | Yes |
| Priority queue | No | No | Yes |
