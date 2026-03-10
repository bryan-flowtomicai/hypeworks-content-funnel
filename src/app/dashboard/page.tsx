import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, FolderOpen, Sparkles } from 'lucide-react'
import type { Profile, Project } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const typedProfile = profile as Profile | null

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const typedProjects = (projects ?? []) as Project[]

  const { count: totalImages } = await supabase
    .from('generated_images')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('status', 'complete')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back
            {typedProfile?.full_name ? `, ${typedProfile.full_name}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your A+ content projects
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Projects
          </p>
          <p className="mt-2 text-2xl font-bold">{typedProjects.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Images generated
          </p>
          <p className="mt-2 text-2xl font-bold">{totalImages ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Credits remaining
          </p>
          <p className="mt-2 text-2xl font-bold">
            {typedProfile?.subscription_tier === 'agency'
              ? '\u221E'
              : (typedProfile?.credits_remaining ?? 0)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground capitalize">
            {typedProfile?.subscription_tier ?? 'free'} plan
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>

        {!typedProjects.length ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No projects yet.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {typedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.product_name ?? 'No product name'} &middot;{' '}
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
