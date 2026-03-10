import Link from 'next/link'
import { ArrowRight, Zap, Image, Palette } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Hypeworks</span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          AI-powered content generation for Amazon sellers
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          A+ Content that
          <br />
          <span className="text-primary">converts</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Generate professional, brand-consistent A+ content images for your
          Amazon listings in minutes. Powered by AI, designed for sellers.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-11 items-center rounded-md border border-border px-6 text-base font-medium hover:bg-secondary transition-colors"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          5 free generations — no credit card required
        </p>
      </section>

      <section id="features" className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <Zap className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">Lightning fast</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate complete A+ content sets in under a minute. No designer
              needed.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Image className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">Amazon-ready formats</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Output images in exact Amazon A+ module dimensions — hero, standard,
              square, and more.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Palette className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-lg font-semibold">Brand-consistent</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Match your brand colors, tone, and visual identity across every
              generated image.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            Start free, upgrade when you need more.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'Try it out',
                features: [
                  '5 total generations',
                  '2 projects',
                  'Standard format only',
                ],
              },
              {
                name: 'Pro',
                price: '$29',
                desc: '/month',
                features: [
                  '100 generations/month',
                  'Unlimited projects',
                  'All formats',
                  'URL scraping',
                  'Batch download',
                ],
                highlight: true,
              },
              {
                name: 'Agency',
                price: '$99',
                desc: '/month',
                features: [
                  'Unlimited generations',
                  'Unlimited projects',
                  'All formats',
                  'Priority queue',
                  'Batch download',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 ${
                  plan.highlight
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.desc}
                  </span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f}>&#x2713; {f}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 block rounded-md py-2 text-center text-sm font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border hover:bg-secondary'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Hypeworks. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
