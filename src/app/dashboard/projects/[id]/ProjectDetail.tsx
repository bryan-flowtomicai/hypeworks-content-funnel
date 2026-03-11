'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IMAGE_FORMATS, type GeneratedImage } from '@/types'
import {
  ArrowLeft,
  Download,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  GenerateButton,
  DeleteProjectButton,
  AnalyzeButton,
  type AnalysisResult,
} from './actions'

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

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 38
  const circ = 2 * Math.PI * radius
  const fill = circ - (score / 100) * circ
  const color = score >= 70 ? '#4ade80' : score >= 45 ? '#facc15' : '#f87171'

  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle
        cx={48} cy={48} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={8}
      />
      <circle
        cx={48} cy={48} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text x={48} y={44} textAnchor="middle" fill="white" fontSize={20} fontWeight={800}>
        {score}
      </text>
      <text x={48} y={60} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>
        /100
      </text>
    </svg>
  )
}

// ─── Analysis card ────────────────────────────────────────────────────────────

function AnalysisCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-6 p-6">
        <ScoreRing score={analysis.overall_score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">{analysis.current_grade}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Current grade
            </span>
          </div>
          {analysis.estimated_conversion_lift && (
            <div className="mt-1 flex items-center gap-1.5 text-sm text-primary font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              {analysis.estimated_conversion_lift} potential conversion lift
            </div>
          )}
          {analysis.brand_voice_detected && (
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {analysis.brand_voice_detected}
            </p>
          )}
        </div>
      </div>

      {analysis.missing_slots?.length > 0 && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Missing image slots
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing_slots.map((slot) => (
              <span
                key={slot}
                className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs text-destructive font-medium"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.top_recommendations?.length > 0 && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Top recommendations
          </p>
          <ul className="space-y-1.5">
            {analysis.top_recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.image_scores?.length > 0 && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Image breakdown
          </p>
          <div className="space-y-2">
            {analysis.image_scores.map((img) => {
              const pct = img.score
              const barColor =
                pct >= 70
                  ? 'bg-green-500/70'
                  : pct >= 45
                    ? 'bg-yellow-500/70'
                    : 'bg-red-500/70'
              return (
                <div key={img.image_number}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium capitalize text-foreground/80">
                      #{img.image_number} {img.type}
                    </span>
                    <span className="text-xs font-bold text-foreground/60">{img.score}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div
                      className={`h-1.5 rounded-full ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {img.gap && img.gap !== 'none' && (
                    <div className="mt-0.5 flex items-center gap-1">
                      <AlertCircle className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                      <p className="text-[10px] text-muted-foreground">{img.gap}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
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
  const existingAnalysis = scraped?.analysis as AnalysisResult | null
  const hasProductImages =
    Array.isArray(scraped?.product_images) &&
    (scraped.product_images as string[]).length > 0

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(existingAnalysis)

  const completedImages = images.filter((img) => img.status === 'complete')
  const isGenerating = project.status === 'generating'

  function handleAnalysisResult(result: AnalysisResult) {
    setAnalysis(result)
    router.refresh()
  }

  return (
    <div>
      <Link
        href="/dashboard/projects"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.product_name ?? 'No product name'}
            {project.brand_name ? ` \u2014 ${project.brand_name}` : ''}
          </p>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <AnalyzeButton
            projectId={project.id}
            hasImages={hasProductImages}
            onResult={handleAnalysisResult}
          />
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      {/* Analysis card */}
      {analysis && <AnalysisCard analysis={analysis} />}

      {!analysis && !hasProductImages && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          No product images found. Create a project by pasting an Amazon URL to unlock content scoring.
        </div>
      )}

      {/* Generate button + status banners */}
      <div className="mt-6">
        <GenerateButton projectId={project.id} />
      </div>

      {/* Metadata */}
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {[
          { label: 'Status', value: isGenerating ? 'generating...' : project.status },
          { label: 'Category', value: project.category ?? '\u2014' },
          { label: 'Tone', value: project.content_tone },
          { label: 'Images', value: String(completedImages.length) },
        ].map((item) => (
          <div key={item.label} className="bg-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm font-medium capitalize">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Brand colors preview */}
      {project.brand_colors?.filter(Boolean).length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Brand colors
          </span>
          {project.brand_colors.filter(Boolean).map((color, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full border border-border"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}

      {/* Key features */}
      {project.key_features?.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Key features
          </h2>
          <ul className="mt-3 space-y-1.5">
            {project.key_features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Generated images */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Generated images
        </h2>

        {!completedImages.length && !isGenerating ? (
          <div className="mt-4 rounded-xl border border-dashed border-border py-20 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-subtle" />
            <p className="mt-3 text-sm text-muted-foreground">
              No images yet. Click &quot;Generate&quot; to create A+ content.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedImages.map((img) => {
              const spec = IMAGE_FORMATS[img.format_type as keyof typeof IMAGE_FORMATS]
              return (
                <div
                  key={img.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/20"
                >
                  {img.public_url && (
                    <div className="relative">
                      <img
                        src={img.public_url}
                        alt={img.format_type}
                        className="aspect-video w-full object-cover"
                      />
                      <a
                        href={img.public_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-2 rounded-md bg-black/60 p-2 opacity-100 backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Download className="h-4 w-4 text-white" />
                      </a>
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium capitalize">
                      {img.format_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {spec
                        ? `${spec.width} \u00D7 ${spec.height}px`
                        : `${img.width} \u00D7 ${img.height}px`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
