export type SubscriptionTier = 'free' | 'pro' | 'agency'
export type SubscriptionStatus = 'inactive' | 'active' | 'canceled' | 'past_due'
export type ProjectStatus = 'draft' | 'generating' | 'complete'
export type ContentTone = 'professional' | 'lifestyle' | 'luxury' | 'technical' | 'playful'
export type ImageStatus = 'pending' | 'complete' | 'failed'

export type ImageFormatType =
  | 'standard'
  | 'hero'
  | 'square'
  | 'portrait'
  | 'banner_wide'

export const IMAGE_FORMATS: Record<
  ImageFormatType,
  { label: string; width: number; height: number }
> = {
  standard: { label: 'Standard', width: 970, height: 300 },
  hero: { label: 'Hero', width: 970, height: 600 },
  square: { label: 'Square', width: 600, height: 600 },
  portrait: { label: 'Portrait', width: 300, height: 400 },
  banner_wide: { label: 'Banner Wide', width: 970, height: 130 },
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  credits_remaining: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  product_name: string | null
  brand_name: string | null
  description: string | null
  key_features: string[]
  target_audience: string | null
  category: string | null
  content_tone: ContentTone
  brand_colors: string[]
  source_urls: string[]
  scraped_data: Record<string, unknown> | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface UploadedAsset {
  id: string
  project_id: string
  user_id: string
  storage_path: string
  public_url: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
}

export interface GeneratedImage {
  id: string
  project_id: string
  user_id: string
  storage_path: string
  public_url: string | null
  format_type: string
  width: number
  height: number
  prompt_used: string | null
  fal_request_id: string | null
  status: ImageStatus
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export const TIER_LIMITS: Record<
  SubscriptionTier,
  { generations: number | null; projects: number | null; allFormats: boolean; batchDownload: boolean; scraping: boolean; priorityQueue: boolean }
> = {
  free: { generations: 5, projects: 2, allFormats: false, batchDownload: false, scraping: false, priorityQueue: false },
  pro: { generations: 100, projects: null, allFormats: true, batchDownload: true, scraping: true, priorityQueue: false },
  agency: { generations: null, projects: null, allFormats: true, batchDownload: true, scraping: true, priorityQueue: true },
}
