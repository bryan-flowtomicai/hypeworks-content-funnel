'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, Settings } from 'lucide-react'

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function DashboardTabs() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-black/95 backdrop-blur-xl sm:hidden">
      <div className="flex">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
