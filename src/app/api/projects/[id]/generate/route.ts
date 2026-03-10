import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/admin'
import { generateImage, buildPrompt } from '@/lib/fal/generate'
import { IMAGE_FORMATS, type ImageFormatType } from '@/types'

export const maxDuration = 60

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const admin = createServiceRoleClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  await supabase
    .from('projects')
    .update({ status: 'generating' })
    .eq('id', projectId)

  const results: Array<{ format: string; status: string; imageUrl?: string }> = []

  for (const format of formats) {
    const spec = IMAGE_FORMATS[format]
    if (!spec) continue

    const prompt = buildPrompt({
      productName: project.product_name ?? project.name,
      brandName: project.brand_name ?? undefined,
      category: project.category ?? undefined,
      keyFeatures: project.key_features,
      targetAudience: project.target_audience ?? undefined,
      contentTone: project.content_tone,
      brandColors: project.brand_colors,
      scrapedDescription:
        (project.scraped_data as Record<string, string> | null)?.description ??
        project.description ??
        undefined,
      formatLabel: spec.label,
      width: spec.width,
      height: spec.height,
    })

    try {
      const { imageUrl, requestId } = await generateImage({
        prompt,
        width: spec.width,
        height: spec.height,
      })

      const storagePath = `${user.id}/${projectId}/generated/${Date.now()}-${format}.png`

      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()

      await admin.storage
        .from('generated-images')
        .upload(storagePath, imageBuffer, { contentType: 'image/png' })

      const {
        data: { publicUrl },
      } = admin.storage.from('generated-images').getPublicUrl(storagePath)

      await admin.from('generated_images').insert({
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

      results.push({ format, status: 'complete', imageUrl: publicUrl })
    } catch (err) {
      console.error(`Generation failed for format ${format}:`, err)

      await admin.from('generated_images').insert({
        project_id: projectId,
        user_id: user.id,
        storage_path: '',
        format_type: format,
        width: spec.width,
        height: spec.height,
        prompt_used: '',
        status: 'failed',
      })

      results.push({ format, status: 'failed' })
    }
  }

  const successCount = results.filter((r) => r.status === 'complete').length

  if (profile.subscription_tier === 'free' && successCount > 0) {
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

  return NextResponse.json({ results })
}
