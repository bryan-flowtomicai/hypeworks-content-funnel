import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import type { ImageFormatType } from '@/types'
import { IMAGE_FORMATS } from '@/types'
import type { SlotId } from './types'
import type { TemplateData } from './types'
import {
  HeroTemplate,
  StandardTemplate,
  SquareTemplate,
  PortraitTemplate,
  BannerWideTemplate,
  PT01BenefitTemplate,
  PT02ProblemSolutionTemplate,
  PT03HowItWorksTemplate,
  PT04FeatureGridTemplate,
  PT05DetailTemplate,
  PT06CompatibilityTemplate,
  PT07SocialProofTemplate,
} from './layouts'

// ─── Fonts ───────────────────────────────────────────────────────────────────
// Three families loaded:
//   Inter          — body text + fallback for all tones
//   Playfair Display — luxury/professional display headlines (serif)
//   Nunito         — lifestyle/playful/energetic display headlines (rounded sans)

interface FontSpec {
  family: string
  weight: number
  url: string
}

const FONT_SPECS: FontSpec[] = [
  // Inter — all weights for body, labels, and fallback headlines
  { family: 'Inter', weight: 300, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-300-normal.ttf' },
  { family: 'Inter', weight: 400, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf' },
  { family: 'Inter', weight: 600, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf' },
  { family: 'Inter', weight: 700, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf' },
  { family: 'Inter', weight: 800, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-800-normal.ttf' },
  // Playfair Display — luxury/premium/professional headlines (elegant serif)
  { family: 'Playfair Display', weight: 700, url: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf' },
  { family: 'Playfair Display', weight: 800, url: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-800-normal.ttf' },
  // Nunito — lifestyle/playful/energetic headlines (friendly rounded sans)
  { family: 'Nunito', weight: 700, url: 'https://cdn.jsdelivr.net/fontsource/fonts/nunito@latest/latin-700-normal.ttf' },
  { family: 'Nunito', weight: 800, url: 'https://cdn.jsdelivr.net/fontsource/fonts/nunito@latest/latin-800-normal.ttf' },
]

interface LoadedFont {
  family: string
  weight: number
  data: ArrayBuffer
}

let cachedFonts: LoadedFont[] | null = null

async function loadFonts(): Promise<LoadedFont[]> {
  if (cachedFonts) return cachedFonts

  const fonts: LoadedFont[] = []

  for (const { family, weight, url } of FONT_SPECS) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        fonts.push({ family, weight, data: await res.arrayBuffer() })
      }
    } catch {
      // Non-fatal: skip this weight/family
    }
  }

  if (!fonts.some((f) => f.family === 'Inter')) {
    throw new Error('Failed to load Inter font — required for all layouts')
  }

  cachedFonts = fonts
  return fonts
}

// ─── Slot-based routing (takes priority over format) ─────────────────────────

const SLOT_TEMPLATE_MAP: Partial<Record<SlotId, (data: TemplateData) => React.ReactElement>> = {
  HERO: HeroTemplate,
  PT01: PT01BenefitTemplate,
  PT02: PT02ProblemSolutionTemplate,
  PT03: PT03HowItWorksTemplate,
  PT04: PT04FeatureGridTemplate,
  PT05: PT05DetailTemplate,
  PT06: PT06CompatibilityTemplate,
  PT07: PT07SocialProofTemplate,
}

// Format-based fallback for backward compatibility (when slotId is not set)
const FORMAT_TEMPLATE_MAP: Record<ImageFormatType, (data: TemplateData) => React.ReactElement> = {
  hero: HeroTemplate,
  standard: StandardTemplate,
  square: SquareTemplate,
  portrait: PortraitTemplate,
  banner_wide: BannerWideTemplate,
}

// ─── Main render function ─────────────────────────────────────────────────────

export async function renderTemplate(data: TemplateData): Promise<Buffer> {
  const spec = IMAGE_FORMATS[data.format]

  // Prefer slot-specific template; fall back to format-based
  const templateFn =
    (data.slotId ? SLOT_TEMPLATE_MAP[data.slotId] : undefined) ??
    FORMAT_TEMPLATE_MAP[data.format]

  if (!templateFn) {
    throw new Error(`Unknown template format: ${data.format}`)
  }

  const fonts = await loadFonts()

  const jsx = templateFn(data)

  const svg = await satori(jsx, {
    width: spec.width,
    height: spec.height,
    fonts: fonts.map((f) => ({
      name: f.family,
      data: f.data,
      weight: f.weight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
      style: 'normal' as const,
    })),
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: spec.width },
  })
  const pngData = resvg.render()
  return Buffer.from(pngData.asPng())
}
