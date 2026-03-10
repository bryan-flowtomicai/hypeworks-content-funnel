'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Loader2,
  Link2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Brain,
  Code2,
} from 'lucide-react'
import Link from 'next/link'

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'technical', label: 'Technical' },
  { value: 'playful', label: 'Playful' },
]

type FormState = {
  name: string
  product_name: string
  brand_name: string
  description: string
  key_features: string[]
  target_audience: string
  category: string
  content_tone: string
  brand_colors: string[]
  source_urls: string[]
}

export default function NewProjectPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scraped, setScraped] = useState(false)
  const [scrapeError, setScrapeError] = useState<string | null>(null)
  const [extractionMethod, setExtractionMethod] = useState<'ai' | 'regex' | null>(null)
  const [creating, setCreating] = useState(false)
  const [showManual, setShowManual] = useState(false)

  const [form, setForm] = useState<FormState>({
    name: '',
    product_name: '',
    brand_name: '',
    description: '',
    key_features: [''],
    target_audience: '',
    category: '',
    content_tone: 'professional',
    brand_colors: [''],
    source_urls: [''],
  })

  function update(field: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleScrape() {
    if (!url.trim()) return
    setScraping(true)
    setScrapeError(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setScrapeError(data.error || 'Failed to scrape URL')
        setScraping(false)
        return
      }

      const data = await res.json()

      setForm({
        name: data.product_name
          ? `${data.product_name.substring(0, 50)} A+ Content`
          : '',
        product_name: data.product_name || '',
        brand_name: data.brand_name || '',
        description: data.description || '',
        key_features:
          data.key_features?.length > 0 ? data.key_features : [''],
        target_audience: data.target_audience || '',
        category: data.category || '',
        content_tone: 'professional',
        brand_colors: [''],
        source_urls: [url.trim()],
      })

      setExtractionMethod(data.extraction_method ?? 'regex')
      setScraped(true)
      setShowManual(true)
    } catch {
      setScrapeError('Something went wrong. Check the URL and try again.')
    } finally {
      setScraping(false)
    }
  }

  async function handleCreate() {
    if (!form.product_name.trim()) return
    setCreating(true)

    try {
      const payload = {
        ...form,
        name: form.name || `${form.product_name.substring(0, 50)} A+ Content`,
        key_features: form.key_features.filter(Boolean),
        brand_colors: form.brand_colors.filter(Boolean),
        source_urls: form.source_urls.filter(Boolean),
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create project')

      const project = await res.json()
      router.push(`/dashboard/projects/${project.id}`)
    } catch {
      alert('Failed to create project. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>

      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
        New project
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste a product URL and we&apos;ll extract everything automatically.
      </p>

      {/* URL Input */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm font-semibold">Product URL</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Amazon listing, Shopify page, or any product URL — AI extracts all details
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setScrapeError(null)
            }}
            placeholder="https://www.amazon.com/dp/B0..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleScrape()
            }}
          />
          <Button
            onClick={handleScrape}
            disabled={scraping || !url.trim()}
            className="shrink-0"
          >
            {scraping ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{' '}
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-4 w-4" /> AI Extract
              </>
            )}
          </Button>
        </div>

        {scrapeError && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {scrapeError}
          </div>
        )}

        {scraped && !scrapeError && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm text-primary">
            {extractionMethod === 'ai' ? (
              <Brain className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span>
              {extractionMethod === 'ai'
                ? 'AI-powered extraction complete. Review below and create your project.'
                : 'Product data extracted. Review below and create your project.'}
            </span>
            {extractionMethod === 'ai' && (
              <span className="ml-auto shrink-0 rounded-full border border-primary/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                AI
              </span>
            )}
          </div>
        )}
      </div>

      {/* Manual entry toggle */}
      {!showManual && (
        <button
          onClick={() => setShowManual(true)}
          className="mt-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Or enter details manually &darr;
        </button>
      )}

      {/* Form */}
      {showManual && (
        <>
          <div className="mt-6 space-y-6">
            {/* Product Info */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Product details
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Product name *
                  </label>
                  <Input
                    value={form.product_name}
                    onChange={(e) => update('product_name', e.target.value)}
                    placeholder="Premium Wireless Headphones"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Brand
                  </label>
                  <Input
                    value={form.brand_name}
                    onChange={(e) => update('brand_name', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="Key selling points, benefits..."
                    rows={3}
                    className="flex w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground transition-colors placeholder:text-subtle focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Target audience
                  </label>
                  <Input
                    value={form.target_audience}
                    onChange={(e) => update('target_audience', e.target.value)}
                    placeholder="e.g. Fitness enthusiasts, home office workers"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Key features
                  </label>
                  {form.key_features.map((feat, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <Input
                        value={feat}
                        onChange={(e) => {
                          const list = [...form.key_features]
                          list[i] = e.target.value
                          update('key_features', list)
                        }}
                        placeholder={`Feature ${i + 1}`}
                      />
                      {form.key_features.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            update(
                              'key_features',
                              form.key_features.filter((_, j) => j !== i)
                            )
                          }
                          className="shrink-0 px-2 text-xs text-muted-foreground hover:text-destructive"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      update('key_features', [...form.key_features, ''])
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    + Add feature
                  </button>
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Style &amp; tone
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Content tone
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => update('content_tone', t.value)}
                        className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-all ${
                          form.content_tone === t.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Project name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Auto-generated if empty"
                  />
                  <p className="mt-1 text-[11px] text-subtle">
                    Optional — we&apos;ll auto-generate from the product name
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              onClick={handleCreate}
              disabled={creating || !form.product_name.trim()}
              className="w-full sm:w-auto"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{' '}
                  Creating...
                </>
              ) : (
                'CREATE PROJECT'
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
