'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { IMAGE_FORMATS, type ImageFormatType } from '@/types'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'

export function GenerateButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
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
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formats: selectedFormats }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Generation failed')
        return
      }

      setShowPicker(false)
      router.refresh()
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!showPicker) {
    return (
      <Button onClick={() => setShowPicker(true)}>
        <Sparkles className="mr-1 h-4 w-4" /> Generate
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold">Select formats</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the A+ content formats to generate.
        </p>
        <div className="mt-4 space-y-2">
          {(Object.entries(IMAGE_FORMATS) as [ImageFormatType, (typeof IMAGE_FORMATS)[ImageFormatType]][]).map(
            ([key, spec]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                  selectedFormats.includes(key)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(key)}
                    onChange={() => toggleFormat(key)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{spec.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {spec.width} x {spec.height}
                </span>
              </label>
            )
          )}
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setShowPicker(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || selectedFormats.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              `Generate ${selectedFormats.length} image${selectedFormats.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this project and all its images? This cannot be undone.')) return

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
      <Trash2 className="mr-1 h-4 w-4" />
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
