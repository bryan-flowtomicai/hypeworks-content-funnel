import Anthropic from '@anthropic-ai/sdk'
import type { ImageFormatType } from '@/types'
import type { ImageIntent } from '@/lib/templates/types'
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
  productReviews?: string[]  // scraped customer review snippets
  intent?: ImageIntent       // creative goal for this specific image
  copyBrief?: string         // strategy-generated creative brief for this slot
  headline?: string          // the headline appearing on this image — scene should support it
  format: ImageFormatType
  width: number
  height: number
}

// Per-format base guidance
const FORMAT_BASE: Record<ImageFormatType, string> = {
  hero: `This is a HERO banner (970x600). Wide cinematic image, premium and editorial.`,
  standard: `This is a STANDARD module (970x300). Wide, clean, works as infographic background.`,
  square: `This is a SQUARE module (600x600). Centered, product-focused, slight elevation angle.`,
  portrait: `This is a PORTRAIT module (300x400). Vertical product/lifestyle shot.`,
  banner_wide: `This is a BANNER (970x130). No image generation needed — return "SKIP" only.`,
}

// Per-intent creative direction — overrides the generic format guidance
const INTENT_GUIDANCE: Partial<Record<ImageIntent, string>> = {
  lifestyle: `Aspirational lifestyle scene — show the product being enjoyed by its target user in a real-world environment. Focus on emotion and atmosphere. Warm, natural lighting.`,
  benefit: `Dramatic benefit-focused image — abstract or symbolic visual that represents the core value proposition. Bold composition, strong contrast. The scene should communicate transformation or improvement.`,
  how_it_works: `Clean, instructional background — subtle texture or workspace that suggests process and clarity. Muted tones, minimal clutter. Plenty of negative space for text overlays.`,
  feature_grid: `Technical, precise background — clean studio or surface texture. Neutral or slightly tinted. Should feel detailed and trustworthy like a product spec sheet backdrop.`,
  social_proof: `Warm, human background — soft natural light suggesting authenticity and happiness. Could be hands holding the product, a candid moment of use, or a warm home environment.`,
  problem_solution: `Before/after contrast scene — one side darker and more chaotic, one side clean and bright. Or: show the problem being solved (mess cleaned, pain relieved, task simplified).`,
  comparison: `Clean, neutral product showcase environment — white or off-white studio feel that lets the product stand out. Should feel confident and premium, like a comparison ad.`,
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
      : 'The target model is Flux 2 (photorealistic). Prompts should describe a photorealistic scene with specific lighting, camera angle, and environment details.'

  const intentGuidance = ctx.intent ? INTENT_GUIDANCE[ctx.intent] : undefined
  const reviewContext =
    ctx.productReviews?.length
      ? `\nCUSTOMER REVIEWS (use this language to make the image context more authentic):\n${ctx.productReviews.slice(0, 3).map((r, i) => `${i + 1}. "${r}"`).join('\n')}`
      : ''

  // Strategy context — highest priority creative guidance
  const strategyContext = ctx.copyBrief
    ? `\nSLOT BRIEF (follow this precisely): ${ctx.copyBrief}`
    : ''
  const headlineContext = ctx.headline
    ? `\nIMAGE HEADLINE (the background must visually support this message): "${ctx.headline}"`
    : ''

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `You are an expert Amazon A+ content visual designer. Generate a highly specific image generation prompt.

PRODUCT INFO:
- Name: ${ctx.productName}
${ctx.brandName ? `- Brand: ${ctx.brandName}` : ''}
${ctx.category ? `- Category: ${ctx.category}` : ''}
${ctx.keyFeatures?.length ? `- Key Features: ${ctx.keyFeatures.slice(0, 5).join('; ')}` : ''}
${ctx.targetAudience ? `- Target Audience: ${ctx.targetAudience}` : ''}
${ctx.contentTone ? `- Tone: ${ctx.contentTone}` : ''}
${ctx.brandColors?.length ? `- Brand Colors: ${ctx.brandColors.filter(Boolean).join(', ')}` : ''}
${ctx.description ? `- Description: ${ctx.description.substring(0, 250)}` : ''}
${reviewContext}

FORMAT: ${FORMAT_BASE[ctx.format]}
${intentGuidance ? `\nCREATIVE INTENT: ${intentGuidance}` : ''}${strategyContext}${headlineContext}

MODEL HINT: ${modelHint}

RULES:
- Be SPECIFIC to this exact product, not generic
- The background scene must emotionally reinforce the headline/brief
- No text, logos, or overlays in the image (text is overlaid separately)
- Vary lighting, environment, and composition based on the intent
- Return ONLY the prompt — no explanation, no quotes, no prefixes`,
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

  const intentExtra: Partial<Record<ImageIntent, string>> = {
    lifestyle: 'aspirational in-use scene with natural lighting',
    benefit: 'dramatic bold composition symbolizing transformation',
    how_it_works: 'clean workspace background with soft neutral tones',
    feature_grid: 'technical studio backdrop, precise and detailed',
    social_proof: 'warm candid moment, hands with product, natural light',
    problem_solution: 'before-after contrast, one side dark one bright',
    comparison: 'clean white studio product showcase',
  }

  const toneDesc = toneMap[ctx.contentTone ?? 'professional'] ?? 'professional'
  const intentDesc = ctx.intent ? intentExtra[ctx.intent] : undefined

  const parts = [
    `Professional product photography of ${ctx.productName}`,
    ctx.brandName ? `by ${ctx.brandName}` : '',
    intentDesc ? intentDesc : `in a ${toneDesc} setting`,
    'studio lighting, high quality, sharp focus',
    ctx.category ? `${ctx.category} product` : '',
    'no text, no logos, no overlays',
  ]

  return parts.filter(Boolean).join(', ')
}
