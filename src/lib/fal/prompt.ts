import Anthropic from '@anthropic-ai/sdk'
import type { ImageFormatType } from '@/types'
import type { ImageIntent } from '@/lib/templates/types'

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
  headline?: string          // the headline appearing on this image — scene must support it
  format: ImageFormatType
  width: number
  height: number
}

// ─── Per-format base guidance ─────────────────────────────────────────────────

const FORMAT_BASE: Record<ImageFormatType, string> = {
  hero:        `This is a HERO banner (970×600 wide). CRITICAL composition rule: keep the LEFT 50% of the frame as a relatively dark, low-clutter zone — this is where headline text will be overlaid. The right side can have more visual detail.`,
  standard:    `This is a STANDARD banner (970×300 wide). Keep the LEFT 45% dark and clean for text overlay. The right side can have product or visual interest.`,
  square:      `This is a SQUARE module (600×600). Keep the BOTTOM 35% dark and clean for text overlay. Center and upper portions can have scene detail.`,
  portrait:    `This is a PORTRAIT module (300×400 vertical). Keep the BOTTOM 40% very dark and clean — text overlay goes there. The upper 60% should be rich visual content.`,
  banner_wide: `This is a BANNER (970×130). No image generation needed — return "SKIP" only.`,
}

// ─── Per-intent creative direction ──────────────────────────────────────────

const INTENT_GUIDANCE: Partial<Record<ImageIntent, string>> = {
  lifestyle:
    `Aspirational lifestyle scene. Show the product in its natural environment being enjoyed by the target customer. Warm, natural light. Authentic and aspirational. No busy patterns — clean negative space.`,
  benefit:
    `Dramatic benefit visualization. Bold, emotionally resonant scene that communicates the core transformation. Strong lighting contrast. Use bokeh or blurred backgrounds to keep visual weight low in text overlay zones.`,
  how_it_works:
    `Ultra-clean instructional background. Minimal workspace or soft textured surface. Muted neutral tones with plenty of open space. The simpler the better — this is a text-heavy template.`,
  feature_grid:
    `Clean studio product surface. Neutral gradient or subtle textured background. Premium ingredient close-up or elegant flat-lay. Must feel like a luxury product catalogue page.`,
  social_proof:
    `Warm, soft, authentic lifestyle background. Soft diffused natural light. Gentle textures — linen, marble, wood grain. Conveys trust and human connection. Avoid busy patterns.`,
  problem_solution:
    `High-contrast split visual. Left side slightly darker/cooler, right side brighter/warmer. Create a visual tension and release. Clean tonal zones, no busy details.`,
  comparison:
    `Ultra-clean premium studio environment. Soft white or light gradient background with subtle depth. Feels like Apple or Dyson product photography — minimal and confident.`,
}

// ─── Model-specific prompt guidance ─────────────────────────────────────────

function getModelHint(format: ImageFormatType, intent?: ImageIntent): string {
  // Ideogram for standard format and design/text intents
  if (
    format === 'standard' ||
    intent === 'feature_grid' ||
    intent === 'social_proof'
  ) {
    return `The target model is Ideogram V3 in design mode — it renders crisp typography and graphic layouts.
Write a prompt that describes a DESIGNED COMPOSITION: describe the layout, color palette, typography treatment, and visual hierarchy.
Example: "Minimalist product infographic on deep navy background, clean sans-serif text, product hero on left, three circular benefit icons on right, warm gold accent lines"
NO literal text content in the prompt (text is overlaid separately) — describe the DESIGN STYLE and STRUCTURE.`
  }

  // Kontext / Ultra for lifestyle formats
  if (intent === 'lifestyle' || intent === 'benefit') {
    return `The target model places YOUR ACTUAL PRODUCT (reference photo provided) into a freshly generated scene.
Write a prompt that describes WHERE and HOW the product appears — do NOT describe what the product looks like.
Start with the scene, environment, and mood. Be extremely specific about:
- Setting (marble countertop / rustic wood table / morning window light kitchen)
- Lighting (golden hour / soft diffused / dramatic side light)
- Camera angle (slightly elevated 3/4 view / close-up product detail / wide lifestyle shot)
- Mood (premium and aspirational / cozy and authentic / energetic and bold)
Example: "Premium supplement jar on white marble countertop, Scandinavian kitchen with natural morning light streaming through a window, editorial product photography, slight elevation angle, bokeh background"`
  }

  return `The target model is FLUX Pro Ultra — photorealistic cinematic quality.
Write a highly detailed scene description with specific lighting conditions, camera angle, environment, and atmosphere.
Be specific and evocative — include sensory details. Avoid generic descriptions like "professional photography".
Example: "Overhead flat-lay of wellness products on aged oak wood surface, late afternoon sun casting long shadows, dried lavender sprigs, small ceramic dishes with herbs, analog film grain texture, lifestyle photography"`
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateOptimizedPrompt(
  ctx: PromptContext
): Promise<string> {
  if (ctx.format === 'banner_wide') return 'SKIP'

  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackPrompt(ctx)
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const modelHint = getModelHint(ctx.format, ctx.intent)
  const intentGuidance = ctx.intent ? INTENT_GUIDANCE[ctx.intent] : undefined

  const reviewContext =
    ctx.productReviews?.length
      ? `\nCUSTOMER VOICE (authentic language from real buyers — let this inform mood and messaging):\n${ctx.productReviews.slice(0, 3).map((r, i) => `${i + 1}. "${r}"`).join('\n')}`
      : ''

  // Strategy context drives the prompt — highest priority
  const strategyContext = ctx.copyBrief
    ? `\nSLOT BRIEF (follow this precisely — it is based on actual customer review data):\n${ctx.copyBrief}`
    : ''
  const headlineContext = ctx.headline
    ? `\nHEADLINE ON THIS IMAGE (the scene must visually reinforce this message):\n"${ctx.headline}"`
    : ''

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a world-class creative director specializing in Amazon A+ content. Your job is to write an image generation prompt that will produce jaw-dropping, conversion-driving visuals.

PRODUCT INFO:
- Name: ${ctx.productName}
${ctx.brandName ? `- Brand: ${ctx.brandName}` : ''}
${ctx.category ? `- Category: ${ctx.category}` : ''}
${ctx.keyFeatures?.length ? `- Key Features: ${ctx.keyFeatures.slice(0, 5).join('; ')}` : ''}
${ctx.targetAudience ? `- Target Audience: ${ctx.targetAudience}` : ''}
${ctx.contentTone ? `- Brand Tone: ${ctx.contentTone}` : ''}
${ctx.brandColors?.length ? `- Brand Colors: ${ctx.brandColors.filter(Boolean).join(', ')}` : ''}
${ctx.description ? `- Description: ${ctx.description.substring(0, 300)}` : ''}
${reviewContext}

FORMAT: ${FORMAT_BASE[ctx.format]}
${intentGuidance ? `\nCREATIVE INTENT: ${intentGuidance}` : ''}${strategyContext}${headlineContext}

MODEL INSTRUCTIONS:
${modelHint}

RULES:
1. Be HYPER-SPECIFIC to this product — no generic photography language
2. Describe scene elements, lighting quality, atmosphere, and mood concretely
3. *** ABSOLUTELY NO TEXT, WORDS, LABELS, NUMBERS, OR TYPOGRAPHY IN THE IMAGE *** — all text is added via code overlay. Do not describe any text, signs, labels, or writing — not even "before/after" labels.
4. *** NO UI ELEMENTS, ICONS, ARROWS, OR GRAPHIC OVERLAYS *** in the generated image.
5. Think like a Tier-1 luxury brand art director: what PURE VISUAL SCENE would make a customer feel something?
6. The image will have text overlaid by code — ensure the composition has clean, low-clutter zones for text readability (see FORMAT section above).
7. Return ONLY the scene description prompt — no explanation, no quotes, no prefix like "Prompt:"`,
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    return text || buildFallbackPrompt(ctx)
  } catch (err) {
    console.error('[prompt] Optimization failed, using fallback:', err)
    return buildFallbackPrompt(ctx)
  }
}

// ─── Fallback (no Claude API key) ────────────────────────────────────────────

function buildFallbackPrompt(ctx: PromptContext): string {
  const toneMap: Record<string, string> = {
    professional: 'clean, modern, professional',
    lifestyle: 'warm, natural, lifestyle-oriented',
    luxury: 'elegant, premium, luxurious',
    technical: 'precise, detailed, technical',
    playful: 'vibrant, energetic, fun',
  }

  const intentExtra: Partial<Record<ImageIntent, string>> = {
    lifestyle: 'aspirational in-use scene, warm natural light',
    benefit: 'dramatic composition symbolizing transformation',
    how_it_works: 'clean workspace, soft neutral tones, negative space',
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
