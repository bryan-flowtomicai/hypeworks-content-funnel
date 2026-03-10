import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, FolderOpen, Sparkles, ArrowRight } from 'lucide-react'
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {typedProfile?.full_name
              ? `Welcome back, ${typedProfile.full_name}`
              : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your A+ content at a glance.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Projects
          </p>
          <p className="mt-2 text-3xl font-extrabold">{typedProjects.length}</p>
        </div>
        <div className="bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Images generated
          </p>
          <p className="mt-2 text-3xl font-extrabold">{totalImages ?? 0}</p>
        </div>
        <div className="bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Credits remaining
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {typedProfile?.subscription_tier === 'agency'
              ? '\u221E'
              : (typedProfile?.credits_remaining ?? 0)}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-primary">
            {typedProfile?.subscription_tier ?? 'free'} plan
          </p>
        </div>
      </div>

      {/* Recent projects */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {!typedProjects.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-border py-20 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-subtle" />
            <p className="mt-3 text-sm text-muted-foreground">
              No projects yet.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {typedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.product_name ?? 'No product name'} &middot;{' '}
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                    project.status === 'complete'
                      ? 'bg-primary/10 text-primary'
                      : project.status === 'generating'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-white/5 text-muted-foreground'
                  }`}
                >
                  {project.status === 'generating' && (
                    <Sparkles className="mr-1 inline h-3 w-3" />
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
