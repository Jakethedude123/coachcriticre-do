'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CoachSearchFilters from '@/components/CoachSearchFilters';
import { SearchFilters } from '@/lib/firebase/coachUtils';

export default function FindCoachesPage() {
  const router = useRouter();

  function handleFiltersChange(filters: Partial<SearchFilters>) {
    // Convert filters to query params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value !== undefined && value !== null && value !== '' && value !== false) {
        params.set(key, String(value));
      }
    });
    router.push(`/coaches/search-results?${params.toString()}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Coaches</h1>
      <CoachSearchFilters onFiltersChange={handleFiltersChange} />
    </div>
  );
} 