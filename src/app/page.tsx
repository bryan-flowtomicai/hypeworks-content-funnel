import Link from 'next/link'
import { ArrowRight, Sparkles, Wand2, LayoutTemplate, ShieldCheck } from 'lucide-react'
import { AppHeader } from '@/components/shared/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 shadow-2xl shadow-indigo-500/10 sm:p-14">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
                Agency-grade Amazon A+ content workflow
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
                Generate premium A+ modules that actually look brand-ready.
              </h1>
              <p className="mt-5 max-w-xl text-base text-[var(--text-muted)]">
                Build polished hero banners, feature modules, and comparison visuals with a
                guided workflow, Amazon spec dimensions, and AI generation tuned for
                e-commerce performance.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/auth/signup">
                  <Button size="lg">
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Open dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="bg-[var(--bg)]">
              <CardHeader>
                <CardTitle>Built for brand teams</CardTitle>
                <CardDescription>
                  From URL scrape to export-ready assets in one flow.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Multi-step product intake + brand context',
                  'Amazon format selector with exact pixel specs',
                  'AI generation jobs with gallery-style results',
                  'Project history for repeated campaigns',
                ].map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    {point}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Wand2 className="mb-2 h-5 w-5 text-[var(--brand)]" />
              <CardTitle>fal.ai image generation</CardTitle>
              <CardDescription>
                Server-side generation with prompt templates tuned for Amazon A+.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <LayoutTemplate className="mb-2 h-5 w-5 text-[var(--brand)]" />
              <CardTitle>Format-aware modules</CardTitle>
              <CardDescription>
                Hero, standard, square, portrait, and banner formats with pixel labels.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="mb-2 h-5 w-5 text-[var(--brand)]" />
              <CardTitle>Seller-first workflow</CardTitle>
              <CardDescription>
                Project history, editable scraped context, and direct download of outputs.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      </main>
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
        A+ Content Studio · Premium AI workflow for Amazon sellers
      </footer>
    </div>
  )
}
