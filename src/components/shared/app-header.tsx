'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  authenticated?: boolean
  onSignOut?: () => void
}

export function AppHeader({ authenticated = false, onSignOut }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--bg-elevated)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none text-[var(--text)]">A+ Content Studio</p>
            <p className="text-xs text-[var(--text-muted)]">Amazon-ready visual modules</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authenticated ? (
            <Button variant="outline" size="sm" onClick={onSignOut}>
              Sign out
            </Button>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
