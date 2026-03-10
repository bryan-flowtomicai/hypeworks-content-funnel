'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, ImagePlus, RefreshCcw, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppHeader } from '@/components/shared/app-header'
import { PageLoader } from '@/components/shared/loading-states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/database.types'

type Submission = Database['public']['Tables']['submissions']['Row']

interface GeneratedImage {
  imageUrl: string
  formatType?: string
  width?: number
  height?: number
  createdAt?: string
}

export const dynamic = 'force-dynamic'

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [gallery, setGallery] = useState<GeneratedImage[]>([])

  const submissionId = params?.id

  const loadSubmission = useCallback(async () => {
    if (!submissionId) return

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const { data, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setSubmission(data)
      setGallery(
        (data.generated_images || []).map((url) => ({
          imageUrl: url,
          createdAt: data.created_at,
        }))
      )
    }
    setLoading(false)
  }, [router, submissionId, supabase])

  useEffect(() => {
    loadSubmission()
  }, [loadSubmission])

  const generate = async () => {
    if (!submission) return
    setRunning(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          productData: submission.product_data || submission.user_inputs || {},
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Generation failed')
      }
      setGallery(result.generatedImages || [])
      await loadSubmission()
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Generation failed')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading project..." />
  }

  if (!submission) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-sm text-red-500">{error || 'Submission not found.'}</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const productData = (submission.product_data || {}) as Record<string, unknown>
  const formats = Array.isArray(productData.selected_formats)
    ? productData.selected_formats
    : []

  return (
    <div className="min-h-screen">
      <AppHeader
        authenticated
        onSignOut={async () => {
          await supabase.auth.signOut()
          router.push('/auth/signin')
        }}
      />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr,300px] lg:px-8">
        <section className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>{String(productData.product_name || 'A+ Content Project')}</CardTitle>
              <CardDescription>
                {submission.product_url || 'No source URL'} · Created{' '}
                {new Date(submission.created_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{String(productData.brand_name || 'Brand')}</Badge>
                <Badge>{String(productData.content_tone || 'Professional')}</Badge>
                {submission.status === 'completed' && <Badge variant="success">Complete</Badge>}
                {submission.status === 'processing' && <Badge variant="warning">Generating</Badge>}
                {submission.status === 'failed' && <Badge variant="danger">Failed</Badge>}
                {submission.status === 'pending' && <Badge>Draft</Badge>}
              </div>

              {error && (
                <p className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={generate} disabled={running}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {running ? 'Generating...' : 'Generate images'}
                </Button>
                <Button variant="outline" onClick={generate} disabled={running}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated gallery</CardTitle>
              <CardDescription>
                Outputs are shown below once generation is complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gallery.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-muted)]">
                  No generated images yet. Run generation to produce your first module set.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((image, index) => (
                    <div
                      key={`${image.imageUrl}-${index}`}
                      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.imageUrl}
                        alt={`Generated module ${index + 1}`}
                        className="h-52 w-full object-cover"
                      />
                      <div className="space-y-2 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-[var(--text)]">
                            {image.formatType || `Module ${index + 1}`}
                          </p>
                          {image.width && image.height && (
                            <Badge>
                              {image.width}x{image.height}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={image.imageUrl} download target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setGallery((current) => current.filter((_, imageIndex) => imageIndex !== index))
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selected formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formats.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No format metadata found.</p>
              ) : (
                formats.map((format) => (
                  <div
                    key={JSON.stringify(format)}
                    className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]"
                  >
                    {String((format as { id?: string }).id)} · {(format as { width?: number }).width}x
                    {(format as { height?: number }).height}px
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generation brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[var(--text-muted)]">
              <p>{String(productData.description || 'No description provided.')}</p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}
