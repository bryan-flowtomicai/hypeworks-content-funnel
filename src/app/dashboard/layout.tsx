import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardTabs } from '@/components/dashboard-tabs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen pb-16 sm:pb-0">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-10">
            <Link
              href="/dashboard"
              className="text-sm font-extrabold uppercase tracking-widest"
            >
              Hypeworks
            </Link>
            <div className="hidden items-center gap-6 sm:flex">
              {[
                { href: '/dashboard', label: 'Overview' },
                { href: '/dashboard/projects', label: 'Projects' },
                { href: '/dashboard/settings', label: 'Settings' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-subtle sm:inline">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </main>
      <DashboardTabs />
    </div>
  )
}
