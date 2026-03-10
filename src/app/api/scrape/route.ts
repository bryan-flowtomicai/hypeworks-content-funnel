import FirecrawlApp from 'firecrawl'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

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

    const htmlResponse = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
      },
    })
    const $ = cheerio.load(htmlResponse.data)

    const pageTitle = $('#productTitle').text().trim() || $('title').text().trim()
    const bulletPoints = $('#feature-bullets li')
      .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
      .get()
      .filter(Boolean)
      .slice(0, 8)

    const imageCandidates = [
      $('#landingImage').attr('src'),
      ...$('#altImages img')
        .map((_, el) => $(el).attr('src') || $(el).attr('data-src'))
        .get(),
    ].filter(Boolean) as string[]

    const price =
      $('#corePriceDisplay_desktop_feature_div .a-offscreen').first().text().trim() ||
      $('.a-price .a-offscreen').first().text().trim()
    const rating = $('span[data-hook="rating-out-of-text"]').first().text().trim()
    const description =
      $('#productDescription').text().trim() ||
      $('#feature-bullets').text().replace(/\s+/g, ' ').trim()

    const productData: ScrapedProduct = {
      originalUrl: url,
      title: pageTitle || 'Product Title',
      price,
      rating,
      description,
      images: imageCandidates.slice(0, 8),
      features: bulletPoints,
      rawContent: description,
    }

    // Fallback for JS-rendered pages using Firecrawl if needed.
    if ((!productData.description || !productData.features?.length) && process.env.FIRECRAWL_API_KEY) {
      const app = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY,
      })
      const scrapeResult = await app.scrape(url, { formats: ['markdown'] })
      if (scrapeResult?.markdown) {
        productData.description = scrapeResult.markdown
        productData.rawContent = scrapeResult.markdown
      }
      if (scrapeResult?.metadata?.title && !productData.title) {
        productData.title = scrapeResult.metadata.title
      }
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
