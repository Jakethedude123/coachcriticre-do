"use client";
import React from 'react';
import Link from 'next/link';

async function handleUpgrade(priceId: string) {
  // You may want to get these from user context or environment
  const coachStripeAccountId = undefined; // Set if needed
  const successUrl = window.location.origin + '/upgrade/success';
  const cancelUrl = window.location.origin + '/upgrade/cancel';
  const customerEmail = undefined; // Set if needed

  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, coachStripeAccountId, successUrl, cancelUrl, customerEmail }),
  });
  const data = await res.json();
  if (data.sessionId) {
    window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
  } else {
    alert('Failed to start checkout. Please try again.');
  }
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-start py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Select a plan that fits your needs</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Basic Plan */}
        <div className="bg-black border border-gray-700 rounded-2xl p-8 w-80 flex flex-col items-center shadow-xl">
          <div className="text-4xl font-bold text-white mb-1">$0 <span className="text-base font-normal text-gray-400">Free</span></div>
          <div className="uppercase text-lg font-bold text-white mb-2">Basic</div>
          <div className="text-gray-400 mb-6 text-center">A perfect taste for the creatively curious</div>
          <ul className="text-gray-200 space-y-2 mb-8 w-full">
            <li>✔️ Listed in public search</li>
            <li>✔️ Up to 3 review codes
              <div className="text-xs text-gray-400 italic">Turn real client feedback into your competitive edge.</div>
            </li>
            <li>✔️ One review per client
              <div className="text-xs text-gray-400 italic">Prevents spam. Every review counts.</div>
            </li>
            <li>❌ Custom banner and visual profile branding</li>
            <li>❌ Video intro upload</li>
            <li>❌ Verified coach badge</li>
            <li>❌ Profile insight dashboard</li>
            <li>✔️ Appear in standard search</li>
            <li>✔️ Visible reviews</li>
            <li>❌ Eligible for homepage and IG spotlight</li>
            <li>❌ Early access to beta features</li>
          </ul>
          <button className="button-primary w-full bg-gray-800 text-white py-2 rounded-lg font-semibold cursor-default opacity-60">Stay on Free Plan</button>
        </div>
        {/* Pro Plan - Monthly */}
        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-8 w-80 flex flex-col items-center shadow-2xl">
          <div className="text-4xl font-bold text-gray-900 mb-1">$20 <span className="text-base font-normal text-gray-500">/ month</span></div>
          <div className="uppercase text-lg font-bold text-gray-900 mb-2">Pro</div>
          <div className="text-gray-700 mb-6 text-center">More speed, more features, more fun</div>
          <ul className="text-gray-800 space-y-2 mb-8 w-full">
            <li>✔️ Listed in coach spotlight page</li>
            <li>✔️ Unlimited codes for client verification
              <div className="text-xs text-gray-500 italic">Turn real client feedback into your competitive edge.</div>
            </li>
            <li>✔️ One code per client
              <div className="text-xs text-gray-500 italic">Prevents spam. Every review counts.</div>
            </li>
            <li>✔️ Add banner image and branding</li>
            <li>✔️ Upload a personal coach intro video</li>
            <li>✔️ Pro tier badge on profile</li>
            <li>✔️ Accessible insights dashboard
              <div className="text-xs text-gray-500 italic">Know who's clicking, what they want, and where they found you.</div>
            </li>
            <li>✔️ Eligible for homepage and IG spotlight
              <div className="text-xs text-gray-500 italic">Thousands of eyeballs. One post can change everything.</div>
            </li>
            <li>✔️ Earn rewards for referring users and coaches</li>
            <li>✔️ Priority access to new tools</li>
          </ul>
          <button onClick={() => handleUpgrade('price_1Rhy5X012BmaZggJfi4RRnBq')} className="button-primary w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">Upgrade Monthly</button>
        </div>
        {/* Pro Plan - 6 Months */}
        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-8 w-80 flex flex-col items-center shadow-2xl relative">
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Most Popular</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">$108 every 6 months <span className="text-base font-normal text-gray-500">($18/month)</span></div>
          <div className="uppercase text-lg font-bold text-gray-900 mb-2">Pro <span className="text-green-600 text-base font-semibold ml-2">Save 10%</span></div>
          <div className="text-gray-700 mb-6 text-center">Best value for half-year commitment</div>
          <ul className="text-gray-800 space-y-2 mb-8 w-full">
            <li>✔️ All Pro features</li>
            <li>✔️ Billed every 6 months</li>
            <li>✔️ Save 10% compared to monthly</li>
          </ul>
          <button onClick={() => handleUpgrade('price_1Rhy8G012BmaZggJbcqr7Rfm')} className="button-primary w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">Upgrade 6 Months</button>
        </div>
        {/* Pro Plan - 12 Months */}
        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-8 w-80 flex flex-col items-center shadow-2xl">
          <div className="text-4xl font-bold text-gray-900 mb-1">$192 every 12 months <span className="text-base font-normal text-gray-500">($16/month)</span></div>
          <div className="uppercase text-lg font-bold text-gray-900 mb-2">Pro <span className="text-green-600 text-base font-semibold ml-2">Save 20%</span></div>
          <div className="text-gray-700 mb-6 text-center">Best value for annual commitment</div>
          <ul className="text-gray-800 space-y-2 mb-8 w-full">
            <li>✔️ All Pro features</li>
            <li>✔️ Billed every 12 months</li>
            <li>✔️ Save 20% compared to monthly</li>
          </ul>
          <button onClick={() => handleUpgrade('price_1Rhy8G012BmaZggJS3SCN4Ot')} className="button-primary w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">Upgrade 12 Months</button>
        </div>
      </div>
    </div>
  );
} 