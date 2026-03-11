import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { GeneratedImage } from '@/types'
import { ProjectDetail } from './ProjectDetail'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projectData } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!projectData) notFound()

  const { data: imagesData } = await supabase
    .from('generated_images')
    .select('*')
    .eq('project_id', id)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <ProjectDetail
      project={projectData}
      images={(imagesData ?? []) as GeneratedImage[]}
    />
  )
}

