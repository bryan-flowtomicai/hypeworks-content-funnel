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
  X,
  Clock,
  DollarSign,
  Shield,
  Layers,
  ChevronDown,
  Star,
  Check,
} from 'lucide-react'
import { MobileMenu } from '@/components/mobile-menu'

/* ---------- Hero Format Grid ---------- */
function HeroGraphic() {
  const formats = [
    { label: 'Hero', w: 970, h: 600, cols: 'col-span-2', rows: 'row-span-2' },
    { label: 'Standard', w: 970, h: 300, cols: 'col-span-2', rows: '' },
    { label: 'Square', w: 300, h: 300, cols: '', rows: '' },
    { label: 'Portrait', w: 300, h: 400, cols: '', rows: 'row-span-2' },
    { label: 'Banner', w: 970, h: 150, cols: 'col-span-2', rows: '' },
  ]

  return (
    <div className="relative mx-auto mt-20 max-w-3xl">
      <div className="absolute -inset-12 rounded-3xl bg-primary/[0.06] blur-3xl" />
      <div className="absolute -inset-6 rounded-2xl bg-primary/[0.03] blur-xl" />

      <div className="card-glow relative grid grid-cols-3 gap-2 rounded-2xl bg-card/80 p-4 backdrop-blur-sm sm:gap-3 sm:p-6">
        {formats.map((fmt) => (
          <div
            key={fmt.label}
            className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-3 transition-all hover:border-primary/30 sm:p-4 ${fmt.cols} ${fmt.rows}`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary/50" />
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {fmt.label}
              </span>
            </div>
            <span className="mt-1 text-[10px] text-subtle sm:text-xs">
              {fmt.w} &times; {fmt.h}
            </span>
            <div className="mt-3 flex w-full flex-col gap-1.5">
              <div className="h-1 w-3/4 rounded-full bg-border" />
              <div className="h-1 w-1/2 rounded-full bg-border" />
            </div>
          </div>
        ))}

        <div className="absolute -right-3 -top-3 flex items-center gap-1.5 rounded-full border border-primary/30 bg-black px-3 py-1.5 shadow-lg shadow-primary/10 sm:-right-4 sm:-top-4">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-semibold text-primary">
            AI Generated
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-extrabold uppercase tracking-widest">
            Hypeworks
          </span>
          <div className="hidden items-center gap-8 sm:flex">
            {['#capabilities', '#how-it-works', '#pricing', '#faq'].map(
              (href) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {href.replace('#', '').replace('-', ' ')}
                </Link>
              )
            )}
          </div>
          <div className="hidden items-center gap-5 sm:flex">
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
          <MobileMenu />
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-36 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(200,255,0,0.08)_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            AI-powered A+ content for Amazon
          </div>

          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
            A+ Content
            <br />
            <span className="text-gradient">That Converts.</span>
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

          <p className="mt-5 text-xs text-subtle">
            5 free generations &middot; No credit card required
          </p>

          <HeroGraphic />
        </div>
      </section>

      {/* ─── Stats bar ─── */}
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

      {/* ─── Pain Points ─── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              We understand your pain
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Sound Familiar?
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-4">
            {[
              {
                pain: 'Our A+ content costs $500+ per listing from a designer.',
                detail:
                  'Freelancers charge premium rates and turnaround takes 1-2 weeks per listing.',
                author: 'Brand Manager',
              },
              {
                pain: "I spend more time on design briefs than actually selling.",
                detail:
                  'Communicating your vision to designers is a full-time job. Revisions pile up.',
                author: 'Amazon Seller',
              },
              {
                pain: "Our listings look inconsistent — every designer interprets the brand differently.",
                detail:
                  'Without a system, every listing ends up looking like a different brand.',
                author: 'Brand Owner',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card-glow rounded-xl bg-card p-6 sm:p-8"
              >
                <p className="text-base font-semibold leading-snug sm:text-lg">
                  &ldquo;{item.pain}&rdquo;
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                <p className="mt-4 text-xs font-medium text-subtle">
                  &mdash; {item.author}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-7 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section
        id="capabilities"
        className="border-t border-border bg-surface py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            #Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From Product Details to
            <br />
            Amazon-Ready A+ Content
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Complete A+ content sets generated in under a minute. Ship listings faster than any designer.',
              },
              {
                icon: ImageIcon,
                title: 'All A+ Formats',
                desc: 'Hero, standard, square, portrait, banner — exact pixel specs Amazon requires. Every module covered.',
              },
              {
                icon: Palette,
                title: 'Brand-Consistent',
                desc: 'Your colors, your tone, your visual identity — reflected in every generated image automatically.',
              },
              {
                icon: Shield,
                title: 'Amazon-Spec Compliant',
                desc: 'Every image meets Amazon\'s content guidelines. No rejections, no rework, no wasted time.',
              },
              {
                icon: Layers,
                title: 'Batch Generation',
                desc: 'Generate all formats for a listing in one click. Scale across your entire catalog effortlessly.',
              },
              {
                icon: Download,
                title: 'Instant Download',
                desc: 'Export production-ready files immediately. Upload to Seller Central the same day.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-glow group rounded-xl bg-card p-7 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Built for Speed sub-row */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Under 60 Seconds',
                desc: 'Full A+ sets before your coffee gets cold.',
              },
              {
                icon: Upload,
                title: 'URL Scraping',
                desc: 'Paste an Amazon link. We pull the product data.',
              },
              {
                icon: DollarSign,
                title: '10x Cheaper',
                desc: 'Fraction of what a designer charges per listing.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            #Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Here&apos;s How It Works
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Onboard',
                desc: 'Enter product details, brand info, and paste your Amazon listing URL.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Generate',
                desc: 'AI creates professional A+ images tailored to your brand in under 60 seconds.',
              },
              {
                step: '03',
                icon: CheckCircle2,
                title: 'Review',
                desc: 'Preview every format. Regenerate any image you want to refine.',
              },
              {
                step: '04',
                icon: Download,
                title: 'Launch',
                desc: 'Download Amazon-ready files. Upload to Seller Central and go live.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-glow group rounded-xl bg-card p-7"
              >
                <span className="text-gradient text-3xl font-black">
                  {item.step}
                </span>
                <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-7 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="border-t border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Why Hypeworks wins
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Unfair Advantage
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {/* Competitors */}
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Traditional Methods
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  '$500+ per listing for a freelance designer',
                  '1-2 weeks turnaround per listing',
                  'Inconsistent brand across multiple listings',
                  'Manual back-and-forth on revisions',
                  'Wrong dimensions rejected by Amazon',
                  'No scalable system for catalog growth',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hypeworks */}
            <div className="card-glow rounded-xl bg-card p-8">
              <h3 className="text-gradient text-sm font-semibold uppercase tracking-wider">
                Hypeworks
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Under $1 per image generation',
                  'Full A+ set in under 60 seconds',
                  'Brand-consistent output every time',
                  'One-click regeneration, no revision cycles',
                  'Pixel-perfect Amazon spec compliance',
                  'Scale across your entire catalog instantly',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            #Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            What Sellers Are Saying
          </h2>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  'We replaced our $2,000/month designer spend overnight. The quality is indistinguishable and we ship 10x faster.',
                name: 'Sarah Mitchell',
                role: 'Brand Manager, NaturePure',
                stars: 5,
              },
              {
                quote:
                  'I launched 15 new ASINs in a single weekend. Before Hypeworks, that would have taken two months of design work.',
                name: 'James Chen',
                role: 'Amazon Seller',
                stars: 5,
              },
              {
                quote:
                  'The brand consistency alone is worth it. Every listing looks like it belongs to the same family now.',
                name: 'Alex Rivera',
                role: 'Agency Owner, ScaleBrands',
                stars: 5,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="card-glow flex flex-col justify-between rounded-xl bg-card p-7"
              >
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-subtle">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section
        id="pricing"
        className="border-t border-border bg-surface py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            #Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Transparent Pricing Built to Scale
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                desc: 'Try it before you buy.',
                features: [
                  '5 total generations',
                  '2 projects',
                  'Standard format only',
                  'Basic export',
                ],
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/mo',
                desc: 'For sellers ready to scale.',
                highlight: true,
                features: [
                  '100 generations/month',
                  'Unlimited projects',
                  'All 5+ A+ formats',
                  'URL scraping',
                  'Batch download',
                  'Priority queue',
                ],
              },
              {
                name: 'Agency',
                price: '$99',
                period: '/mo',
                desc: 'For teams and agencies.',
                features: [
                  'Unlimited generations',
                  'Unlimited projects',
                  'All formats',
                  'Priority queue',
                  'Batch download',
                  'Dedicated support',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl p-8 transition-colors ${
                  plan.highlight
                    ? 'card-glow bg-card'
                    : 'border border-border bg-card hover:border-white/10'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    Popular
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
                <p className="mt-2 text-sm text-subtle">{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 block rounded-md py-2.5 text-center text-sm font-semibold uppercase tracking-wide transition-all active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:brightness-110'
                      : 'border border-border text-foreground hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  {plan.highlight ? 'Get Started' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="border-t border-border py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            #FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-14 divide-y divide-border rounded-xl border border-border bg-card">
            {[
              {
                q: 'How does the AI generate A+ content?',
                a: 'Our AI analyzes your product details, brand colors, target audience, and key features to generate professional images that match Amazon A+ module specifications exactly. Each image is tailored to your brand identity.',
              },
              {
                q: 'What A+ content formats are supported?',
                a: 'We support all standard Amazon A+ formats: Hero (970×600), Standard (970×300), Square (300×300), Portrait (300×400), and Banner (970×150). Every image is generated at the exact pixel dimensions Amazon requires.',
              },
              {
                q: 'Can I use my existing Amazon listing URL?',
                a: 'Yes. Paste your Amazon product URL and we\'ll automatically scrape your product title, description, key features, and images to populate your project. No manual data entry needed.',
              },
              {
                q: 'How long does generation take?',
                a: 'A complete set of A+ content images is generated in under 60 seconds. You can preview, regenerate individual images, and download immediately.',
              },
              {
                q: 'What happens if I run out of generations?',
                a: 'Free tier users get 5 total generations. Pro users get 100/month that reset each billing cycle. Agency users get unlimited generations. You can upgrade at any time from your dashboard.',
              },
              {
                q: 'Will the images be accepted by Amazon?',
                a: 'Yes. Every generated image meets Amazon\'s A+ content specifications for dimensions, resolution, and format. We\'ve designed the system specifically for Amazon compliance.',
              },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold transition-colors hover:text-primary">
                  {item.q}
                  <ChevronDown className="faq-chevron h-4 w-4 shrink-0 text-subtle" />
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-surface">
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,255,0,0.05)_0%,_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Stop Designing
              <br />
              and Start{' '}
              <span className="text-gradient">Selling</span>?
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
            <p className="mt-4 text-xs text-subtle">
              No commitment. No credit card. Just results.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <span className="text-sm font-extrabold uppercase tracking-widest">
                Hypeworks
              </span>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                AI-powered A+ content
                <br />
                for Amazon sellers.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { label: 'Capabilities', href: '#capabilities' },
                  { label: 'How it Works', href: '#how-it-works' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'FAQ', href: '#faq' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { label: 'Hypeworks.io', href: 'https://hypeworks.io' },
                  { label: 'Contact', href: 'https://hypeworks.io/contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { label: 'Sign In', href: '/login' },
                  { label: 'Create Account', href: '/signup' },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-subtle">
              &copy; {new Date().getFullYear()} Hypeworks. All rights reserved.
            </p>
            <p className="text-xs text-subtle">
              Built for Amazon sellers who move fast.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
