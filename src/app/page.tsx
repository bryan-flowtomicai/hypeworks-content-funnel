import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  ImageIcon,
  Palette,
  CheckCircle2,
  Upload,
  Sparkles,
  Download,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-extrabold uppercase tracking-widest">
            Hypeworks
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(200,255,0,0.05)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            AI-powered A+ content for Amazon
          </div>

          <h1 className="text-5xl font-black uppercase leading-[1.05] tracking-tight sm:text-7xl">
            A+ Content
            <br />
            <span className="text-primary">that converts.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Generate professional, brand-consistent A+ content images for your
            Amazon listings in minutes. No designer needed.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-base font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center rounded-md border border-border px-8 text-base font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted-foreground/60">
            5 free generations &middot; No credit card required
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {[
            { value: '<60s', label: 'Generation time' },
            { value: '5+', label: 'A+ formats' },
            { value: '100%', label: 'Amazon-spec ready' },
            { value: '0', label: 'Designers needed' },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <p className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            What you get
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Full-service A+ content. Built for performance.
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Complete A+ content sets generated in under a minute. Ship listings faster.',
              },
              {
                icon: ImageIcon,
                title: 'Amazon-Ready Formats',
                desc: 'Hero, standard, square, portrait, banner — exact pixel specs Amazon requires.',
              },
              {
                icon: Palette,
                title: 'Brand-Consistent',
                desc: 'Your colors, your tone, your identity — reflected in every generated image.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-card p-8 transition-colors hover:bg-white/[0.02]"
              >
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From product to A+ content in 4 steps.
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Input',
                desc: 'Add your product details, brand info, and paste your Amazon URL.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Generate',
                desc: 'AI creates professional A+ images tailored to your brand.',
              },
              {
                step: '03',
                icon: CheckCircle2,
                title: 'Review',
                desc: 'Preview all formats, regenerate any you want to refine.',
              },
              {
                step: '04',
                icon: Download,
                title: 'Download',
                desc: 'Export Amazon-ready images and upload directly to Seller Central.',
              },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-3xl font-black text-primary/20">
                  {item.step}
                </span>
                <item.icon className="mt-3 h-5 w-5 text-foreground" />
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple. Transparent. No BS.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Start free, upgrade when you need more firepower.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: [
                  '5 total generations',
                  '2 projects',
                  'Standard format',
                ],
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/mo',
                highlight: true,
                features: [
                  '100 generations/month',
                  'Unlimited projects',
                  'All 5+ formats',
                  'URL scraping',
                  'Batch download',
                ],
              },
              {
                name: 'Agency',
                price: '$99',
                period: '/mo',
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
                className={`relative rounded-xl border p-8 transition-colors ${
                  plan.highlight
                    ? 'border-primary/40 bg-primary/[0.03]'
                    : 'border-border bg-card hover:border-white/10'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 block rounded-md py-2.5 text-center text-sm font-semibold uppercase tracking-wide transition-all active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:brightness-110'
                      : 'border border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to stop designing
            <br />
            and start <span className="text-primary">selling</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Get your first 5 A+ content generations free. See the quality
            before you commit.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-base font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
          >
            GET STARTED FREE <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground/60">
            No commitment. No credit card. Just results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Hypeworks
          </span>
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Hypeworks. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
