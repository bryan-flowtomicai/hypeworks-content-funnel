'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { IMAGE_FORMATS, type ImageFormatType } from '@/types'
import { Loader2, Sparkles, Trash2, X, AlertCircle } from 'lucide-react'

export function GenerateButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [showPicker, setShowPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [selectedFormats, setSelectedFormats] = useState<ImageFormatType[]>([
    'hero',
  ])

  function toggleFormat(format: ImageFormatType) {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    )
  }

  async function handleGenerate() {
    setError(null)
    setGenerating(true)
    setShowPicker(false)

    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formats: selectedFormats }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || `Generation failed (${res.status})`)
        setGenerating(false)
        return
      }

      const data = await res.json()
      const failed = data.results?.filter(
        (r: { status: string }) => r.status === 'failed'
      )
      if (failed?.length) {
        setError(
          `${failed.length} format(s) failed: ${failed.map((f: { error?: string }) => f.error || 'unknown').join(', ')}`
        )
      }

      setGenerating(false)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Request timed out or failed. Try again.'
      )
      setGenerating(false)
    }
  }

  return (
    <>
      {/* Generating indicator (persists after modal closes) */}
      {generating && (
        <GeneratingBanner
          projectId={projectId}
          formats={selectedFormats}
          onDone={() => {
            setGenerating(false)
            router.refresh()
          }}
        />
      )}

      {/* Error banner */}
      {error && !generating && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 text-destructive/60 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Button
        onClick={() => setShowPicker(true)}
        disabled={generating}
      >
        {generating ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-1.5 h-4 w-4" /> Generate
          </>
        )}
      </Button>

      {/* Format picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Select formats</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose the A+ content formats to generate.
                </p>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {(
                Object.entries(IMAGE_FORMATS) as [
                  ImageFormatType,
                  (typeof IMAGE_FORMATS)[ImageFormatType],
                ][]
              ).map(([key, spec]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all ${
                    selectedFormats.includes(key)
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(key)}
                      onChange={() => toggleFormat(key)}
                      className="h-4 w-4 accent-[#c8ff00]"
                    />
                    <span className="text-sm font-medium">{spec.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {spec.width} &times; {spec.height}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPicker(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={selectedFormats.length === 0}
              >
                {`GENERATE ${selectedFormats.length} IMAGE${selectedFormats.length !== 1 ? 'S' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function GeneratingBanner({
  projectId,
  formats,
  onDone,
}: {
  projectId: string
  formats: ImageFormatType[]
  onDone: () => void
}) {
  const [elapsed, setElapsed] = useState(0)

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/images`)
      if (!res.ok) return false

      const images = await res.json()
      const completed = images.filter(
        (img: { status: string }) => img.status === 'complete' || img.status === 'failed'
      )

      if (completed.length >= formats.length) {
        onDone()
        return true
      }
    } catch {
      // Continue polling
    }
    return false
  }, [projectId, formats.length, onDone])

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (elapsed > 0 && elapsed % 5 === 0) {
      checkStatus()
    }
  }, [elapsed, checkStatus])

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">
          Generating A+ content...
        </p>
        <p className="text-xs text-muted-foreground">
          AI is creating your images ({elapsed}s) — you can leave this page
        </p>
      </div>
    </div>
  )
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (
      !confirm(
        'Delete this project and all its images? This cannot be undone.'
      )
    )
      return

    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/dashboard/projects')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleDelete} disabled={loading}>
      <Trash2 className="mr-1.5 h-4 w-4" />
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
