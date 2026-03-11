'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IMAGE_FORMATS, type GeneratedImage } from '@/types'
import { SLOT_DEFINITIONS } from '@/lib/templates/types'
import type { SlotId } from '@/lib/templates/types'
import {
  ArrowLeft,
  Download,
  Sparkles,
  X,
  ZoomIn,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Loader2,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StrategyAnalysis, ImageScore } from '@/app/api/projects/[id]/analyze/route'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectDetailData {
  id: string
  name: string
  product_name: string | null
  brand_name: string | null
  category: string | null
  content_tone: string
  status: string
  brand_colors: string[]
  key_features: string[]
  description: string | null
  target_audience: string | null
  scraped_data: Record<string, unknown> | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseSlotMeta(promptUsed: string | null): { slot?: string; headline?: string; intent?: string } {
  if (!promptUsed) return {}
  try {
    const parsed = JSON.parse(promptUsed)
    return { slot: parsed.slot, headline: parsed.headline, intent: parsed.intent }
  } catch {
    return {}
  }
}

function croPotentialColor(cro: string) {
  if (cro === 'High') return 'text-green-400 border-green-400/30 bg-green-400/10'
  if (cro === 'Medium') return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
  return 'text-red-400 border-red-400/30 bg-red-400/10'
}

function impactColor(impact: string) {
  if (impact === 'High') return 'text-red-400'
  if (impact === 'Medium') return 'text-yellow-400'
  return 'text-muted-foreground'
}

// ─── Strategy Header ──────────────────────────────────────────────────────────

function StrategyHeader({
  analysis,
  reviewCount,
}: {
  analysis: StrategyAnalysis
  reviewCount: number
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className={`flex items-center gap-2 rounded-lg border px-3.5 py-3 ${croPotentialColor(analysis.cro_potential)}`}>
        <Zap className="h-4 w-4 shrink-0" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">CRO Potential</p>
          <p className="text-sm font-bold">{analysis.cro_potential}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
        <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Image Score</p>
          <p className="text-sm font-bold">{analysis.image_performance_score?.toFixed(1) ?? '—'}<span className="text-xs text-muted-foreground font-normal">/5</span></p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
        <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Reviews</p>
          <p className="text-sm font-bold">{reviewCount}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-3">
        <Target className="h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Drivers</p>
          <p className="text-sm font-bold">{analysis.conversion_drivers?.length ?? 0}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Strategy Panel ───────────────────────────────────────────────────────────

function StrategyPanel({ analysis }: { analysis: StrategyAnalysis }) {
  const [tab, setTab] = useState<'drivers' | 'blockers'>('drivers')

  return (
    <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('drivers')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
            tab === 'drivers'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Conversion Drivers ({analysis.conversion_drivers?.length ?? 0})
        </button>
        <button
          onClick={() => setTab('blockers')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
            tab === 'blockers'
              ? 'border-b-2 border-destructive text-destructive'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Blockers ({analysis.conversion_blockers?.length ?? 0})
        </button>
        {analysis.estimated_conversion_lift && (
          <div className="ml-auto flex items-center px-4 text-xs font-medium text-primary">
            <TrendingUp className="mr-1 h-3 w-3" />
            {analysis.estimated_conversion_lift} lift potential
          </div>
        )}
      </div>

      {/* Drivers */}
      {tab === 'drivers' && (
        <div className="divide-y divide-border">
          {analysis.conversion_drivers?.map((driver) => (
            <div key={driver.rank} className="flex items-start gap-4 px-5 py-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                {driver.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{driver.headline}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{driver.subheadline}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {driver.data_points} reviews
                </span>
                <div className="mt-0.5 text-[10px] text-muted-foreground/60">{driver.customer_journey}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blockers */}
      {tab === 'blockers' && (
        <div className="divide-y divide-border">
          {analysis.conversion_blockers?.map((blocker, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${impactColor(blocker.impact)}`} />
                <div>
                  <p className="text-sm font-medium">{blocker.description}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">{blocker.fix}</p>
                  </div>
                </div>
                <span className={`ml-auto shrink-0 text-[10px] font-semibold uppercase ${impactColor(blocker.impact)}`}>
                  {blocker.impact}
                </span>
              </div>
            </div>
          ))}
          {(analysis.top_recommendations?.length ?? 0) > 0 && (
            <div className="bg-primary/5 px-5 py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Quick wins
              </p>
              <ul className="space-y-1">
                {(analysis.top_recommendations ?? []).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Image Audit Panel ────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 4 ? '#84cc16' : score >= 3 ? '#eab308' : '#ef4444'
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full rounded-full"
        style={{ width: `${(score / 5) * 100}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ImageAuditPanel({ scores }: { scores: ImageScore[] }) {
  if (!scores || scores.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Listing Image Audit
      </h3>
      <div className="space-y-3">
        {scores.map((score, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Image {score.image_number}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/40">
                  {score.type}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{score.score.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
            </div>

            {/* Body: dimensions + insights */}
            <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-border">
              {/* Dimension scores */}
              <div className="flex flex-col gap-3.5 p-5 sm:w-64 sm:shrink-0">
                {(score.dimensions ?? []).map((dim, j) => (
                  <div key={j}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{dim.label}</span>
                      <span className="text-xs font-semibold">
                        {dim.score.toFixed(1)}{' '}
                        <span className="font-normal text-muted-foreground">out of 5</span>
                      </span>
                    </div>
                    <ScoreBar score={dim.score} />
                  </div>
                ))}
              </div>

              {/* 3-column insights */}
              <div className="flex flex-1 flex-col divide-y divide-border">
                {[
                  { n: 1, heading: 'What we see', text: score.what_we_see },
                  { n: 2, heading: 'Why it matters', text: score.why_it_matters },
                  { n: 3, heading: 'How to fix', text: score.how_to_fix },
                ].map((item) => (
                  <div key={item.n} className="flex gap-3 px-5 py-3.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-muted-foreground">
                      {item.n}
                    </span>
                    <div>
                      <p className="mb-0.5 text-xs font-semibold">{item.heading}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Slot Card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  image,
  strategy,
  onGenerate,
  onOpenLightbox,
  isGenerating,
}: {
  slot: typeof SLOT_DEFINITIONS[number]
  image: GeneratedImage | undefined
  strategy: { headline?: string; subheadline?: string } | undefined
  onGenerate: (slotId: SlotId) => void
  onOpenLightbox: (img: GeneratedImage) => void
  isGenerating: boolean
}) {
  const spec = IMAGE_FORMATS[slot.format]
  const aspectRatio = spec ? spec.width / spec.height : 1
  const headline = strategy?.headline
  const subheadline = strategy?.subheadline
  const hasImage = image?.status === 'complete' && image.public_url

  const INTENT_BADGE: Record<string, string> = {
    lifestyle: 'bg-blue-500/20 text-blue-300',
    benefit: 'bg-violet-500/20 text-violet-300',
    how_it_works: 'bg-amber-500/20 text-amber-300',
    feature_grid: 'bg-cyan-500/20 text-cyan-300',
    social_proof: 'bg-green-500/20 text-green-300',
    problem_solution: 'bg-orange-500/20 text-orange-300',
    comparison: 'bg-pink-500/20 text-pink-300',
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-white/10 flex flex-col">
      {/* Slot header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {slot.id}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${INTENT_BADGE[slot.intent] ?? 'bg-white/5 text-white/40'}`}>
            {slot.intent.replace('_', ' ')}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {spec.width}×{spec.height}
        </span>
      </div>

      {/* Strategy headline */}
      {headline && (
        <div className="px-4 pb-3">
          <p className="text-sm font-semibold leading-tight">{headline}</p>
          {subheadline && (
            <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{subheadline}</p>
          )}
        </div>
      )}
      {!headline && (
        <div className="px-4 pb-3">
          <p className="text-sm font-medium text-muted-foreground">{slot.label}</p>
          <p className="mt-0.5 text-[10px] text-subtle line-clamp-2">{slot.defaultBrief}</p>
        </div>
      )}

      {/* Image area */}
      <div
        className="relative mx-3 mb-3 overflow-hidden rounded-lg bg-white/5 cursor-pointer group"
        style={{ aspectRatio: `${aspectRatio}` }}
        onClick={() => hasImage && onOpenLightbox(image!)}
      >
        {hasImage ? (
          <>
            <img
              src={image.public_url!}
              alt={slot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
              <ZoomIn className="h-7 w-7 text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" />
            </div>
            <a
              href={image.public_url!}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-3.5 w-3.5 text-white" />
            </a>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                <p className="text-[10px] text-muted-foreground">Generating...</p>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-subtle" />
                <p className="text-[10px] text-subtle">Not yet generated</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={() => onGenerate(slot.id)}
          disabled={isGenerating}
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            hasImage
              ? 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
              : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : hasImage ? (
            <RefreshCw className="h-3.5 w-3.5" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isGenerating ? 'Generating...' : hasImage ? 'Regenerate' : 'Generate'}
        </button>
      </div>
    </div>
  )
}

// ─── Main client component ────────────────────────────────────────────────────

export function ProjectDetail({
  project,
  images,
}: {
  project: ProjectDetailData
  images: GeneratedImage[]
}) {
  const router = useRouter()
  const scraped = project.scraped_data
  const analysis = (scraped?.analysis as StrategyAnalysis | null) ?? null
  const productReviews = (scraped?.product_reviews as string[]) ?? []
  const productImages = (scraped?.product_images as string[]) ?? []

  const [currentAnalysis, setCurrentAnalysis] = useState<StrategyAnalysis | null>(analysis)
  const [analyzing, setAnalyzing] = useState(false)
  const [generatingSlots, setGeneratingSlots] = useState<Set<SlotId>>(new Set())
  const [generatingAll, setGeneratingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<{ url: string; name: string; width: number; height: number } | null>(null)

  // Auto-trigger analysis if project has no analysis yet (works with or without reviews)
  useEffect(() => {
    if (!currentAnalysis) {
      runAnalysis()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runAnalysis() {
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${project.id}/analyze`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setCurrentAnalysis(data)
        router.refresh()
      }
    } catch {
      // Non-blocking — user can retry
    } finally {
      setAnalyzing(false)
    }
  }

  async function generateSlot(slotId: SlotId) {
    setError(null)
    const def = SLOT_DEFINITIONS.find((s) => s.id === slotId)!
    const strategy = currentAnalysis?.slot_strategy?.find((s) => s.slot_id === slotId)

    setGeneratingSlots((prev) => new Set([...prev, slotId]))

    try {
      const res = await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slots: [{
            slotId,
            format: def.format,
            intent: def.intent,
            headline: strategy?.headline,
            subheadline: strategy?.subheadline,
            copyBrief: strategy?.copy_brief ?? def.defaultBrief,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || `Generation failed for ${slotId}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGeneratingSlots((prev) => {
        const next = new Set(prev)
        next.delete(slotId)
        return next
      })
    }
  }

  async function generateAll() {
    setError(null)
    setGeneratingAll(true)

    try {
      const slots = SLOT_DEFINITIONS.map((def) => {
        const strategy = currentAnalysis?.slot_strategy?.find((s) => s.slot_id === def.id)
        return {
          slotId: def.id,
          format: def.format,
          intent: def.intent,
          headline: strategy?.headline,
          subheadline: strategy?.subheadline,
          copyBrief: strategy?.copy_brief ?? def.defaultBrief,
        }
      })

      const res = await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Generation failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGeneratingAll(false)
    }
  }

  async function deleteProject() {
    if (!confirm('Delete this project and all its images? This cannot be undone.')) return
    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
    router.push('/dashboard/projects')
    router.refresh()
  }

  // Map images to slots by slot_id in prompt_used JSON
  function getImageForSlot(slotId: SlotId): GeneratedImage | undefined {
    return images
      .filter((img) => img.status === 'complete')
      .find((img) => {
        const meta = parseSlotMeta(img.prompt_used)
        return meta.slot === slotId
      })
  }

  const isGenerating = project.status === 'generating' || generatingAll

  return (
    <div className="pb-16">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.name}
              width={lightbox.width}
              height={lightbox.height}
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-white/60">{lightbox.name} — {lightbox.width}×{lightbox.height}px</p>
              <a
                href={lightbox.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Back nav */}
      <Link
        href="/dashboard/projects"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{project.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {project.product_name ?? 'No product name'}
            {project.brand_name ? ` — ${project.brand_name}` : ''}
            {project.category ? ` · ${project.category}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={runAnalysis}
            disabled={analyzing}
            title="Re-run strategy analysis"
          >
            {analyzing
              ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Analyzing...</>
              : <><RefreshCw className="mr-1.5 h-4 w-4" /> Re-analyze</>
            }
          </Button>
          <Button
            variant="outline"
            onClick={deleteProject}
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Strategy metrics */}
      {currentAnalysis && (
        <StrategyHeader
          analysis={currentAnalysis}
          reviewCount={productReviews.length}
        />
      )}

      {/* Analyzing state */}
      {analyzing && !currentAnalysis && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary">Analyzing product strategy...</p>
            <p className="text-xs text-muted-foreground">
              {productReviews.length > 0
                ? `Extracting conversion drivers from ${productReviews.length} reviews`
                : 'Generating conversion strategy from product data'}
            </p>
          </div>
        </div>
      )}

      {/* Strategy panel */}
      {currentAnalysis && <StrategyPanel analysis={currentAnalysis} />}

      {/* Image audit panel — listing image scores */}
      {currentAnalysis?.image_scores && currentAnalysis.image_scores.length > 0 && (
        <ImageAuditPanel scores={currentAnalysis.image_scores} />
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Slots section */}
      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">A+ Content Slots</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {images.filter((i) => i.status === 'complete').length} of {SLOT_DEFINITIONS.length} generated
            </p>
          </div>
          <Button
            onClick={generateAll}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating all...</>
            ) : (
              <><Sparkles className="mr-1.5 h-4 w-4" /> Generate All Slots</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SLOT_DEFINITIONS.map((slot) => {
            const image = getImageForSlot(slot.id)
            const strategy = currentAnalysis?.slot_strategy?.find((s) => s.slot_id === slot.id)
            const slotGenerating = generatingSlots.has(slot.id) || generatingAll

            return (
              <SlotCard
                key={slot.id}
                slot={slot}
                image={image}
                strategy={strategy}
                onGenerate={generateSlot}
                onOpenLightbox={(img) => {
                  const spec = IMAGE_FORMATS[img.format_type as keyof typeof IMAGE_FORMATS]
                  setLightbox({
                    url: img.public_url!,
                    name: `${slot.name} (${slot.id})`,
                    width: spec?.width ?? img.width,
                    height: spec?.height ?? img.height,
                  })
                }}
                isGenerating={slotGenerating}
              />
            )
          })}
        </div>
      </div>

      {/* Brand info */}
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {[
          { label: 'Tone', value: project.content_tone },
          { label: 'Category', value: project.category ?? '—' },
          { label: 'Audience', value: project.target_audience ?? '—' },
          { label: 'Status', value: isGenerating ? 'generating...' : project.status },
        ].map((item) => (
          <div key={item.label} className="bg-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-medium capitalize truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {project.brand_colors?.filter(Boolean).length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Brand colors</span>
          {project.brand_colors.filter(Boolean).map((color, i) => (
            <div key={i} className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      )}

      {project.key_features?.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Key features</h2>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {project.key_features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
