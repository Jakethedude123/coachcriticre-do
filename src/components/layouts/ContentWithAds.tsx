"use client";

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import AdUnit with no SSR
const AdUnit = dynamic(() => import('../ads/AdUnit'), { ssr: false });

interface Props {
  children: ReactNode;
  showSidebar?: boolean;
  showBanner?: boolean;
}

export default function ContentWithAds({
  children,
  showSidebar = true,
  showBanner = false
}: Props) {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Optional Top Banner Ad */}
      {showBanner && (
        <div className="mb-6">
          <AdUnit size="banner" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Sidebar Ads */}
        {showSidebar && (
          <aside className="w-full lg:w-[300px] space-y-6">
            <div className="sticky top-6">
              <AdUnit size="sidebar" />
              
              {/* Optional second sidebar ad with more space in between */}
              <div className="hidden xl:block mt-6">
                <AdUnit size="sidebar" />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
} 