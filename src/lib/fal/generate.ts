import { fal } from '@fal-ai/client'
import { proxyImageToFalStorage } from './imageProxy'
import type { ImageFormatType } from '@/types'
import type { ImageIntent } from '@/lib/templates/types'

let configured = false

function ensureConfig() {
  if (configured) return
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set')
  }
  fal.config({ credentials: process.env.FAL_KEY })
  configured = true
}

// ─── Model types ─────────────────────────────────────────────────────────────

export type GenerationModel =
  | 'fal-ai/flux-pro/kontext'    // image-to-image: product placed in scene
  | 'fal-ai/flux-pro/v1.1-ultra' // text-to-image: highest quality lifestyle scenes
  | 'fal-ai/ideogram/v3'         // text-to-image: design/text-capable (standard format)
  | 'none'

// Backward-compat shim used by prompt.ts
export interface ModelConfig {
  model: GenerationModel
}

// Returns a model hint for prompt generation — not the final routing decision
export function getModelForFormat(format: ImageFormatType): ModelConfig {
  if (format === 'banner_wide') return { model: 'none' }
  if (format === 'standard') return { model: 'fal-ai/ideogram/v3' }
  return { model: 'fal-ai/flux-pro/kontext' }
}

// ─── Aspect ratios for flux-pro/v1.1-ultra (no custom dimensions supported) ──

const ULTRA_ASPECT_RATIO: Partial<Record<ImageFormatType, string>> = {
  hero: '16:9',    // 970×600 ≈ 16:9
  portrait: '3:4', // 300×400 = 3:4
  square: '1:1',   // 600×600
}

// ─── Intents that benefit from Kontext (product-in-scene placement) ──────────

const KONTEXT_INTENTS: ImageIntent[] = ['lifestyle', 'benefit', 'feature_grid']

// ─── Image generation ────────────────────────────────────────────────────────

export interface GenerateBackgroundInput {
  prompt: string
  width: number
  height: number
  format: ImageFormatType
  intent?: ImageIntent
  brandColors?: string[]
  referenceImageUrl?: string  // product photo — triggers Kontext when usable
}

export interface GenerateBackgroundResult {
  imageUrl: string
  requestId: string
  model: string
}

export async function generateBackground(
  input: GenerateBackgroundInput
): Promise<GenerateBackgroundResult | null> {
  if (input.format === 'banner_wide') return null

  ensureConfig()

  // ── Proxy reference image to fal.ai storage (fixes Amazon CDN 422 errors) ──
  let proxiedImageUrl: string | undefined
  if (input.referenceImageUrl) {
    try {
      proxiedImageUrl = await proxyImageToFalStorage(input.referenceImageUrl)
    } catch (err) {
      // Non-fatal: fall through to text-to-image
      console.warn('[generate] Reference image proxy failed, using text-to-image:', err)
    }
  }

  // ── Route to best model ───────────────────────────────────────────────────
  //
  // Kontext  — product reference available + visual format + lifestyle/benefit/feature intent
  //            → places the actual product into a freshly generated scene
  //
  // Ideogram — standard format (970×300 has no clean aspect-ratio preset in Ultra)
  //            OR design/text-heavy intents (social proof quote, feature grid)
  //
  // Ultra    — pure photorealistic scene generation, no product reference needed
  //            → hero/portrait/square lifestyle scenes, how-it-works, problem/solution

  if (
    proxiedImageUrl &&
    ['hero', 'portrait', 'square'].includes(input.format) &&
    KONTEXT_INTENTS.includes(input.intent ?? 'lifestyle')
  ) {
    return generateWithKontext(input, proxiedImageUrl)
  }

  if (
    input.format === 'standard' ||
    input.intent === 'social_proof' ||
    input.intent === 'feature_grid'
  ) {
    return generateWithIdeogram(input)
  }

  return generateWithUltra(input)
}

// ─── Kontext: place the product into a scene ─────────────────────────────────

async function generateWithKontext(
  input: GenerateBackgroundInput,
  imageUrl: string
): Promise<GenerateBackgroundResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.subscribe('fal-ai/flux-pro/kontext' as any, {
    input: {
      prompt: input.prompt,
      image_url: imageUrl,
      image_size: { width: input.width, height: input.height },
      guidance_scale: 3.5,
      output_format: 'png',
      safety_tolerance: '5',
    },
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }
  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
    model: 'flux-pro-kontext',
  }
}

// ─── Ultra: highest quality text-to-image ────────────────────────────────────

async function generateWithUltra(
  input: GenerateBackgroundInput
): Promise<GenerateBackgroundResult> {
  const aspectRatio = ULTRA_ASPECT_RATIO[input.format] ?? '16:9'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra' as any, {
    input: {
      prompt: input.prompt,
      aspect_ratio: aspectRatio,
      output_format: 'png',
      safety_tolerance: '5',
      raw: false,
    },
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }
  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
    model: 'flux-pro-ultra',
  }
}

// ─── Ideogram: design-capable, exact dimensions, best for text + standard ───

async function generateWithIdeogram(
  input: GenerateBackgroundInput
): Promise<GenerateBackgroundResult> {
  const isDesignIntent =
    input.intent === 'social_proof' || input.intent === 'feature_grid'

  const falInput: Record<string, unknown> = {
    prompt: input.prompt,
    image_size: { width: input.width, height: input.height },
    style: isDesignIntent ? 'design' : 'realistic',
    expand_prompt: false,
  }

  // Wire brand colors into Ideogram's color palette for branded results
  if (input.brandColors?.length) {
    const validColors = input.brandColors.filter(Boolean).slice(0, 4)
    if (validColors.length) {
      falInput.color_palette = {
        members: validColors.map((hex) => ({ color_hex: hex })),
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.subscribe('fal-ai/ideogram/v3' as any, {
    input: falInput,
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }
  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
    model: 'ideogram-v3',
  }
}
