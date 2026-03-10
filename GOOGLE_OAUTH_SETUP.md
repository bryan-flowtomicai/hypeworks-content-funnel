# Google OAuth Setup Guide

## Overview

This guide walks you through setting up Google OAuth for your Hypeworks application.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Hypeworks Content Funnel" (or similar)
4. Click "Create"

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Hypeworks Content Funnel
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Skip "Test users" (click "Save and Continue")
8. Click "Back to Dashboard"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it "Hypeworks Web Client"
5. Under "Authorized redirect URIs", add:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
   
   Replace `YOUR_PROJECT_REF` with your actual Supabase project reference ID.
   You can find it in your Supabase project URL or in the project settings.
6. Click "Create"
7. **Copy the Client ID and Client Secret** (you'll need these next)

## Step 4: Configure Supabase

1. Go to [Supabase Auth Providers](https://supabase.com/dashboard/project/_/auth/providers)
2. Find "Google" in the list
3. Click to expand
4. Toggle "Enable Sign in with Google" to **ON**
5. Paste your **Client ID** from Step 3
6. Paste your **Client Secret** from Step 3
7. Click "Save"

## Step 5: Test Google OAuth

1. Start your app: `npm run dev`
2. Go to http://localhost:3000
3. Click "Sign In" or "Get Started Free"
4. Click "Continue with Google"
5. You should be redirected to Google's login page
6. After signing in, you should be redirected back to the dashboard

## Troubleshooting

### "Access blocked: This app's request is invalid"

- Check that redirect URIs in Google Cloud Console match exactly:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  - Replace `YOUR_PROJECT_REF` with your Supabase project reference
- No trailing slashes, no typos

### "Invalid OAuth credentials"

- Verify Client ID and Secret are correctly copied to Supabase
- Check for extra spaces or missing characters

### "Redirect URI mismatch"

- The redirect URI must be added to both:
  1. Google Cloud Console (Authorized redirect URIs)
  2. Supabase will handle the callback automatically

### Still not working?

1. Check browser console for errors
2. Check Supabase Auth logs: https://supabase.com/dashboard/project/_/auth/logs
3. Verify Google provider is enabled in Supabase

## What if I don't want Google OAuth?

That's fine! The email/password authentication works independently. You can:

1. Remove the "Continue with Google" button from the auth pages
2. Or just leave it - it will show an error if clicked but won't break email/password auth

## Security Notes

- Keep your Client Secret secure
- Never commit it to version control
- Store it in environment variables or Cursor Secrets
- Rotate it if compromised

## Reference Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Auth Providers**: https://supabase.com/dashboard/project/_/auth/providers
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth/social-login/auth-google
