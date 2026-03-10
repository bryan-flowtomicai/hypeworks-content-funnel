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
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to projects
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.product_name ?? 'No product name'}
            {project.brand_name ? ` \u2014 ${project.brand_name}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateButton projectId={project.id} />
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {[
          { label: 'Status', value: project.status },
          { label: 'Category', value: project.category ?? '\u2014' },
          { label: 'Tone', value: project.content_tone },
          { label: 'Images', value: String(completedImages.length) },
        ].map((item) => (
          <div key={item.label} className="bg-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm font-medium capitalize">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Key features */}
      {project.key_features?.length > 0 && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Key features
          </h2>
          <ul className="mt-3 space-y-1.5">
            {project.key_features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Images */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Generated images
        </h2>

        {!completedImages.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-border py-20 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No images yet. Click &quot;Generate&quot; to create A+ content.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedImages.map((img) => {
              const spec =
                IMAGE_FORMATS[img.format_type as keyof typeof IMAGE_FORMATS]
              return (
                <div
                  key={img.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/20"
                >
                  {img.public_url && (
                    <div className="relative">
                      <img
                        src={img.public_url}
                        alt={img.format_type}
                        className="aspect-video w-full object-cover"
                      />
                      {img.public_url && (
                        <a
                          href={img.public_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 top-2 rounded-md bg-black/60 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium capitalize">
                      {img.format_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {spec
                        ? `${spec.width} \u00D7 ${spec.height}px`
                        : `${img.width} \u00D7 ${img.height}px`}
                    </p>
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
