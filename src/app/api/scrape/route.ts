import FirecrawlApp from 'firecrawl'
import { NextRequest, NextResponse } from 'next/server'

interface ScrapedProduct {
  title?: string
  price?: string
  rating?: string
  description?: string
  images?: string[]
  features?: string[]
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Initialize Firecrawl
    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    })

    // Scrape the product page
    const scrapeResult = await app.scrape(url, {
      formats: ['markdown'],
    })

    if (!scrapeResult) {
      return NextResponse.json(
        { error: 'Failed to scrape URL' },
        { status: 400 }
      )
    }

    // Parse the scraped data to extract product information
    const productData: ScrapedProduct = {
      originalUrl: url,
      title: scrapeResult.metadata?.title || 'Product Title',
      description: scrapeResult.markdown || '',
      rawContent: scrapeResult.markdown || '',
    }

    return NextResponse.json({
      success: true,
      productData,
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape product data' },
      { status: 500 }
    )
  }
}
