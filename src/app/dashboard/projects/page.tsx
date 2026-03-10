import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, FolderOpen, Sparkles } from 'lucide-react'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const typedProjects = (projects ?? []) as Project[]

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {typedProjects.length} project{typedProjects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      {!typedProjects.length ? (
        <div className="mt-8 rounded-xl border border-dashed border-border py-20 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-subtle" />
          <p className="mt-3 text-sm text-muted-foreground">
            No projects yet. Create one to start generating A+ content.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Create project
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold transition-colors group-hover:text-primary">
                  {project.name}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    project.status === 'complete'
                      ? 'bg-primary/10 text-primary'
                      : project.status === 'generating'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-white/5 text-muted-foreground'
                  }`}
                >
                  {project.status === 'generating' && (
                    <Sparkles className="mr-0.5 inline h-3 w-3" />
                  )}
                  {project.status}
                </span>
              </div>
              {project.product_name && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.product_name}
                </p>
              )}
              {project.brand_name && (
                <p className="text-xs text-muted-foreground">
                  {project.brand_name}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-subtle">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
                {project.content_tone && (
                  <span className="text-[10px] uppercase tracking-wider text-subtle">
                    {project.content_tone}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
