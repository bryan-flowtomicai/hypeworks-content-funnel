import { fal } from '@fal-ai/client'
import type { ImageFormatType } from '@/types'

let configured = false

function ensureConfig() {
  if (configured) return
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set')
  }
  fal.config({ credentials: process.env.FAL_KEY })
  configured = true
}

// ─── Model selection per format ─────────────────────────────────────────────

type ModelId = 'fal-ai/recraft-v3' | 'fal-ai/flux-2-flex' | 'none'

interface ModelConfig {
  model: ModelId
  style?: string
  styleId?: string
}

const FORMAT_MODELS: Record<ImageFormatType, ModelConfig> = {
  hero: { model: 'fal-ai/flux-2-flex' },
  portrait: { model: 'fal-ai/flux-2-flex' },
  standard: { model: 'fal-ai/recraft-v3', style: 'digital_illustration' },
  square: { model: 'fal-ai/recraft-v3', style: 'digital_illustration' },
  banner_wide: { model: 'none' },
}

export function getModelForFormat(format: ImageFormatType): ModelConfig {
  return FORMAT_MODELS[format]
}

// ─── Image generation ───────────────────────────────────────────────────────

export interface GenerateBackgroundInput {
  prompt: string
  width: number
  height: number
  format: ImageFormatType
  brandColors?: string[]
}

export interface GenerateBackgroundResult {
  imageUrl: string
  requestId: string
  model: string
}

export async function generateBackground(
  input: GenerateBackgroundInput
): Promise<GenerateBackgroundResult | null> {
  const config = getModelForFormat(input.format)

  if (config.model === 'none') return null

  ensureConfig()

  if (config.model === 'fal-ai/recraft-v3') {
    return generateWithRecraft(input, config)
  }

  return generateWithFlux2(input)
}

async function generateWithRecraft(
  input: GenerateBackgroundInput,
  config: ModelConfig
): Promise<GenerateBackgroundResult> {
  const falInput: Record<string, unknown> = {
    prompt: input.prompt,
    image_size: { width: input.width, height: input.height },
  }

  if (config.style) falInput.style = config.style

  if (input.brandColors?.length) {
    falInput.colors = input.brandColors
      .filter(Boolean)
      .slice(0, 5)
      .map((c) => ({ rgb: hexToRgb(c) }))
  }

  const result = await fal.subscribe('fal-ai/recraft-v3', {
    input: falInput,
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }

  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
    model: 'recraft-v3',
  }
}

async function generateWithFlux2(
  input: GenerateBackgroundInput
): Promise<GenerateBackgroundResult> {
  const result = await fal.subscribe('fal-ai/flux-2-flex', {
    input: {
      prompt: input.prompt,
      image_size: { width: input.width, height: input.height },
    },
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }

  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
    model: 'flux-2-flex',
  }
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}
