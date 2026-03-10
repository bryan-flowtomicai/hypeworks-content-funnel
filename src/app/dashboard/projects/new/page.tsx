'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'Electronics',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Health & Wellness',
  'Sports & Outdoors',
  'Toys & Games',
  'Clothing & Accessories',
  'Food & Grocery',
  'Pet Supplies',
  'Other',
]

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'technical', label: 'Technical' },
  { value: 'playful', label: 'Playful' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
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

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateListItem(
    field: 'key_features' | 'brand_colors' | 'source_urls',
    idx: number,
    value: string
  ) {
    setForm((prev) => {
      const list = [...prev[field]]
      list[idx] = value
      return { ...prev, [field]: list }
    })
  }

  function addListItem(
    field: 'key_features' | 'brand_colors' | 'source_urls'
  ) {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  function removeListItem(
    field: 'key_features' | 'brand_colors' | 'source_urls',
    idx: number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = {
        ...form,
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
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/projects"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">New project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Step {step} of 3 &mdash;{' '}
        {step === 1
          ? 'Product details'
          : step === 2
            ? 'Brand & style'
            : 'Review & create'}
      </p>

      {/* Progress */}
      <div className="mt-6 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Project name *
              </label>
              <Input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="My Product A+ Content"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product name *
              </label>
              <Input
                value={form.product_name}
                onChange={(e) => update('product_name', e.target.value)}
                placeholder="Premium Wireless Headphones"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Key selling points, benefits, what makes this product special..."
                rows={4}
                className="flex w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Key features
              </label>
              {form.key_features.map((feat, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input
                    value={feat}
                    onChange={(e) =>
                      updateListItem('key_features', i, e.target.value)
                    }
                    placeholder={`Feature ${i + 1}`}
                  />
                  {form.key_features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('key_features', i)}
                      className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('key_features')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                + Add feature
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
                >
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Target audience
                </label>
                <Input
                  value={form.target_audience}
                  onChange={(e) => update('target_audience', e.target.value)}
                  placeholder="e.g. Young professionals"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Brand name
              </label>
              <Input
                value={form.brand_name}
                onChange={(e) => update('brand_name', e.target.value)}
                placeholder="Your brand name"
              />
            </div>
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Content tone
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update('content_tone', t.value)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-all ${
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
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Brand colors
              </label>
              {form.brand_colors.map((color, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input
                    value={color}
                    onChange={(e) =>
                      updateListItem('brand_colors', i, e.target.value)
                    }
                    placeholder="#c8ff00"
                  />
                  {form.brand_colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('brand_colors', i)}
                      className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('brand_colors')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                + Add color
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Source URLs
              </label>
              {form.source_urls.map((url, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) =>
                      updateListItem('source_urls', i, e.target.value)
                    }
                    placeholder="https://www.amazon.com/dp/..."
                  />
                  {form.source_urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('source_urls', i)}
                      className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('source_urls')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                + Add URL
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Review
            </h3>
            <div className="space-y-3 text-sm">
              {[
                ['Project', form.name],
                ['Product', form.product_name],
                ['Brand', form.brand_name],
                ['Category', form.category],
                ['Tone', form.content_tone],
                [
                  'Features',
                  `${form.key_features.filter(Boolean).length} items`,
                ],
                ['URLs', `${form.source_urls.filter(Boolean).length} linked`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-border pb-2"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium capitalize">
                    {value || '\u2014'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && (!form.name || !form.product_name)}
          >
            Next <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{' '}
                Creating...
              </>
            ) : (
              'CREATE PROJECT'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
