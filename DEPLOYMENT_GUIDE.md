# Deployment Checklist

## Environment Variables Required

Before deploying to Vercel, ensure all environment variables are set:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon API key

### Stripe (Payment Processing)
- `STRIPE_PUBLISHABLE_KEY` - Public key for client-side
- `STRIPE_SECRET_KEY` - Secret key (keep safe!)

### Firecrawl (Web Scraping)
- `FIRECRAWL_API_KEY` - API key from firecrawl.dev (free tier available)

### kie.ai (Image Generation)
- `KIE_API_KEY` - API key: 7a32f8913ba3942a6a65c5b8d57a11be

### Application
- `NEXT_PUBLIC_APP_URL` - Production URL (e.g., https://content.hypeworks.io)

## Vercel Deployment Steps

### 1. Connect GitHub Repository
- Go to vercel.com and import this repository
- Link to GitHub account and select hypeworks-content-funnel

### 2. Configure Environment Variables
- In Vercel project settings, go to Environment Variables
- Add all variables from .env.example
- Use `NEXT_PUBLIC_` prefix for client-side variables

### 3. Deploy
- Vercel will automatically deploy on push to master
- Build command: `npm run build`
- Start command: `npm start`

### 4. Set Custom Domain
- Add domain content.hypeworks.io in Vercel project settings
- Update DNS records per Vercel instructions

## Database Setup

### Supabase Migrations
1. Create a new project in Supabase
2. Run migration in supabase/migrations/add_payment_status.sql
3. Create submissions table if not exists:

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_url TEXT NOT NULL,
  platform TEXT DEFAULT 'amazon',
  product_data JSONB,
  brand_assets TEXT[] DEFAULT '{}',
  user_inputs JSONB,
  generated_images TEXT[] DEFAULT '{}',
  payment_status TEXT DEFAULT 'free',
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

All API routes are ready for implementation:

- `POST /api/checkout` - Initialize payment for additional submissions
- `POST /api/scrape` - Scrape product data from URL
- `POST /api/generate-images` - Generate AI images using kie.ai

## Testing

Before going live:

1. Test Stripe checkout flow (use test keys)
2. Verify Firecrawl scraping with sample Amazon/Shopify URLs
3. Test image generation with sample product data
4. Check Supabase connections and data storage

## Known Limitations

- Image composition/overlay features not yet implemented
- kie.ai images need post-processing for A+ content dimensions
- Firecrawl free tier may have rate limits
- Auth system (Supabase Auth) not yet integrated in dashboard routes

## Next Steps

1. Complete image composition utilities
2. Implement auth middleware for protected routes
3. Add webhook handler for Stripe payment success
4. Create admin dashboard for managing submissions
5. Set up email notifications
