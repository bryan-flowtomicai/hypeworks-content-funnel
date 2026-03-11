import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 90

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Anthropic API not configured' }, { status: 500 })
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const scraped = project.scraped_data as Record<string, unknown> | null
  const imageUrls = (scraped?.product_images as string[]) ?? []

  if (!imageUrls.length) {
    return NextResponse.json(
      { error: 'No product images found. Make sure to scrape the Amazon URL first.' },
      { status: 400 }
    )
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Build image content blocks — Claude supports up to 5 images per message
  const imageBlocks: Anthropic.ImageBlockParam[] = imageUrls.slice(0, 5).map((url) => ({
    type: 'image',
    source: { type: 'url', url },
  }))

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          ...imageBlocks,
          {
            type: 'text',
            text: `You are an Amazon conversion rate optimization expert. Analyze these ${imageUrls.length} product listing images.

Score this listing against the 5 buyer questions every Amazon image must answer:
1. What is this? (product clarity)
2. Why do I want it? (benefit communication)
3. How does it work? (mechanism/differentiation)
4. Why is it better? (competitive advantage)
5. Can I trust it? (social proof/authority)

Also evaluate coverage of the 7-image Amazon framework:
- Hero/lifestyle image
- Big benefit image
- How it works
- Ingredient or feature breakdown
- Before/after or problem vs. solution
- Competitor comparison
- Social proof / trust

Return ONLY valid JSON (no markdown, no explanation):
{
  "overall_score": <0-100 integer>,
  "current_grade": "<A|B|C|D|F>",
  "estimated_conversion_lift": "<X-Y%>",
  "image_scores": [
    {
      "image_number": <1-based index>,
      "type": "<what type of image this appears to be>",
      "score": <0-100>,
      "what_works": "<one sentence>",
      "gap": "<which buyer question it fails to answer, or 'none'>"
    }
  ],
  "missing_slots": ["<image types missing from the 7-image framework>"],
  "top_recommendations": [
    "<specific actionable improvement 1>",
    "<specific actionable improvement 2>",
    "<specific actionable improvement 3>"
  ],
  "brand_voice_detected": "<brief description of current brand tone>"
}`,
          },
        ],
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const analysis = JSON.parse(jsonMatch[0])

    // Persist analysis into scraped_data
    await supabase
      .from('projects')
      .update({
        scraped_data: {
          ...(scraped ?? {}),
          analysis,
          analyzed_at: new Date().toISOString(),
        },
      })
      .eq('id', projectId)
      .eq('user_id', user.id)

    return NextResponse.json(analysis)
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse analysis response' },
      { status: 500 }
    )
  }
}
