'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  TIER_LIMITS,
  type SubscriptionTier,
  type SubscriptionStatus,
} from '@/types'
import { Loader2 } from 'lucide-react'

export function SubscriptionSection({
  tier,
  status,
  creditsRemaining,
  hasStripeCustomer,
}: {
  tier: SubscriptionTier
  status: SubscriptionStatus
  creditsRemaining: number
  hasStripeCustomer: boolean
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const limits = TIER_LIMITS[tier]

  async function handleUpgrade(priceEnv: string) {
    setLoading(priceEnv)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceEnv }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  async function handleManage() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider">
          Subscription
        </h2>
      </div>
      <div className="divide-y divide-border">
        {[
          { label: 'Plan', value: tier, highlight: tier !== 'free' },
          { label: 'Status', value: status },
          {
            label: 'Credits remaining',
            value:
              limits.generations === null
                ? 'Unlimited'
                : String(creditsRemaining),
          },
          {
            label: 'Monthly limit',
            value:
              limits.generations === null
                ? 'Unlimited'
                : String(limits.generations),
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm sm:px-6"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span
              className={`font-medium capitalize ${
                'highlight' in row && row.highlight ? 'text-primary' : ''
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-border px-4 py-5 sm:flex-row sm:flex-wrap sm:px-6">
        {tier === 'free' && (
          <>
            <Button
              size="sm"
              onClick={() => handleUpgrade('pro')}
              disabled={loading !== null}
            >
              {loading === 'pro' ? (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              ) : null}
              UPGRADE TO PRO &mdash; $29/mo
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpgrade('agency')}
              disabled={loading !== null}
            >
              {loading === 'agency' ? (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              ) : null}
              UPGRADE TO AGENCY &mdash; $99/mo
            </Button>
          </>
        )}

        {hasStripeCustomer && tier !== 'free' && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManage}
            disabled={loading !== null}
          >
            {loading === 'portal' ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : null}
            MANAGE SUBSCRIPTION
          </Button>
        )}
      </div>
    </section>
  )
}
