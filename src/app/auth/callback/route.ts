import { createServerClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          plan: 'free',
          submission_count: 0,
        })

      if (insertError && insertError.code !== '23505') {
        console.error('Error creating user profile:', insertError)
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
