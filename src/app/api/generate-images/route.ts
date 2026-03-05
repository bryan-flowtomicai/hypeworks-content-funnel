import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface GenerateImagesRequest {
  userId: string
  submissionId: string
  productTitle: string
  productDescription: string
  brandColors?: string[]
  companyName?: string
}

interface ImageGenerationResult {
  module: string
  imageUrl: string
  prompt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImagesRequest = await request.json()
    const {
      userId,
      submissionId,
      productTitle,
      productDescription,
      brandColors,
      companyName,
    } = body

    if (!userId || !submissionId || !productTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const kieApiKey = process.env.KIE_API_KEY
    if (!kieApiKey) {
      return NextResponse.json(
        { error: 'KIE API key not configured' },
        { status: 500 }
      )
    }

    // Define prompts for each A+ module
    const prompts = {
      hero: `Create a hero image for Amazon A+ content. Product: ${productTitle}. Style: professional, engaging, with clean design. Brand colors: ${brandColors?.join(', ') || 'blue and white'}.`,
      features: `Create an infographic showing product features for: ${productTitle}. Features: ${productDescription.substring(0, 200)}. Style: modern, clean, with icons.`,
      comparison: `Create a comparison chart image for ${productTitle} vs competitors. Highlight key advantages. Style: professional, easy to scan.`,
      lifestyle: `Create a lifestyle image showing ${productTitle} in use. Company: ${companyName || 'the brand'}. Style: aspirational, professional.`,
      grid: `Create a 2x2 grid showcasing ${productTitle} details and benefits. Style: modern, clean, branded.`,
    }

    // Initialize Supabase inside the handler
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const generatedImages: ImageGenerationResult[] = []

    // Generate images for each module
    for (const [module, prompt] of Object.entries(prompts)) {
      try {
        const response = await fetch('https://api.kie.ai/v1/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${kieApiKey}`,
          },
          body: JSON.stringify({
            prompt,
            size: '1024x1024',
            model: 'default',
            quality: 'high',
          }),
        })

        if (!response.ok) {
          console.error(`Failed to generate ${module} image`)
          continue
        }

        const data = await response.json()
        const imageUrl = data.data?.[0]?.url

        if (imageUrl) {
          generatedImages.push({
            module,
            imageUrl,
            prompt,
          })

          // Store in Supabase
          const { error: updateError } = await supabase
            .from('submissions')
            .update({
              generated_images: [...(generatedImages.map((img) => img.imageUrl))],
            })
            .eq('id', submissionId)

          if (updateError) {
            console.error('Failed to store image:', updateError)
          }
        }
      } catch (error) {
        console.error(`Error generating ${module} image:`, error)
      }
    }

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
