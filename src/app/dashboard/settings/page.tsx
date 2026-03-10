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
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account and subscription
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Account</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{profile?.full_name ?? '\u2014'}</span>
            </div>
          </div>
        </section>

        <SubscriptionSection
          tier={(profile?.subscription_tier as 'free' | 'pro' | 'agency') ?? 'free'}
          status={(profile?.subscription_status as 'inactive' | 'active' | 'canceled' | 'past_due') ?? 'inactive'}
          creditsRemaining={profile?.credits_remaining ?? 0}
          hasStripeCustomer={!!profile?.stripe_customer_id}
        />
      </div>
    </div>
  )
}
