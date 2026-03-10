'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4">
            {[
              { href: '#capabilities', label: 'Capabilities' },
              { href: '#how-it-works', label: 'How it Works' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#faq', label: 'FAQ' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link
                href="/login"
                className="flex-1 rounded-md border border-border py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-md bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
