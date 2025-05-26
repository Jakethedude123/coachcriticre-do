import { NextResponse } from 'next/server';
import { StripeService } from '@/lib/services/StripeService';

export async function POST(request: Request) {
  try {
    const {
      priceId,
      coachStripeAccountId,
      successUrl,
      cancelUrl,
      customerEmail,
    } = await request.json();

    // Validate required fields
    if (!priceId || !coachStripeAccountId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await StripeService.createCheckoutSession(
      priceId,
      coachStripeAccountId,
      successUrl,
      cancelUrl,
      customerEmail
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 