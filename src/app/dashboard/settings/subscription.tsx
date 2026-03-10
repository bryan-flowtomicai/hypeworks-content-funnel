'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TIER_LIMITS, type SubscriptionTier, type SubscriptionStatus } from '@/types'

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
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Subscription</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium capitalize">{tier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="capitalize">{status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Credits remaining</span>
          <span>
            {limits.generations === null ? 'Unlimited' : creditsRemaining}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tier === 'free' && (
          <>
            <Button
              size="sm"
              onClick={() => handleUpgrade('pro')}
              disabled={loading !== null}
            >
              {loading === 'pro' ? 'Loading...' : 'Upgrade to Pro — $29/mo'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpgrade('agency')}
              disabled={loading !== null}
            >
              {loading === 'agency' ? 'Loading...' : 'Upgrade to Agency — $99/mo'}
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
            {loading === 'portal' ? 'Loading...' : 'Manage subscription'}
          </Button>
        )}
      </div>
    </section>
  )
}
