'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/shared/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async (tier: 'pro' | 'agency') => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to start checkout')
      if (result.url) {
        window.location.href = result.url
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  const openPortal = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to open billing portal')
      if (result.url) {
        window.location.href = result.url
      }
    } catch (portalError) {
      setError(portalError instanceof Error ? portalError.message : 'Portal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        authenticated
        onSignOut={async () => {
          await supabase.auth.signOut()
          router.push('/auth/signin')
        }}
      />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Subscription settings</CardTitle>
            <CardDescription>
              Upgrade plans or manage billing through Stripe customer portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button disabled={loading} onClick={() => startCheckout('pro')}>
              Upgrade to Pro
            </Button>
            <Button variant="outline" disabled={loading} onClick={() => startCheckout('agency')}>
              Upgrade to Agency
            </Button>
            <Button variant="ghost" disabled={loading} onClick={openPortal}>
              Open billing portal
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to dashboard
            </Button>
          </CardContent>
        </Card>
        {error && (
          <p className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </main>
    </div>
  )
}
