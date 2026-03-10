import Anthropic from '@anthropic-ai/sdk'
import type { ImageFormatType } from '@/types'
import { getModelForFormat } from './generate'

export interface PromptContext {
  productName: string
  brandName?: string
  category?: string
  keyFeatures?: string[]
  targetAudience?: string
  contentTone?: string
  brandColors?: string[]
  description?: string
  format: ImageFormatType
  width: number
  height: number
}

const FORMAT_GUIDANCE: Record<ImageFormatType, string> = {
  hero: `This is a HERO banner (970x600). Generate a prompt for a wide cinematic lifestyle/product photograph.
The image should feel aspirational and premium — think editorial magazine spread.
Focus on showing the product in a beautiful, contextual environment with warm, natural lighting.
Do NOT include any text, logos, or overlays — those will be composited separately.`,

  standard: `This is a STANDARD module (970x300). Generate a prompt for a clean, wide product illustration.
The image should work as a background for an infographic-style layout where text and icons will be overlaid.
Create a subtle, professional scene with muted tones and plenty of negative space on the left side for text.
Do NOT include any text, logos, or overlays.`,

  square: `This is a SQUARE module (600x600). Generate a prompt for a centered product-focused image.
The product should be the hero, shown from a slightly elevated angle with soft studio lighting.
Use a clean, gradient or lightly textured background that complements the product.
Leave space around the edges for feature callouts. Do NOT include any text.`,

  portrait: `This is a PORTRAIT module (300x400). Generate a prompt for a vertical product/lifestyle shot.
The product should occupy the top half of the frame with a lifestyle setting.
Keep the bottom portion relatively clean or softly blurred for text overlay.
Do NOT include any text, logos, or overlays.`,

  banner_wide: `This is a BANNER (970x130). No image generation needed — return "SKIP" only.`,
}

export async function generateOptimizedPrompt(
  ctx: PromptContext
): Promise<string> {
  if (ctx.format === 'banner_wide') return 'SKIP'

  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackPrompt(ctx)
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const modelConfig = getModelForFormat(ctx.format)

  const modelHint =
    modelConfig.model === 'fal-ai/recraft-v3'
      ? 'The target model is Recraft V3 (digital illustration style). Prompts should describe a clean, graphic illustration rather than a photograph.'
      : 'The target model is Flux 2 (photographic). Prompts should describe a photorealistic scene with specific lighting, camera angle, and environment details.'

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `You are an expert Amazon A+ content designer. Generate an optimized image generation prompt for an AI model.

PRODUCT INFO:
- Name: ${ctx.productName}
${ctx.brandName ? `- Brand: ${ctx.brandName}` : ''}
${ctx.category ? `- Category: ${ctx.category}` : ''}
${ctx.keyFeatures?.length ? `- Key Features: ${ctx.keyFeatures.join('; ')}` : ''}
${ctx.targetAudience ? `- Target Audience: ${ctx.targetAudience}` : ''}
${ctx.contentTone ? `- Tone: ${ctx.contentTone}` : ''}
${ctx.brandColors?.length ? `- Brand Colors: ${ctx.brandColors.filter(Boolean).join(', ')}` : ''}
${ctx.description ? `- Description: ${ctx.description.substring(0, 300)}` : ''}

FORMAT REQUIREMENTS:
${FORMAT_GUIDANCE[ctx.format]}

MODEL HINT:
${modelHint}

Return ONLY the image generation prompt — no explanation, no quotes, no prefixes. Just the prompt text.`,
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    return text || buildFallbackPrompt(ctx)
  } catch (err) {
    console.error('Prompt optimization failed, using fallback:', err)
    return buildFallbackPrompt(ctx)
  }
}

function buildFallbackPrompt(ctx: PromptContext): string {
  const toneMap: Record<string, string> = {
    professional: 'clean, modern, professional',
    lifestyle: 'warm, natural, lifestyle-oriented',
    luxury: 'elegant, premium, luxurious',
    technical: 'precise, detailed, technical',
    playful: 'vibrant, energetic, fun',
  }

  const toneDesc = toneMap[ctx.contentTone ?? 'professional'] ?? 'professional'

  const parts = [
    `Professional product photography of ${ctx.productName}`,
    ctx.brandName ? `by ${ctx.brandName}` : '',
    `in a ${toneDesc} setting`,
    'studio lighting, high quality, sharp focus',
    ctx.category ? `${ctx.category} product category` : '',
    'clean background with soft gradients',
    'no text, no logos, no overlays',
    `aspect ratio ${ctx.width}:${ctx.height}`,
  ]

  return parts.filter(Boolean).join(', ')
}
