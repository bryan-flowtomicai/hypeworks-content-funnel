import type { ImageFormatType } from '@/types'

// Intent describes the creative goal of this specific image — drives layout and prompt strategy
export type ImageIntent =
  | 'lifestyle'        // aspirational, product in environment
  | 'benefit'          // bold primary claim / value prop
  | 'how_it_works'     // mechanism, steps, process
  | 'feature_grid'     // technical callouts, ingredients, specs
  | 'social_proof'     // customer review highlight
  | 'problem_solution' // before/after or pain-point resolution
  | 'comparison'       // vs competitor or hero comparison

export interface TemplateData {
  format: ImageFormatType
  intent?: ImageIntent
  productName: string
  displayTitle?: string
  tagline?: string
  brandName?: string
  keyFeatures: string[]
  description?: string
  targetAudience?: string
  contentTone?: string
  brandColors: string[]
  backgroundImageUrl?: string | null
  reviewHighlight?: string // real customer review snippet for social_proof layouts
}
