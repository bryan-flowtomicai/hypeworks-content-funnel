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

// Pre-defined A+ content slot IDs — maps narrative role to format + intent
export type SlotId = 'HERO' | 'PT01' | 'PT02' | 'PT03' | 'PT04' | 'PT05' | 'PT06' | 'PT07'

export interface SlotDefinition {
  id: SlotId
  name: string
  label: string
  format: ImageFormatType
  intent: ImageIntent
  defaultBrief: string
}

export const SLOT_DEFINITIONS: SlotDefinition[] = [
  {
    id: 'HERO',
    name: 'Hero',
    label: 'Hero Shot',
    format: 'hero',
    intent: 'lifestyle',
    defaultBrief: 'Aspirational hero shot — product in premium lifestyle environment with target customer',
  },
  {
    id: 'PT01',
    name: 'Core Benefit',
    label: 'Top Conversion Driver',
    format: 'square',
    intent: 'benefit',
    defaultBrief: 'Bold visualization of the #1 reason customers buy — emotional outcome over product feature',
  },
  {
    id: 'PT02',
    name: 'Problem → Solution',
    label: 'Before / After',
    format: 'standard',
    intent: 'problem_solution',
    defaultBrief: 'Split composition showing pain point on left, transformation/solution on right',
  },
  {
    id: 'PT03',
    name: 'How It Works',
    label: 'Mechanism / Timeline',
    format: 'hero',
    intent: 'how_it_works',
    defaultBrief: 'Timeline or step-by-step mechanism showing how the product delivers results',
  },
  {
    id: 'PT04',
    name: "What's Inside",
    label: 'Feature / Ingredient Grid',
    format: 'square',
    intent: 'feature_grid',
    defaultBrief: 'Technical callout grid showing key ingredients, materials, or specs with product centered',
  },
  {
    id: 'PT05',
    name: 'Feel & Detail',
    label: 'Sensory / Lifestyle Detail',
    format: 'portrait',
    intent: 'lifestyle',
    defaultBrief: 'Close-up sensory detail — texture, application, or tactile quality that overcomes objections',
  },
  {
    id: 'PT06',
    name: "Who It's For",
    label: 'Lifestyle Compatibility',
    format: 'standard',
    intent: 'comparison',
    defaultBrief: 'Shows the product fits your lifestyle — dietary compatibility, use cases, or "made for you" messaging',
  },
  {
    id: 'PT07',
    name: 'Social Proof',
    label: 'Customer Review',
    format: 'square',
    intent: 'social_proof',
    defaultBrief: 'Most compelling customer review turned into a visual statement — real voice, emotional language',
  },
]

export interface TemplateData {
  format: ImageFormatType
  intent?: ImageIntent
  slotId?: SlotId
  // Strategy-generated copy (from conversion drivers analysis)
  headline?: string      // primary headline — overrides displayTitle
  subheadline?: string   // secondary line — overrides tagline
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
  productImageUrl?: string      // proxied product photo for compositing directly in Satori layouts
  reviewHighlight?: string      // real customer review snippet for social_proof layouts
}
