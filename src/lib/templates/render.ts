import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import type { ImageFormatType } from '@/types'
import { IMAGE_FORMATS } from '@/types'
import type { TemplateData } from './types'
import {
  HeroTemplate,
  StandardTemplate,
  SquareTemplate,
  PortraitTemplate,
  BannerWideTemplate,
} from './layouts'

// Direct CDN URLs for Inter font files (stable, no CSS parsing needed)
const FONT_URLS: { weight: number; url: string }[] = [
  {
    weight: 400,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2',
  },
  {
    weight: 700,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2',
  },
  {
    weight: 800,
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-800-normal.woff2',
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

const TEMPLATE_MAP: Record<
  ImageFormatType,
  (data: TemplateData) => React.ReactElement
> = {
  hero: HeroTemplate,
  standard: StandardTemplate,
  square: SquareTemplate,
  portrait: PortraitTemplate,
  banner_wide: BannerWideTemplate,
}

export async function renderTemplate(data: TemplateData): Promise<Buffer> {
  const spec = IMAGE_FORMATS[data.format]
  const templateFn = TEMPLATE_MAP[data.format]

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
