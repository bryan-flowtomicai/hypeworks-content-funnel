# Hypeworks A+ Content Funnel — Project Brief

## What We're Building
A lead-capture + A+ content generation tool at `content.hypeworks.io`.
Amazon/Shopify/TikTok sellers paste their product URL, upload brand assets, answer questions → get AI-generated A+ content image files ready to upload to Amazon.

**Lead funnel:** First output free (captures email + business info). Subsequent outputs behind a paywall.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (auth, database, storage)
- **Payments:** Stripe
- **Product data:** Rainforest API (Amazon), Shopify JSON endpoints
- **Copy generation:** OpenAI GPT-4o
- **Image generation:** OpenAI DALL-E 3 (primary), kie.ai (secondary)
- **Deployment:** Vercel
- **Repo:** https://github.com/bryan-flowtomicai/hypeworks-content-funnel

## GitHub
- Username: bryan-flowtomicai
- Repo: https://github.com/bryan-flowtomicai/hypeworks-content-funnel

## User Flow
1. Landing page → Sign up (email, name, company, website, Amazon store URL)
2. Step 1: Paste product URL (Amazon/Shopify/TikTok)
3. Step 2: Upload brand assets (logo, colors, lifestyle images)
4. Step 3: Content brief (differentiators, target audience, tone)
5. Step 4: AI generates A+ content modules
6. Step 5: Preview + download image files
7. On next submission → Stripe paywall

## A+ Content Modules to Generate
- Hero / Brand Story banner (970x300px)
- Feature image + benefit callout x3 (300x300px each)
- Comparison chart (600x300px)
- Full-width lifestyle image with layered benefit text (970x300px)
- 4-image feature grid (220x220px each)

## Database Schema (Supabase)
```sql
users: id, email, name, company, website, amazon_store_url, plan, submission_count, stripe_customer_id, created_at
submissions: id, user_id, product_url, platform, product_data (jsonb), brand_assets (text[]), user_inputs (jsonb), generated_images (text[]), status, created_at
```

## Build Order
1. Next.js project init + Tailwind + shadcn/ui
2. Supabase client setup + schema migration
3. Landing page + signup form (Supabase auth)
4. Multi-step submission flow UI
5. Product scraper (Amazon via Rainforest API, Shopify JSON)
6. Copy generation (GPT-4o prompt chain)
7. Image generation (DALL-E 3)
8. Output preview + file download
9. Stripe paywall (free first, paid after)
10. Deploy to Vercel + configure content.hypeworks.io subdomain

## Env Vars Needed
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- RAINFOREST_API_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET

## Style / Brand
- Match hypeworks.io aesthetic
- Primary color: #FF7A50 (orange from Hypeworks site meta)
- Font: Clean, modern sans-serif
- Tone: Professional, results-focused ("Amazon Growth. Engineered.")
