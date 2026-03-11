import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { generateBackground } from '@/lib/fal/generate'
import { generateOptimizedPrompt } from '@/lib/fal/prompt'
import { renderTemplate } from '@/lib/templates'
import type { TemplateData } from '@/lib/templates'
import type { ImageIntent } from '@/lib/templates/types'
import { IMAGE_FORMATS, type ImageFormatType } from '@/types'

// Assign a diverse set of intents when generating multiple formats.
// Each format gets a different creative goal so images tell varied stories.
const FORMAT_DEFAULT_INTENTS: Record<ImageFormatType, ImageIntent> = {
  hero: 'lifestyle',
  standard: 'how_it_works',
  square: 'benefit',
  portrait: 'social_proof',
  banner_wide: 'lifestyle',
}

// When multiple of the same format type are requested, cycle through these
const INTENT_CYCLE: ImageIntent[] = [
  'lifestyle',
  'benefit',
  'how_it_works',
  'feature_grid',
  'social_proof',
  'problem_solution',
  'comparison',
]

function assignIntents(formats: ImageFormatType[]): Map<number, ImageIntent> {
  const map = new Map<number, ImageIntent>()
  const usedIntents = new Set<ImageIntent>()

  formats.forEach((format, i) => {
    const defaultIntent = FORMAT_DEFAULT_INTENTS[format]
    if (!usedIntents.has(defaultIntent)) {
      map.set(i, defaultIntent)
      usedIntents.add(defaultIntent)
    } else {
      // Pick next unused intent from cycle
      const next = INTENT_CYCLE.find((intent) => !usedIntents.has(intent)) ?? defaultIntent
      map.set(i, next)
      usedIntents.add(next)
    }
  })

  return map
}

export const maxDuration = 300

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      )
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: missing FAL_KEY' },
        { status: 500 }
      )
    }

    const admin = createServiceRoleClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin emails bypass all credit checks
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isAdmin = adminEmails.includes((user.email ?? '').toLowerCase())

    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const formats: ImageFormatType[] = body.formats ?? ['hero']

    if (
      !isAdmin &&
      profile.subscription_tier === 'free' &&
      profile.credits_remaining < formats.length
    ) {
      return NextResponse.json(
        { error: 'Insufficient credits. Upgrade your plan to continue.' },
        { status: 403 }
      )
    }

    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId)

    const scraped = project.scraped_data as Record<string, unknown> | null
    const productReviews = (scraped?.product_reviews as string[]) ?? []

    // Assign diverse intents upfront so each image tells a different story
    const intentMap = assignIntents(formats)

    // ── Run all formats in parallel ──────────────────────────────────────
    const settled = await Promise.allSettled(
      formats.map(async (format, idx) => {
        const spec = IMAGE_FORMATS[format]
        if (!spec) throw new Error(`Unknown format: ${format}`)

        const intent = intentMap.get(idx)

        // Randomly pick a review highlight for social_proof intents
        const reviewHighlight =
          productReviews.length > 0
            ? productReviews[idx % productReviews.length]
            : undefined

        // Phase 1: Generate optimized prompt via Claude (with intent + reviews)
        const prompt = await generateOptimizedPrompt({
          productName: project.product_name ?? project.name,
          brandName: project.brand_name ?? undefined,
          category: project.category ?? undefined,
          keyFeatures: project.key_features,
          targetAudience: project.target_audience ?? undefined,
          contentTone: project.content_tone,
          brandColors: project.brand_colors,
          description:
            (scraped?.description as string) ??
            project.description ??
            undefined,
          productReviews: productReviews.length > 0 ? productReviews : undefined,
          intent,
          format,
          width: spec.width,
          height: spec.height,
        })

        // Phase 1b: Generate background image via fal.ai
        let backgroundImageUrl: string | null = null
        let requestId = ''
        let modelUsed = 'none'

        if (prompt !== 'SKIP') {
          const bgResult = await generateBackground({
            prompt,
            width: spec.width,
            height: spec.height,
            format,
            brandColors: project.brand_colors,
          })

          if (bgResult) {
            backgroundImageUrl = bgResult.imageUrl
            requestId = bgResult.requestId
            modelUsed = bgResult.model
          }
        }

        // Phase 2: Composite via Satori + resvg
        const templateData: TemplateData = {
          format,
          intent,
          productName: project.product_name ?? project.name,
          displayTitle: (scraped?.display_title as string) || undefined,
          tagline: (scraped?.tagline as string) || undefined,
          brandName: project.brand_name ?? undefined,
          keyFeatures: project.key_features ?? [],
          description: project.description ?? undefined,
          targetAudience: project.target_audience ?? undefined,
          contentTone: project.content_tone,
          brandColors: project.brand_colors ?? [],
          backgroundImageUrl,
          reviewHighlight,
        }

        const finalPng = await renderTemplate(templateData)

        // Upload to Supabase Storage — use format + random suffix to avoid collisions
        const storagePath = `${user.id}/${projectId}/generated/${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${format}.png`

        const { error: uploadError } = await admin.storage
          .from('generated-images')
          .upload(storagePath, finalPng, { contentType: 'image/png' })

        if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

        const { data: { publicUrl } } = admin.storage
          .from('generated-images')
          .getPublicUrl(storagePath)

        const { error: insertError } = await admin
          .from('generated_images')
          .insert({
            project_id: projectId,
            user_id: user.id,
            storage_path: storagePath,
            public_url: publicUrl,
            format_type: format,
            width: spec.width,
            height: spec.height,
            prompt_used: prompt,
            fal_request_id: requestId,
            status: 'complete',
          })

        if (insertError) throw new Error(`DB insert failed: ${insertError.message}`)

        return { format, status: 'complete' as const, imageUrl: publicUrl, model: modelUsed }
      })
    )

    // Record failures in DB and build results array
    const results = await Promise.all(
      settled.map(async (result, i) => {
        if (result.status === 'fulfilled') return result.value

        const format = formats[i]
        const message = result.reason instanceof Error
          ? result.reason.message
          : 'Unknown generation error'

        console.error(`Generation failed for format ${format}:`, message)

        const spec = IMAGE_FORMATS[format]
        await admin.from('generated_images').insert({
          project_id: projectId,
          user_id: user.id,
          storage_path: '',
          format_type: format,
          width: spec?.width ?? 0,
          height: spec?.height ?? 0,
          prompt_used: '',
          status: 'failed',
        })

        return { format, status: 'failed' as const, error: message }
      })
    )

    const successCount = results.filter((r) => r.status === 'complete').length

    if (!isAdmin && profile.subscription_tier === 'free' && successCount > 0) {
      await admin
        .from('profiles')
        .update({
          credits_remaining: Math.max(
            0,
            profile.credits_remaining - successCount
          ),
        })
        .eq('id', user.id)
    }

    await supabase
      .from('projects')
      .update({ status: 'complete' })
      .eq('id', projectId)

    if (results.every((r) => r.status === 'failed')) {
      const firstError = results[0]?.error ?? 'All formats failed to generate'
      return NextResponse.json({ error: firstError, results }, { status: 500 })
    }

    return NextResponse.json({ results })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal server error'
    console.error('Generate route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
