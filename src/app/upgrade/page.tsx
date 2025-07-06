import React from 'react';
import Link from 'next/link';

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
            <li>✔️ 80 monthly video credits</li>
            <li>✔️ Access to core features</li>
            <li>❌ Purchase more roll over video credits</li>
            <li>❌ Download videos with no watermark</li>
            <li>❌ Commercial use</li>
          </ul>
          <button className="button-primary w-full bg-gray-800 text-white py-2 rounded-lg font-semibold cursor-default opacity-60">Current Plan</button>
        </div>
        {/* Pro Plan */}
        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-8 w-80 flex flex-col items-center shadow-2xl">
          <div className="text-4xl font-bold text-gray-900 mb-1">$28 <span className="text-base font-normal text-gray-500">/ month</span></div>
          <div className="uppercase text-lg font-bold text-gray-900 mb-2">Pro</div>
          <div className="text-gray-700 mb-6 text-center">More speed, more features, more fun</div>
          <ul className="text-gray-800 space-y-2 mb-8 w-full">
            <li>✔️ 2300 monthly video credits</li>
            <li>✔️ Access to all features</li>
            <li>✔️ Faster generations</li>
            <li>✔️ Purchase more roll over video credits</li>
            <li>✔️ Download videos with no watermark</li>
            <li>✔️ Commercial use</li>
          </ul>
          <button className="button-primary w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">Upgrade to Pro</button>
        </div>
      </div>
    </div>
  );
} 