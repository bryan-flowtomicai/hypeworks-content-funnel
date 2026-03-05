# Deployment Checklist

## Pre-Launch Tasks

### 1. Supabase Setup
- [ ] Execute `supabase/migrations/001_init.sql` in Supabase SQL Editor
- [ ] Verify `users` table created with RLS enabled
- [ ] Verify `submissions` table created with RLS enabled
- [ ] Verify indexes created (check query performance)
- [ ] Test authentication signup/signin

### 2. Stripe Setup
- [ ] Create Stripe account
- [ ] Get test API keys from https://dashboard.stripe.com/test/keys
- [ ] Update `.env.local` with real `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Create Stripe product (A+ Content Generation)
- [ ] Set up pricing tiers (free: 1 submission, pro: unlimited)

### 3. kie.ai Setup
- [ ] Verify API key: `7a32f8913ba3942a6a65c5b8d57a11be`
- [ ] Test image generation API
- [ ] Create prompt templates for A+ content modules
- [ ] Set up async job queue (use Bull/Redis or Vercel Functions)

### 4. Domain & DNS
- [ ] Update DNS for `content.hypeworks.io`
- [ ] Point CNAME to Vercel deployment
- [ ] Set up SSL certificate (automatic on Vercel)

### 5. Vercel Deployment
- [ ] Create project on Vercel
- [ ] Set environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  STRIPE_SECRET_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  KIE_AI_API_KEY
  ```
- [ ] Connect GitHub repository
- [ ] Configure auto-deploy on `master` push
- [ ] Run initial build and test

### 6. Monitoring & Logging
- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel analytics
- [ ] Set up email alerts for errors
- [ ] Create admin dashboard for monitoring

### 7. Security
- [ ] Enable CSRF protection
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Review RLS policies
- [ ] Add input validation on all forms

### 8. Testing
- [ ] Test sign up flow end-to-end
- [ ] Test sign in flow
- [ ] Test multi-step form submission
- [ ] Test free vs. paid submission limits
- [ ] Test Stripe checkout (if implemented)
- [ ] Test mobile responsiveness
- [ ] Load test with siege or k6

### 9. Documentation
- [ ] Update README with production URLs
- [ ] Add troubleshooting guide
- [ ] Document API endpoints
- [ ] Create user onboarding docs

### 10. Launch
- [ ] Email notification to beta users
- [ ] Monitor error logs for first 24h
- [ ] Follow up with customers on feedback
- [ ] Plan Phase 4 (Stripe + kie.ai) timeline

---

## Phase 4 Implementation Checklist

### Stripe Integration
- [ ] Create `/api/stripe/checkout` endpoint
- [ ] Implement payment intent creation
- [ ] Create success/cancel redirect pages
- [ ] Set up webhook at `/api/webhooks/stripe`
- [ ] Update user `plan` on payment success
- [ ] Enforce submission limits based on plan
- [ ] Add payment history to dashboard

### kie.ai Integration
- [ ] Create `/api/generate-content` endpoint
- [ ] Integrate kie.ai SDK
- [ ] Create prompt templates:
  - [ ] Hero/brand story banner
  - [ ] Feature images with callouts
  - [ ] Comparison chart
  - [ ] Lifestyle image layout
  - [ ] Feature grid
- [ ] Implement async job processing
- [ ] Update submission status flow
- [ ] Store generated images in Supabase Storage
- [ ] Create submission detail page

### Polish & Polish
- [ ] Add email notifications
- [ ] Create image preview page
- [ ] Add download/export functionality
- [ ] Build admin dashboard
- [ ] Performance optimization
- [ ] SEO optimization

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/bryan-flowtomicai/hypeworks-content-funnel.git
cd hypeworks-content-funnel
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual keys

# 3. Run Supabase migration
# Copy supabase/migrations/001_init.sql and execute in Supabase SQL Editor

# 4. Run locally
npm run dev
# Visit http://localhost:3000

# 5. Deploy to Vercel
vercel
```

---

## Contact

- **GitHub:** https://github.com/bryan-flowtomicai/hypeworks-content-funnel
- **Supabase:** https://zulohdueaxzowwesyeln.supabase.co
- **Stripe:** https://dashboard.stripe.com
- **kie.ai:** https://kie.ai

