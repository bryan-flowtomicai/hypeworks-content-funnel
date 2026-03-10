'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, SearchCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppHeader } from '@/components/shared/app-header'
import { PageLoader } from '@/components/shared/loading-states'
import { ImageDropzone } from '@/components/forms/image-dropzone'
import { FormatSelector, APlusFormat, FORMAT_OPTIONS } from '@/components/forms/format-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const dynamic = 'force-dynamic'

const contentTones = ['Professional', 'Lifestyle', 'Luxury', 'Technical', 'Playful'] as const

const formSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  brandName: z.string().min(2, 'Brand name is required'),
  productDescription: z.string().min(20, 'Add at least 20 characters'),
  targetAudience: z.string().min(2, 'Target audience is required'),
  category: z.string().min(2, 'Product category is required'),
  amazonUrl: z.string().url('Enter a valid URL'),
  otherUrls: z.string().optional(),
  brandColors: z.string().optional(),
  contentTone: z.enum(contentTones),
  keyFeaturesText: z.string().min(2, 'Add at least one bullet point'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateSubmission() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [brandAssets, setBrandAssets] = useState<File[]>([])
  const [selectedFormats, setSelectedFormats] = useState<APlusFormat[]>(['hero', 'standard'])
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [scrapedSummary, setScrapedSummary] = useState<{
    title?: string
    description?: string
  } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      brandName: '',
      productDescription: '',
      targetAudience: '',
      category: '',
      amazonUrl: '',
      otherUrls: '',
      brandColors: '#4F46E5, #0EA5E9',
      contentTone: 'Professional',
      keyFeaturesText: '',
    },
  })

  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/signin')
        return
      }

      setUser(session.user)
      setSessionLoading(false)
    }

    getSession()
  }, [router, supabase])

  const parseList = (raw: string | undefined) =>
    (raw || '')
      .split('\n')
      .map((item) => item.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)

  const parseColors = (raw: string | undefined) =>
    (raw || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const scrapeUrl = async () => {
    const url = form.getValues('amazonUrl')
    if (!url) return
    setScraping(true)
    setError(null)
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to scrape URL')
      }
      const description = result.productData?.description || ''
      const title = result.productData?.title || ''

      if (title) {
        form.setValue('productName', title)
      }
      if (description) {
        form.setValue('productDescription', description.slice(0, 1500))
      }
      setScrapedSummary({
        title,
        description: description.slice(0, 240),
      })
    } catch (scrapeError) {
      setError(scrapeError instanceof Error ? scrapeError.message : 'Failed to scrape URL')
    } finally {
      setScraping(false)
    }
  }

  const handleCreateProject = async () => {
    if (!user) return
    setError(null)
    const valid = await form.trigger()
    if (!valid) return
    if (selectedFormats.length === 0) {
      setError('Select at least one A+ format.')
      return
    }
    setLoading(true)
    try {
      const values = form.getValues()
      const sourceUrls = [values.amazonUrl, values.otherUrls].filter(Boolean)
      const payload = {
        product_name: values.productName,
        brand_name: values.brandName,
        description: values.productDescription,
        key_features: parseList(values.keyFeaturesText),
        target_audience: values.targetAudience,
        category: values.category,
        content_tone: values.contentTone,
        brand_colors: parseColors(values.brandColors),
        source_urls: sourceUrls,
        selected_formats: selectedFormats.map((id) => {
          const format = FORMAT_OPTIONS.find((option) => option.id === id)
          return { id, width: format?.width, height: format?.height }
        }),
      }

      const { data: submission, error: submitError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          product_url: values.amazonUrl,
          platform: 'amazon',
          product_data: payload,
          status: 'pending',
          brand_assets: brandAssets.map((asset) => asset.name),
          user_inputs: payload,
        })
        .select()
        .single()

      if (submitError) throw submitError

      await supabase
        .from('users')
        .update({ submission_count: 1 })
        .eq('id', user.id)

      router.push(`/dashboard/submission/${submission.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return <PageLoader label="Loading project builder..." />
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
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr,320px] lg:px-8">
        <section className="space-y-5">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--text)]">Create a new project</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Step {step} of 3 · product details, brand assets, and Amazon-ready module formats.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-6 flex gap-2">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className={`h-1.5 flex-1 rounded-full ${idx <= step ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}`} />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[var(--text)]">Product details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-[var(--text-muted)]">
                        Amazon URL
                      </label>
                      <div className="flex gap-2">
                        <Input placeholder="https://amazon.com/dp/..." {...form.register('amazonUrl')} />
                        <Button type="button" variant="outline" onClick={scrapeUrl} disabled={scraping}>
                          <SearchCheck className="mr-2 h-4 w-4" />
                          {scraping ? 'Fetching...' : 'Scrape'}
                        </Button>
                      </div>
                      {form.formState.errors.amazonUrl && (
                        <p className="text-xs text-red-500">{form.formState.errors.amazonUrl.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Product name</label>
                      <Input placeholder="UltraGrip Kitchen Shears" {...form.register('productName')} />
                      {form.formState.errors.productName && (
                        <p className="text-xs text-red-500">{form.formState.errors.productName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Brand name</label>
                      <Input placeholder="KitchenNorth" {...form.register('brandName')} />
                      {form.formState.errors.brandName && (
                        <p className="text-xs text-red-500">{form.formState.errors.brandName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Product category</label>
                      <Input placeholder="Home & Kitchen" {...form.register('category')} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Target audience</label>
                      <Input placeholder="Home cooks, meal-prep creators" {...form.register('targetAudience')} />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Product description</label>
                      <Textarea
                        placeholder="Describe positioning, pain points solved, and benefits..."
                        {...form.register('productDescription')}
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-[var(--text-muted)]">
                        Key features (one per line)
                      </label>
                      <Textarea
                        placeholder={'- Titanium micro-serrated edge\n- Dishwasher-safe\n- Child-lock safety grip'}
                        {...form.register('keyFeaturesText')}
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-[var(--text-muted)]">
                        Other platform URLs (optional)
                      </label>
                      <Input placeholder="https://brand.com, https://shopify.com/..." {...form.register('otherUrls')} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[var(--text)]">Brand assets + tone</h2>
                  <ImageDropzone files={brandAssets} onChange={setBrandAssets} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Brand colors</label>
                      <Input placeholder="#4F46E5, #0EA5E9" {...form.register('brandColors')} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Content tone</label>
                      <select
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text)]"
                        {...form.register('contentTone')}
                      >
                        {contentTones.map((tone) => (
                          <option key={tone} value={tone}>
                            {tone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[var(--text)]">A+ format selection</h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Choose one or more module formats to generate in this run.
                  </p>
                  <FormatSelector selected={selectedFormats} onChange={setSelectedFormats} />
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
                    <p className="text-xs font-medium text-[var(--text)]">
                      Selected: {selectedFormats.length} format(s)
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Generation will use your product context, selected tone, and brand palette.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1 || loading}
                >
                  Previous
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={() => setStep((prev) => Math.min(3, prev + 1))}>
                    Next
                  </Button>
                ) : (
                  <Button type="button" onClick={handleCreateProject} disabled={loading}>
                    {loading ? 'Creating...' : 'Create project'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[var(--text-muted)]">
              <p>1. Paste an Amazon product URL.</p>
              <p>2. Add brand context and target audience.</p>
              <p>3. Select A+ modules to generate.</p>
              <p>4. Create project and launch generation.</p>
            </CardContent>
          </Card>
          {scrapedSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--brand)]" />
                  Scraped context
                </CardTitle>
                <CardDescription>Pulled from your product URL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {scrapedSummary.title && <Badge>{scrapedSummary.title}</Badge>}
                <p className="text-xs text-[var(--text-muted)]">{scrapedSummary.description}</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </main>
    </div>
  )
}
