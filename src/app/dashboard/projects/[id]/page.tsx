import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IMAGE_FORMATS, type Project, type GeneratedImage } from '@/types'
import { ArrowLeft, Download, Sparkles } from 'lucide-react'
import { GenerateButton, DeleteProjectButton } from './actions'

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

  const project = projectData as Project | null
  if (!project) notFound()

  const { data: imagesData } = await supabase
    .from('generated_images')
    .select('*')
    .eq('project_id', id)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const images = (imagesData ?? []) as GeneratedImage[]
  const completedImages = images.filter((img) => img.status === 'complete')

  return (
    <div>
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Back to projects
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.product_name ?? 'No product name'}
            {project.brand_name ? ` by ${project.brand_name}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateButton projectId={project.id} />
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Status</span>
          <p className="mt-1 font-medium capitalize">{project.status}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Category</span>
          <p className="mt-1 font-medium">{project.category ?? '\u2014'}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Tone</span>
          <p className="mt-1 font-medium capitalize">{project.content_tone}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <span className="text-muted-foreground">Images</span>
          <p className="mt-1 font-medium">{completedImages.length}</p>
        </div>
      </div>

      {project.key_features?.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Key features
          </h2>
          <ul className="space-y-1 text-sm">
            {project.key_features.map((f, i) => (
              <li key={i} className="text-muted-foreground">
                &bull; {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Generated images</h2>

        {!completedImages.length ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No images generated yet. Click &quot;Generate&quot; to create A+
              content images.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedImages.map((img) => {
              const spec =
                IMAGE_FORMATS[img.format_type as keyof typeof IMAGE_FORMATS]
              return (
                <div
                  key={img.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  {img.public_url && (
                    <img
                      src={img.public_url}
                      alt={img.format_type}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {img.format_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {spec
                          ? `${spec.width}x${spec.height}`
                          : `${img.width}x${img.height}`}
                      </p>
                    </div>
                    {img.public_url && (
                      <a
                        href={img.public_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 hover:bg-secondary transition-colors"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
