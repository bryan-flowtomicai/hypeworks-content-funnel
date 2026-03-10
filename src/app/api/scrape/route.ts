import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function extractText(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern)
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : null
}

function extractAll(html: string, pattern: RegExp): string[] {
  const results: string[] = []
  let match
  const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    if (text && text.length > 3) results.push(text)
  }
  return results
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
}

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
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${response.status})` },
        { status: 400 }
      )
    }

    const html = await response.text()
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

      const bulletHtml = html.match(/id="feature-bullets"[\s\S]*?<ul[\s\S]*?<\/ul>/i)
      if (bulletHtml) {
        features = extractAll(bulletHtml[0], /<span[^>]*class="a-list-item"[^>]*>([\s\S]*?)<\/span>/gi)
      }
      if (!features.length) {
        features = extractAll(html, /<li[^>]*><span[^>]*class="a-list-item"[^>]*>([\s\S]*?)<\/span>/gi)
      }

      const descBlock = html.match(/id="productDescription"[\s\S]*?<\/div>/i)
      if (descBlock) {
        description = stripHtml(descBlock[0]).substring(0, 500)
      }

      const breadcrumbs = extractAll(html, /class="a-link-normal a-color-tertiary"[^>]*>([\s\S]*?)<\/a>/gi)
      if (breadcrumbs.length) {
        category = breadcrumbs[breadcrumbs.length - 1]
      }
    }

    if (!productName) {
      productName = extractText(html, /<title[^>]*>([^<]+)/i)
    }
    if (!description) {
      description =
        extractText(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ??
        extractText(html, /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    }
    if (!brandName) {
      brandName = extractText(html, /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)
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

    return NextResponse.json({
      product_name: productName ?? '',
      brand_name: brandName ?? '',
      description: description ?? '',
      key_features: features,
      category: category ?? '',
      source_url: url,
    })
  } catch (err) {
    console.error('Scrape error:', err)
    return NextResponse.json(
      { error: 'Failed to scrape URL. Check the link and try again.' },
      { status: 500 }
    )
  }
}
