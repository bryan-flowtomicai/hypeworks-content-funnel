-- ============================================================
-- Hypeworks A+ Content Generator — Database Schema
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'agency')),
  subscription_status text not null default 'inactive' check (subscription_status in ('inactive', 'active', 'canceled', 'past_due')),
  credits_remaining int not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  product_name text,
  brand_name text,
  description text,
  key_features text[] default '{}',
  target_audience text,
  category text,
  content_tone text default 'professional' check (content_tone in ('professional', 'lifestyle', 'luxury', 'technical', 'playful')),
  brand_colors text[] default '{}',
  source_urls text[] default '{}',
  scraped_data jsonb,
  status text not null default 'draft' check (status in ('draft', 'generating', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Uploaded Assets (user-provided images)
create table public.uploaded_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  public_url text,
  file_name text,
  file_size int,
  mime_type text,
  created_at timestamptz not null default now()
);

-- Generated Images
create table public.generated_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  public_url text,
  format_type text not null,
  width int not null,
  height int not null,
  prompt_used text,
  fal_request_id text,
  status text not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  created_at timestamptz not null default now()
);

-- Subscriptions (mirrored from Stripe webhooks)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_price_id text,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_status on public.projects(status);
create index idx_projects_created_at on public.projects(created_at desc);
create index idx_uploaded_assets_project_id on public.uploaded_assets(project_id);
create index idx_generated_images_project_id on public.generated_images(project_id);
create index idx_generated_images_status on public.generated_images(status);
create index idx_subscriptions_user_id on public.subscriptions(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.uploaded_assets enable row level security;
alter table public.generated_images enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Projects: users can CRUD their own projects
create policy "Users can view own projects"
  on public.projects for select using (auth.uid() = user_id);

create policy "Users can create own projects"
  on public.projects for insert with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete using (auth.uid() = user_id);

-- Uploaded Assets: users can CRUD their own assets
create policy "Users can view own assets"
  on public.uploaded_assets for select using (auth.uid() = user_id);

create policy "Users can upload own assets"
  on public.uploaded_assets for insert with check (auth.uid() = user_id);

create policy "Users can delete own assets"
  on public.uploaded_assets for delete using (auth.uid() = user_id);

-- Generated Images: users can read/delete their own images
create policy "Users can view own images"
  on public.generated_images for select using (auth.uid() = user_id);

create policy "Users can delete own images"
  on public.generated_images for delete using (auth.uid() = user_id);

-- Subscriptions: users can view their own subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Auto-update updated_at timestamp
-- ============================================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- Storage Buckets
-- ============================================================

insert into storage.buckets (id, name, public) values ('product-assets', 'product-assets', true);
insert into storage.buckets (id, name, public) values ('generated-images', 'generated-images', true);

create policy "Users can upload product assets"
  on storage.objects for insert
  with check (bucket_id = 'product-assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view product assets"
  on storage.objects for select
  using (bucket_id = 'product-assets');

create policy "Users can delete own product assets"
  on storage.objects for delete
  using (bucket_id = 'product-assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view generated images"
  on storage.objects for select
  using (bucket_id = 'generated-images');

create policy "Service role can insert generated images"
  on storage.objects for insert
  with check (bucket_id = 'generated-images');
