import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      hasPublishableKey: true,
      keyPrefix: publishableKey.substring(0, 7) + '...',
      keyLength: publishableKey.length,
      isTestKey: publishableKey.startsWith('pk_test_'),
      isLiveKey: publishableKey.startsWith('pk_live_')
    });
  } catch (error) {
    console.error('Stripe config check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check Stripe configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 