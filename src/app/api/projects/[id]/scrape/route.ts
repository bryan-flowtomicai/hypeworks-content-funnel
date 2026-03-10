import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const url = body.url

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  const scrapeResponse = await fetch(new URL('/api/scrape', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const scrapeData = await scrapeResponse.json()

  if (!scrapeResponse.ok) {
    return NextResponse.json(
      { error: scrapeData.error || 'Failed to scrape URL' },
      { status: scrapeResponse.status }
    )
  }

  const { data: existing, error: fetchError } = await supabase
    .from('submissions')
    .select('product_data')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('submissions')
    .update({
      product_data: {
        ...(existing?.product_data || {}),
        scraped_data: scrapeData.productData,
      },
    })
    .eq('id', params.id)
    .eq('user_id', session.user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, scrapedData: scrapeData.productData })
}
