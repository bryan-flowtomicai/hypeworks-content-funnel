import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_KEY! })

interface GenerateImageInput {
  prompt: string
  width: number
  height: number
}

interface GenerateImageResult {
  imageUrl: string
  requestId: string
}

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageResult> {
  const result = await fal.subscribe('fal-ai/flux/dev', {
    input: {
      prompt: input.prompt,
      image_size: { width: input.width, height: input.height },
      num_images: 1,
    },
    pollInterval: 3000,
  })

  const data = result.data as { images: Array<{ url: string }> }

  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId ?? '',
  }
}

export function buildPrompt(params: {
  productName: string
  brandName?: string
  category?: string
  keyFeatures?: string[]
  targetAudience?: string
  contentTone?: string
  brandColors?: string[]
  scrapedDescription?: string
  formatLabel: string
  width: number
  height: number
}): string {
  const lines = [
    `Product: ${params.productName}${params.brandName ? ` by ${params.brandName}` : ''}`,
  ]

  if (params.category) lines.push(`Category: ${params.category}`)
  if (params.keyFeatures?.length)
    lines.push(`Key Features: ${params.keyFeatures.join(', ')}`)
  if (params.targetAudience)
    lines.push(`Target Audience: ${params.targetAudience}`)
  if (params.contentTone) lines.push(`Tone: ${params.contentTone}`)
  if (params.brandColors?.length)
    lines.push(`Brand Colors: ${params.brandColors.join(', ')}`)

  lines.push(
    `Format: Amazon A+ content image (${params.formatLabel}), ${params.width}x${params.height}px`
  )

  if (params.scrapedDescription) {
    lines.push(
      `Additional Context: ${params.scrapedDescription.substring(0, 500)}`
    )
  }

  lines.push(
    'Style: Professional e-commerce product photography, clean background, brand-consistent, high quality, studio lighting'
  )

  return lines.join('\n')
}
