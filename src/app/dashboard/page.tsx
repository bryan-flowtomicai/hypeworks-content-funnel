'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FolderClock, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppHeader } from '@/components/shared/app-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLoader } from '@/components/shared/loading-states'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

type Submission = Database['public']['Tables']['submissions']['Row']

export default function Dashboard() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/signin')
        return
      }

      setUser(session.user)

      // Fetch user submissions
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setSubmissions(data || [])
      }

      setLoading(false)
    }

    getSession()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  if (loading) {
    return <PageLoader label="Loading dashboard..." />
  }

  const completed = submissions.filter((s) => s.status === 'completed').length
  const processing = submissions.filter((s) => s.status === 'processing').length

  return (
    <div className="min-h-screen">
      <AppHeader authenticated onSignOut={handleLogout} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back{user?.email ? `, ${user.email}` : ''}</CardTitle>
              <CardDescription>
                Manage projects, monitor generation status, and launch new A+ modules.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New project
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">View product site</Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost">Billing settings</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Plan snapshot</CardTitle>
              <CardDescription>Free tier currently active.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3 text-sm text-[var(--text-muted)]">
                Upgrade to Pro for higher generation limits and all format types.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Total projects
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{submissions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Completed</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--success)]">{completed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Generating</p>
              <p className="mt-2 text-3xl font-semibold text-amber-500">{processing}</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--text)]">Recent projects</h2>
            <Badge>{submissions.length} records</Badge>
          </div>
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <FolderClock className="h-8 w-8 text-[var(--text-muted)]" />
                <p className="max-w-sm text-sm text-[var(--text-muted)]">
                  No projects yet. Create your first project to generate Amazon-ready A+ visuals.
                </p>
                <Link href="/dashboard/create">
                  <Button>Create first project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {submissions.map((submission) => (
                <Card key={submission.id} className="transition hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">
                        {submission.product_url || 'Untitled product project'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Created {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.status === 'completed' && <Badge variant="success">Completed</Badge>}
                      {submission.status === 'processing' && <Badge variant="warning">Generating</Badge>}
                      {submission.status === 'pending' && <Badge>Draft</Badge>}
                      {submission.status === 'failed' && <Badge variant="danger">Failed</Badge>}
                      <Link href={`/dashboard/submission/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
