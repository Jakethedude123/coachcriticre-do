import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not configured' },
        { status: 500 }
      );
    }

    // Check if publishable key is configured
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured' },
        { status: 500 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });

    // Test Stripe connection by listing products
    const products = await stripe.products.list({ limit: 1 });
    
    // Test price retrieval for the upgrade page price IDs
    const priceIds = [
      'price_1Rhy5X012BmaZggJfi4RRnBq', // Monthly
      'price_1Rhy8G012BmaZggJbcqr7Rfm', // 6 Months
      'price_1Rhy8G012BmaZggJS3SCN4Ot'  // 12 Months
    ];

    const priceResults = [];
    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        priceResults.push({
          priceId,
          status: 'valid',
          active: price.active,
          unitAmount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring
        });
      } catch (error) {
        priceResults.push({
          priceId,
          status: 'invalid',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Stripe is properly configured',
      config: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) + '...',
        publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) + '...'
      },
      products: {
        count: products.data.length,
        hasProducts: products.data.length > 0
      },
      prices: priceResults
    });
  } catch (error) {
    console.error('Stripe test error:', error);
    return NextResponse.json(
      { 
        error: 'Stripe test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 