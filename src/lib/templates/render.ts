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
// Extended Inter weights for richer typographic range (300=Light, 600=SemiBold, 800=Black)

const FONT_URLS: { weight: number; url: string }[] = [
  {
    weight: 300,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-300-normal.ttf',
  },
  {
    weight: 400,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
  },
  {
    weight: 600,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf',
  },
  {
    weight: 700,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf',
  },
  {
    weight: 800,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-800-normal.ttf',
  },
]

interface FontWeight {
  weight: number
  data: ArrayBuffer
}

let cachedFonts: FontWeight[] | null = null

async function loadFonts(): Promise<FontWeight[]> {
  if (cachedFonts) return cachedFonts

  const fonts: FontWeight[] = []

  for (const { weight, url } of FONT_URLS) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        fonts.push({ weight, data: await res.arrayBuffer() })
      }
    } catch {
      // Skip failed font weight
    }
  }

  if (fonts.length === 0) {
    throw new Error('Failed to load any Inter font weights')
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
      name: 'Inter',
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
