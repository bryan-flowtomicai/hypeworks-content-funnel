# Hypeworks A+ Content Funnel

Lead capture + AI A+ content generator at content.hypeworks.io

## Overview

This is a Next.js 14 application that allows Amazon sellers to generate AI-powered A+ content for their product listings.

**Features:**
- Free first submission (email capture)
- Subsequent submissions behind Stripe paywall
- Multi-step form for product details
- Brand asset upload
- AI-generated A+ content using kie.ai
- User authentication via Supabase
- Stripe integration for payments

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Payments:** Stripe
- **AI:** kie.ai API for image generation
- **Hosting:** Vercel (planned)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── signin/page.tsx   # Sign in page
│   │   └── signup/page.tsx   # Sign up page
│   ├── dashboard/
│   │   ├── page.tsx          # User dashboard
│   │   ├── create/page.tsx   # Multi-step form
│   │   └── submission/[id]/page.tsx  # Submission detail
│   └── layout.tsx            # Root layout
├── components/
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── supabase/            # Supabase clients
│   └── database.types.ts    # TypeScript types
└── styles/
    └── globals.css          # Global styles
```

## Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/bryan-flowtomicai/hypeworks-content-funnel.git
cd hypeworks-content-funnel
npm install
```

### 2. Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zulohdueaxzowwesyeln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

KIE_AI_API_KEY=7a32f8913ba3942a6a65c5b8d57a11be
```

### 3. Database Setup

Run the migration in Supabase SQL Editor:

```sql
-- See supabase/migrations/001_init.sql
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Schema

### users table
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `name` (TEXT)
- `company` (TEXT)
- `website` (TEXT)
- `amazon_store_url` (TEXT)
- `plan` (TEXT: free/pro/enterprise)
- `submission_count` (INT)
- `stripe_customer_id` (TEXT)
- `created_at` (TIMESTAMP)

### submissions table
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `product_url` (TEXT)
- `platform` (TEXT: amazon/ebay/shopify)
- `product_data` (JSONB)
- `brand_assets` (TEXT[])
- `user_inputs` (JSONB)
- `generated_images` (TEXT[])
- `status` (TEXT: pending/processing/completed/failed)
- `created_at` (TIMESTAMP)

## Features Implemented

### Phase 1: Foundation ✅
- [x] Next.js 14 project setup
- [x] Tailwind CSS configuration
- [x] TypeScript setup
- [x] Supabase integration
- [x] Database schema & migrations
- [x] RLS policies

### Phase 2: Auth & UI ✅
- [x] Landing page with hero
- [x] Sign up page (email capture)
- [x] Sign in page
- [x] Dashboard
- [x] Responsive design
- [x] Basic UI components (Button, Input)

### Phase 3: Multi-Step Form ✅
- [x] Step 1: Product information (URL, platform, company)
- [x] Step 2: Brand assets (file upload, colors)
- [x] Step 3: Product description
- [x] Form validation
- [x] Submission creation

### Phase 4: TODO
- [ ] Stripe integration (payment gate)
- [ ] kie.ai integration (image generation)
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Submission detail page
- [ ] Image preview/download
- [ ] Error handling & logging
- [ ] Testing

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

## API Endpoints (To be implemented)

- `POST /api/submissions` - Create submission
- `GET /api/submissions/:id` - Get submission
- `GET /api/submissions` - List user submissions
- `POST /api/generate-content` - Trigger AI generation
- `POST /api/checkout` - Create Stripe session

## Next Steps

1. **Stripe Integration**
   - Set up payment intent API
   - Implement checkout flow
   - Update user plan after payment

2. **kie.ai Integration**
   - Image generation API
   - Async processing queue
   - Result storage

3. **Polish**
   - Email notifications
   - Better error handling
   - Submission detail view
   - Admin dashboard

## Deployment

Deploy to Vercel:

```bash
vercel
```

Or push to GitHub and connect Vercel for automatic deployment.

## Contributing

Work on feature branches and submit PRs.

## License

Proprietary - Hypeworks
