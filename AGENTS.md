# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 14** app (TypeScript, Tailwind CSS v4, Supabase BaaS). There is no Docker, no monorepo tooling, and no local database — all data persistence is via a hosted Supabase cloud instance.

### Running the app

- `npm run dev` starts the dev server on port 3000.
- `npm run build` / `npm run lint` for build and lint respectively (see `package.json` scripts).
- The app requires a `.env.local` file. Copy `.env.example` and fill in real keys if available. The minimum needed to start the server are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (placeholder values still allow the server to start, but auth/DB calls will fail).

### Non-obvious caveats

- **ESLint config**: The repo ships without an `.eslintrc.json`. Running `npm run lint` (which calls `next lint`) will prompt interactively unless you first create `.eslintrc.json` with `{"extends": "next/core-web-vitals"}`.
- **No test suite**: There are no automated tests in this repo (no test framework configured, no test files). Testing is manual only.
- **Auth pages**: The repo originally shipped without `src/app/auth/signin/page.tsx` and `src/app/auth/signup/page.tsx`. If they are missing, the Sign In / Sign Up links from the landing page will 404.
- **All external services are cloud-hosted**: Supabase (DB + Auth + Storage), Stripe, Firecrawl, kie.ai. None run locally. Without valid API keys the app will render but API calls will return errors.
- **Database migrations** in `supabase/migrations/` are meant to be run manually in Supabase SQL Editor — there is no Supabase CLI local dev setup.
- **Supabase email confirmation**: The Supabase project has email verification enabled. Newly signed-up users cannot sign in until their email is confirmed. This blocks dashboard/form access since those pages redirect unauthenticated users to `/auth/signin`. To test authenticated flows, either disable email confirmation in Supabase Auth settings or use a pre-confirmed account.
