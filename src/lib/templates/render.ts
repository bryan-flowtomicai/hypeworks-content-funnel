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

let fontData: ArrayBuffer | null = null

async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData

  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
  )
  const css = await res.text()

  const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)
  if (!fontUrlMatch) {
    throw new Error('Could not extract Inter font URL from Google Fonts CSS')
  }

  const fontRes = await fetch(fontUrlMatch[1])
  fontData = await fontRes.arrayBuffer()
  return fontData
}

// Fetch multiple weights for better typography
interface FontWeight {
  weight: number
  data: ArrayBuffer
}

async function loadFonts(): Promise<FontWeight[]> {
  const weights = [400, 700, 800]
  const fonts: FontWeight[] = []

  for (const weight of weights) {
    const res = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }
    )
    const css = await res.text()
    const urlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)
    if (urlMatch) {
      const fontRes = await fetch(urlMatch[1])
      fonts.push({ weight, data: await fontRes.arrayBuffer() })
    }
  }

  if (fonts.length === 0) {
    const fallback = await loadFont()
    return [{ weight: 400, data: fallback }]
  }

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
