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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All your A+ content projects
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      {!typedProjects.length ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No projects yet. Create your first one to get started.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-3 w-3" /> Create project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    project.status === 'complete'
                      ? 'bg-green-500/10 text-green-400'
                      : project.status === 'generating'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {project.status === 'generating' && (
                    <Sparkles className="h-3 w-3" />
                  )}
                  {project.status}
                </span>
              </div>
              {project.product_name && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.product_name}
                </p>
              )}
              {project.brand_name && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {project.brand_name}
                </p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
