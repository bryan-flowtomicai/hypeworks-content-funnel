import { NextRequest, NextResponse } from 'next/server'
import * as fal from '@fal-ai/serverless-client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface ImageGenerationResult {
  formatType: string
  imageUrl: string
  prompt: string
  width: number
  height: number
}

interface SelectedFormat {
  id: string
  width: number
  height: number
}

const defaultFormats: SelectedFormat[] = [
  { id: 'standard', width: 970, height: 300 },
  { id: 'hero', width: 970, height: 600 },
  { id: 'square', width: 600, height: 600 },
]

const safeString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback

const safeList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []

const getImageUrl = (result: unknown): string | null => {
  if (!result || typeof result !== 'object') return null
  const output = result as Record<string, unknown>
  const images = output.images as Array<{ url?: string }> | undefined
  if (Array.isArray(images) && images[0]?.url) return images[0].url
  const data = output.data as { images?: Array<{ url?: string }> } | undefined
  if (data?.images?.[0]?.url) return data.images[0].url
  return null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const submissionId = safeString(body.submissionId)
    const payload = (body.productData || {}) as Record<string, unknown>

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 })
    }
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'FAL_KEY is not configured' }, { status: 500 })
    }

    fal.config({ credentials: process.env.FAL_KEY })

    const productName = safeString(payload.product_name, 'Unnamed product')
    const brandName = safeString(payload.brand_name, 'Brand')
    const category = safeString(payload.category, 'General')
    const targetAudience = safeString(payload.target_audience, 'Amazon shoppers')
    const tone = safeString(payload.content_tone, 'Professional')
    const description = safeString(payload.description, '').slice(0, 1200)
    const keyFeatures = safeList(payload.key_features).join('; ')
    const brandColors = safeList(payload.brand_colors).join(', ')
    const selectedFormats = Array.isArray(payload.selected_formats)
      ? payload.selected_formats
          .map((format) => format as SelectedFormat)
          .filter((format) => format?.id && format?.width && format?.height)
      : defaultFormats

    await supabase
      .from('submissions')
      .update({ status: 'processing' })
      .eq('id', submissionId)
      .eq('user_id', session.user.id)

    const generatedImages: ImageGenerationResult[] = []

    for (const format of selectedFormats) {
      const constructedPrompt = `
Product: ${productName} by ${brandName}
Category: ${category}
Key Features: ${keyFeatures}
Target Audience: ${targetAudience}
Tone: ${tone}
Brand Colors: ${brandColors || 'brand-consistent palette'}
Format: Amazon A+ content module at ${format.width}x${format.height}px (${format.id})
Additional Context: ${description}
Style: Premium e-commerce product photography, clean composition, conversion-focused messaging layout.
      `.trim()

      try {
        const result = (await fal.subscribe('fal-ai/flux/dev', {
          input: {
            prompt: constructedPrompt,
            image_size: {
              width: format.width,
              height: format.height,
            },
            num_images: 1,
          },
          pollInterval: 3000,
        })) as { data?: unknown }

        const imageUrl = getImageUrl(result?.data)
        if (imageUrl) {
          generatedImages.push({
            formatType: format.id,
            imageUrl,
            prompt: constructedPrompt,
            width: format.width,
            height: format.height,
          })
        }
      } catch (formatError) {
        console.error(`fal generation failed for ${format.id}`, formatError)
      }
    }

    if (generatedImages.length === 0) {
      await supabase
        .from('submissions')
        .update({ status: 'failed' })
        .eq('id', submissionId)
        .eq('user_id', session.user.id)
      return NextResponse.json(
        { error: 'No images were generated successfully' },
        { status: 502 }
      )
    }

    await supabase
      .from('submissions')
      .update({
        generated_images: generatedImages.map((img) => img.imageUrl),
        status: 'completed',
      })
      .eq('id', submissionId)
      .eq('user_id', session.user.id)

    return NextResponse.json({
      success: true,
      generatedImages,
      submissionId,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    )
  }
}
