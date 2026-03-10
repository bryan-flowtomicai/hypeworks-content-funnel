# Supabase Setup Guide

## Current Status

✅ Authentication pages created (`/auth/signin`, `/auth/signup`)  
❌ Database tables not created  
❌ Google OAuth not configured  

## Required Setup Steps

### 1. Apply Database Migrations ⚠️ CRITICAL

The database tables (`users` and `submissions`) need to be created. **This is blocking all authentication!**

#### Quick Setup (5 minutes):

1. **Open Supabase SQL Editor**: https://supabase.com/dashboard/project/_/sql/new
2. **Open the migration file**: `supabase/APPLY_THIS_MIGRATION.sql` in this repository
3. **Copy the entire contents** of that file
4. **Paste into the SQL Editor**
5. **Click "Run"** (bottom right)
6. **Verify**: You should see "Success. No rows returned" message

That's it! All tables, indexes, and security policies are now created.

#### Verify Setup:

Run this command to confirm tables exist:
```bash
node check-db.js
```

You should see:
```
✅ users table exists
✅ submissions table exists
```

#### Alternative: Manual Migration (Step-by-step)

If you prefer to run migrations one at a time:

1. Go to: https://supabase.com/dashboard/project/_/sql/new
2. Copy contents of `supabase/migrations/001_init.sql` → Run
3. Copy contents of `supabase/migrations/add_payment_status.sql` → Run

### 2. Configure Google OAuth

To enable Google sign-in:

1. Go to: https://supabase.com/dashboard/project/_/auth/providers
2. Find "Google" in the list of providers
3. Click to expand the Google provider settings
4. Toggle "Enable Sign in with Google" to ON
5. You'll need to provide:
   - **Client ID** from Google Cloud Console
   - **Client Secret** from Google Cloud Console

#### Getting Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference ID
7. Copy the Client ID and Client Secret
8. Paste them into Supabase Auth Providers settings

### 3. Add Service Role Key (Optional but Recommended)

For better security and functionality, add the service role key:

1. Go to: https://supabase.com/dashboard/project/_/settings/api
2. Copy the "service_role" key (keep it secret!)
3. Add to your environment:
   - In Cursor: Cloud Agents > Secrets
   - Add secret: `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`

### 4. Verify Setup

Run the verification script:

```bash
node check-db.js
```

You should see:
```
✅ users table exists
✅ submissions table exists
Auth status: OK
```

## Quick Reference

### Supabase Dashboard Links

- **SQL Editor**: https://supabase.com/dashboard/project/_/sql/new
- **Database Settings**: https://supabase.com/dashboard/project/_/settings/database
- **Auth Providers**: https://supabase.com/dashboard/project/_/auth/providers
- **API Keys**: https://supabase.com/dashboard/project/_/settings/api

### Migration Files Location

- `supabase/migrations/001_init.sql` - Creates users and submissions tables with RLS
- `supabase/migrations/add_payment_status.sql` - Adds payment tracking columns

## Troubleshooting

### "Could not find the table" error

This means the migrations haven't been applied yet. Follow Step 1 above.

### Google OAuth not working

1. Verify Google provider is enabled in Supabase
2. Check that redirect URIs are correctly configured in Google Cloud Console
3. Ensure the Client ID and Secret are correctly entered in Supabase

### "Invalid login credentials" error

This is normal if you're trying to sign in before creating an account. Use the sign-up page first.

### "email rate limit exceeded" error

Supabase has rate limiting to prevent spam. If you see this error:
- Wait 15-60 minutes before trying again
- Or adjust rate limit settings in: https://supabase.com/dashboard/project/_/auth/rate-limits
- This is a security feature and confirms your auth system is working correctly!

## What's Fixed

✅ Created `/auth/signup` page with email/password and Google OAuth  
✅ Created `/auth/signin` page with email/password and Google OAuth  
✅ Created `/auth/callback` route to handle OAuth redirects  
✅ Fixed user profile creation on signup  
✅ Added proper error handling and loading states  

## What Still Needs Setup

1. ⚠️ Run database migrations (see Step 1 above)
2. ⚠️ Configure Google OAuth provider (see Step 2 above)
3. ⚠️ Test the authentication flow

Once these steps are complete, the authentication system will be fully functional!
