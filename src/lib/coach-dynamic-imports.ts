import dynamic from 'next/dynamic';

export const MarketInsights = dynamic(() => import('@/components/coach/MarketInsights'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export const AdvancedAnalytics = dynamic(() => import('@/components/coach/AdvancedAnalytics'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export const PurchasePackage = dynamic(() => import('@/components/coach/PurchasePackage'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export const TierSubscription = dynamic(() => import('@/components/coach/TierSubscription'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export const EarningsDashboard = dynamic(() => import('@/components/coach/EarningsDashboard'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export const ListingManager = dynamic(() => import('@/components/coach/ListingManager'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
}); 