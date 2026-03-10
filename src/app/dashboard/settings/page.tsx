import { createClient } from '@/lib/supabase/server'
import { SubscriptionSection } from './subscription'
import type { Profile } from '@/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const profile = profileData as Profile | null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account and subscription.
      </p>

      <div className="mt-10 space-y-8">
        {/* Account */}
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Account
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: 'Email', value: user?.email },
              { label: 'Name', value: profile?.full_name ?? '\u2014' },
              {
                label: 'Member since',
                value: profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : '\u2014',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-3.5 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <SubscriptionSection
          tier={
            (profile?.subscription_tier as 'free' | 'pro' | 'agency') ?? 'free'
          }
          status={
            (profile?.subscription_status as
              | 'inactive'
              | 'active'
              | 'canceled'
              | 'past_due') ?? 'inactive'
          }
          creditsRemaining={profile?.credits_remaining ?? 0}
          hasStripeCustomer={!!profile?.stripe_customer_id}
        />
      </div>
    </div>
  )
}
