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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:bg-gradient-to-br dark:from-[#0A0D12] dark:via-[#0F1419] dark:to-[#181d23] flex flex-col items-center justify-start py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1565C0] dark:text-[#4FC3F7] mb-4">Choose Your Growth Path</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Unlock your potential with powerful tools and insights designed to help you attract more clients and grow your coaching business.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-3xl p-8 w-full lg:w-80 flex flex-col items-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="text-5xl font-bold text-white mb-2">$0 <span className="text-xl font-normal text-gray-400">Free</span></div>
          <div className="uppercase text-xl font-bold text-white mb-3 tracking-wider">Basic</div>
          <div className="text-gray-300 mb-8 text-center leading-relaxed">Perfect for getting started. Unlock more exposure and growth—don't miss out on new clients by staying basic.</div>
          <ul className="text-gray-200 space-y-3 mb-8 w-full">
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-lg">✔️</span>
              <span>Listed in public search</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-lg">✔️</span>
              <div>
                <span>Up to 3 review codes</span>
                <div className="text-xs text-gray-400 italic mt-1">Turn real client feedback into your competitive edge.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-lg">✔️</span>
              <div>
                <span>One review per client</span>
                <div className="text-xs text-gray-400 italic mt-1">Prevents spam. Every review counts.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Custom banner and visual profile branding</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Video intro upload</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Verified coach badge</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Profile insight dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-lg">✔️</span>
              <span>Appear in standard search</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-lg">✔️</span>
              <span>Visible reviews</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Eligible for homepage and IG spotlight</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-3 text-lg">❌</span>
              <span>Early access to beta features</span>
            </li>
          </ul>
          <button className="w-full bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold cursor-default opacity-60 transition-all duration-200">Stay on Free Plan</button>
        </div>

        {/* Pro Plan - Monthly */}
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-[#1565C0] rounded-3xl p-8 w-full lg:w-80 flex flex-col items-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative">
          <div className="text-5xl font-bold text-[#1565C0] mb-2">$20 <span className="text-xl font-normal text-gray-600">/ month</span></div>
          <div className="uppercase text-xl font-bold text-[#1565C0] mb-3 tracking-wider">Pro</div>
          <div className="text-gray-700 mb-8 text-center leading-relaxed">Take action with insights and tools to generate more leads and grow your coaching business.</div>
          <ul className="text-gray-800 space-y-3 mb-8 w-full">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Listed in coach spotlight page</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <div>
                <span>Unlimited codes for client verification</span>
                <div className="text-xs text-gray-500 italic mt-1">Turn real client feedback into your competitive edge.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <div>
                <span>One code per client</span>
                <div className="text-xs text-gray-500 italic mt-1">Prevents spam. Every review counts.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Add banner image and branding</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Upload a personal coach intro video</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Pro tier badge on profile</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <div>
                <span>Accessible insights dashboard</span>
                <div className="text-xs text-gray-500 italic mt-1">Know who's clicking, what they want, and where they found you.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <div>
                <span>Eligible for homepage and IG spotlight</span>
                <div className="text-xs text-gray-500 italic mt-1">Thousands of eyeballs. One post can change everything.</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Earn rewards for referring users and coaches</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Priority access to new tools</span>
            </li>
          </ul>
          <button 
            onClick={() => handleUpgrade('price_1Rhy5X012BmaZggJfi4RRnBq')} 
            className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#0D47A1] hover:to-[#1565C0] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Upgrade Monthly
          </button>
        </div>

        {/* Pro Plan - 6 Months */}
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-[#1565C0] rounded-3xl p-8 w-full lg:w-80 flex flex-col items-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">Most Popular</div>
          <div className="text-5xl font-bold text-[#1565C0] mb-2">$108 <span className="text-xl font-normal text-gray-600">every 6 months</span></div>
          <div className="text-sm text-gray-600 mb-1">($18/month)</div>
          <div className="uppercase text-xl font-bold text-[#1565C0] mb-3 tracking-wider">Pro <span className="text-green-600 text-base font-semibold ml-2">Save 10%</span></div>
          <div className="text-gray-700 mb-8 text-center leading-relaxed">Best value for half-year commitment</div>
          <ul className="text-gray-800 space-y-3 mb-8 w-full">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>All Pro features</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Billed every 6 months</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Save 10% compared to monthly</span>
            </li>
          </ul>
          <button 
            onClick={() => handleUpgrade('price_1Rhy8G012BmaZggJbcqr7Rfm')} 
            className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#0D47A1] hover:to-[#1565C0] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Upgrade 6 Months
          </button>
        </div>

        {/* Pro Plan - 12 Months */}
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-[#1565C0] rounded-3xl p-8 w-full lg:w-80 flex flex-col items-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="text-5xl font-bold text-[#1565C0] mb-2">$192 <span className="text-xl font-normal text-gray-600">every 12 months</span></div>
          <div className="text-sm text-gray-600 mb-1">($16/month)</div>
          <div className="uppercase text-xl font-bold text-[#1565C0] mb-3 tracking-wider">Pro <span className="text-green-600 text-base font-semibold ml-2">Save 20%</span></div>
          <div className="text-gray-700 mb-8 text-center leading-relaxed">Best value for annual commitment</div>
          <ul className="text-gray-800 space-y-3 mb-8 w-full">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>All Pro features</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Billed every 12 months</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-lg">✔️</span>
              <span>Save 20% compared to monthly</span>
            </li>
          </ul>
          <button 
            onClick={() => handleUpgrade('price_1Rhy8G012BmaZggJS3SCN4Ot')} 
            className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#0D47A1] hover:to-[#1565C0] transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Upgrade 12 Months
          </button>
        </div>
      </div>
    </div>
  );
} 