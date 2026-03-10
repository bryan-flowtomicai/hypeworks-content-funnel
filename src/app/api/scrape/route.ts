import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// ─── Firecrawl: fetch clean markdown from any URL ───────────────────────────

async function scrapeWithFirecrawl(url: string): Promise<string | null> {
  if (!FIRECRAWL_API_KEY) return null

  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 30000,
      }),
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data?.markdown ?? null
  } catch {
    return null
  }
}

// ─── Basic fetch fallback ───────────────────────────────────────────────────

async function scrapeWithFetch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

// ─── Claude: extract structured product data from page content ──────────────

type ExtractedProduct = {
  product_name: string
  brand_name: string
  description: string
  key_features: string[]
  target_audience: string
  category: string
}

async function extractWithClaude(
  content: string,
  sourceUrl: string
): Promise<ExtractedProduct | null> {
  if (!ANTHROPIC_API_KEY) return null

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

  const truncated = content.substring(0, 15000)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a product data extraction assistant. Analyze the following webpage content from ${sourceUrl} and extract structured product information.

Return ONLY valid JSON with these fields (no markdown, no explanation):
{
  "product_name": "full product name without store/site name",
  "brand_name": "brand or manufacturer name",
  "description": "2-3 sentence product description highlighting key selling points",
  "key_features": ["feature 1", "feature 2", ...up to 8 features],
  "target_audience": "who this product is for (e.g. 'fitness enthusiasts', 'home office workers')",
  "category": "product category (e.g. 'Electronics', 'Home & Kitchen')"
}

If a field cannot be determined, use an empty string or empty array.

PAGE CONTENT:
${truncated}`,
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])

    return {
      product_name: String(parsed.product_name || '').trim(),
      brand_name: String(parsed.brand_name || '').trim(),
      description: String(parsed.description || '').trim(),
      key_features: Array.isArray(parsed.key_features)
        ? parsed.key_features.map(String).filter(Boolean).slice(0, 8)
        : [],
      target_audience: String(parsed.target_audience || '').trim(),
      category: String(parsed.category || '').trim(),
    }
  } catch (err) {
    console.error('Claude extraction error:', err)
    return null
  }
}

// ─── Regex fallback for raw HTML ────────────────────────────────────────────

function extractText(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern)
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : null
}

function extractAll(html: string, pattern: RegExp): string[] {
  const results: string[] = []
  let match
  const regex = new RegExp(
    pattern.source,
    pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
  )
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    if (text && text.length > 3) results.push(text)
  }
  return results
}

function extractWithRegex(html: string, url: string): ExtractedProduct {
  const isAmazon = url.includes('amazon.com') || url.includes('amazon.co')

  let productName: string | null = null
  let brandName: string | null = null
  let description: string | null = null
  let features: string[] = []
  let category: string | null = null

  if (isAmazon) {
    productName =
      extractText(html, /id="productTitle"[^>]*>([^<]+)/i) ??
      extractText(html, /<title[^>]*>([^<]+)/i)

    brandName =
      extractText(html, /id="bylineInfo"[^>]*>(?:.*?by\s+)?([^<]+)/i) ??
      extractText(html, /class="po-break-word"[^>]*>([^<]+)/i)

    const bulletHtml = html.match(
      /id="feature-bullets"[\s\S]*?<ul[\s\S]*?<\/ul>/i
    )
    if (bulletHtml) {
      features = extractAll(
        bulletHtml[0],
        /<span[^>]*class="a-list-item"[^>]*>([\s\S]*?)<\/span>/gi
      )
    }
    if (!features.length) {
      features = extractAll(
        html,
        /<li[^>]*><span[^>]*class="a-list-item"[^>]*>([\s\S]*?)<\/span>/gi
      )
    }

    const descBlock = html.match(/id="productDescription"[\s\S]*?<\/div>/i)
    if (descBlock) {
      description = descBlock[0]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500)
    }

    const breadcrumbs = extractAll(
      html,
      /class="a-link-normal a-color-tertiary"[^>]*>([\s\S]*?)<\/a>/gi
    )
    if (breadcrumbs.length) category = breadcrumbs[breadcrumbs.length - 1]
  }

  if (!productName) productName = extractText(html, /<title[^>]*>([^<]+)/i)
  if (!description) {
    description =
      extractText(
        html,
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
      ) ??
      extractText(
        html,
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
      )
  }
  if (!brandName) {
    brandName = extractText(
      html,
      /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i
    )
  }

  if (productName) {
    productName = productName
      .replace(/Amazon\.com\s*:\s*/i, '')
      .replace(/\s*[-|]\s*Amazon.*$/i, '')
      .trim()
  }

  features = features
    .map((f) => f.trim())
    .filter((f) => f.length > 5 && f.length < 300)
    .slice(0, 8)

  return {
    product_name: productName ?? '',
    brand_name: brandName ?? '',
    description: description ?? '',
    key_features: features,
    target_audience: '',
    category: category ?? '',
  }
}

// ─── Main handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const url: string | undefined = body.url

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    let method: 'ai' | 'regex' = 'regex'

    // Step 1: get page content — Firecrawl first, then basic fetch
    let content = await scrapeWithFirecrawl(url)
    const usedFirecrawl = !!content

    if (!content) {
      content = await scrapeWithFetch(url)
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Could not fetch the page. Check the URL and try again.' },
        { status: 400 }
      )
    }

    // Step 2: extract structured data — Claude first, then regex
    let extracted = await extractWithClaude(content, url)

    if (extracted) {
      method = 'ai'
    } else {
      // Claude unavailable or failed — fall back to regex on raw HTML
      // If we used Firecrawl (content is markdown), re-fetch raw HTML for regex
      const rawHtml = usedFirecrawl ? await scrapeWithFetch(url) : content
      extracted = extractWithRegex(rawHtml ?? '', url)
    }

    return NextResponse.json({
      ...extracted,
      source_url: url,
      extraction_method: method,
    })
  } catch (err) {
    console.error('Scrape error:', err)
    return NextResponse.json(
      { error: 'Failed to extract product data. Check the URL and try again.' },
      { status: 500 }
    )
  }
}
