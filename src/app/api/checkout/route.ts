import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    // Initialize Stripe and Supabase inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-02-25.clover' as any,
    })

    // Initialize Supabase inside the handler
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    // Check if user has already submitted (free tier = 1 free submission)
    const { data: submissions, error: fetchError } = await supabase
      .from('submissions')
      .select('id')
      .eq('user_id', userId)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch user submissions' },
        { status: 500 }
      )
    }

    // If user has already submitted, require payment
    const needsPayment = submissions && submissions.length > 0

    if (!needsPayment) {
      // First submission is free - mark it as free
      return NextResponse.json({
        sessionId: 'free',
        free: true,
      })
    }

    // Create Stripe checkout session for additional submissions
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'A+ Content Generation',
              description: 'Generate AI-powered A+ content for your product listing',
            },
            unit_amount: 2999, // $29.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/create`,
      customer_email: email,
      metadata: {
        userId,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      free: false,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
