"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { CoachListing } from '@/lib/firebase/models/coach';
import { loadStripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface PurchasePackageProps {
  listing: CoachListing;
  coachName: string;
  coachStripeAccountId: string;
}

export default function PurchasePackage({ 
  listing,
  coachName,
  coachStripeAccountId
}: PurchasePackageProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: listing.stripePriceId,
          coachStripeAccountId,
          successUrl: `${window.location.origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
          customerEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold mb-4">{listing.title}</h3>
      <p className="text-gray-600 mb-4">{listing.description}</p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Duration:</span>
          <span>{listing.duration}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Price:</span>
          <span className="text-xl font-bold">${(listing.price / 100).toFixed(2)}</span>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">What&apos;s included:</h4>
          <ul className="space-y-2">
            {listing.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={isLoading || !listing.active}
        className={`
          w-full py-3 px-4 rounded-lg
          ${listing.active
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          transition-colors
          flex items-center justify-center
        `}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : listing.active ? (
          `Purchase Package from ${coachName}`
        ) : (
          'Package Currently Unavailable'
        )}
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Secure payment powered by Stripe
      </p>

      <p className="text-gray-600">
        Don&apos;t miss out on this opportunity to work with a top-rated coach.
      </p>
    </div>
  );
} 