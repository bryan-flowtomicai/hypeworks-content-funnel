import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface Params {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('generated_images, created_at')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({
    images: (data.generated_images || []).map((url) => ({
      public_url: url,
      created_at: data.created_at,
    })),
  })
}
