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

  const { data, error } = await supabase
    .from('submissions')
    .select('id, product_data')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const response = await fetch(new URL('/api/generate-images', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionId: data.id,
      productData: data.product_data || {},
    }),
  })
  const result = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: result.error || 'Generation failed' },
      { status: response.status }
    )
  }

  return NextResponse.json(result)
}
