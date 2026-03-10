'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type APlusFormat =
  | 'standard'
  | 'hero'
  | 'square'
  | 'portrait'
  | 'banner_wide'

export const FORMAT_OPTIONS: Array<{
  id: APlusFormat
  title: string
  description: string
  width: number
  height: number
  amazonReady: boolean
}> = [
  {
    id: 'standard',
    title: 'Standard Image + Text',
    description: 'General purpose module for key product messaging.',
    width: 970,
    height: 300,
    amazonReady: true,
  },
  {
    id: 'hero',
    title: 'Hero Module',
    description: 'High-impact hero image with headline placement.',
    width: 970,
    height: 600,
    amazonReady: true,
  },
  {
    id: 'square',
    title: 'Square Highlight',
    description: 'Square visual for feature-focused product frames.',
    width: 600,
    height: 600,
    amazonReady: true,
  },
  {
    id: 'portrait',
    title: 'Portrait Story',
    description: 'Tall card useful for before/after or benefits stacks.',
    width: 300,
    height: 400,
    amazonReady: true,
  },
  {
    id: 'banner_wide',
    title: 'Wide Banner',
    description: 'Slim top/bottom banner for promotions and claims.',
    width: 970,
    height: 130,
    amazonReady: true,
  },
]

interface FormatSelectorProps {
  selected: APlusFormat[]
  onChange: (formats: APlusFormat[]) => void
}

export function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  const toggle = (id: APlusFormat) => {
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id))
      return
    }
    onChange([...selected, id])
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {FORMAT_OPTIONS.map((format) => {
        const active = selected.includes(format.id)
        return (
          <button
            type="button"
            key={format.id}
            onClick={() => toggle(format.id)}
            className={cn(
              'rounded-2xl border p-4 text-left transition-all',
              active
                ? 'border-[var(--brand)] bg-[var(--brand)]/10 shadow-lg shadow-indigo-500/10'
                : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--brand)]/50'
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text)]">{format.title}</p>
              {format.amazonReady && <Badge variant="success">Amazon A+ Ready</Badge>}
            </div>
            <p className="text-xs text-[var(--text-muted)]">{format.description}</p>
            <p className="mt-3 text-xs font-medium text-[var(--text)]">
              {format.width} x {format.height}px
            </p>
          </button>
        )
      })}
    </div>
  )
}
