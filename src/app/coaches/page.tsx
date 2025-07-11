"use client";

import { useState, useEffect, useCallback } from 'react';
import { searchCoaches, type SearchFilters } from '@/lib/firebase/coachUtils';
import CoachSearchFilters from '@/components/CoachSearchFilters';
import CoachCard from '@/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { CoachProfile } from '@/lib/types/coach';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip';
import AuthRequiredSearch from '@/components/AuthRequiredSearch';
import Link from 'next/link';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortByScore, setSortByScore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({ sortByScore });
  const { user } = useAuth();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false); // for mobile

  const handleFiltersChange = useCallback(async (newFilters: Partial<SearchFilters>) => {
    if (!user) return;
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setLoading(true);
    try {
      const response = await fetch('/api/coaches/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFilters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coaches');
      }

      const data = await response.json();
      setCoaches(data.coaches);
      setLastDoc(data.lastDoc);
      setHasMore(data.hasMore);

      // Track search appearances for each coach
      await Promise.all(
        data.coaches.map((coach: { id: string }) =>
          fetch('/api/coaches/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coachId: coach.id,
              eventType: 'searchAppearance',
            }),
          })
        )
      );
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const result = await searchCoaches({ sortByScore } as SearchFilters, lastDoc);
      setCoaches(prev => [...prev, ...result.coaches]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      // Track search appearances for each coach
      await Promise.all(
        result.coaches.map((coach: { id: string }) =>
          fetch('/api/coaches/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coachId: coach.id,
              eventType: 'searchAppearance',
            }),
          })
        )
      );
    } catch (error) {
      console.error('Error loading more coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoachClick = async (coachId: string) => {
    // Track profile click
    try {
      await fetch('/api/coaches/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId,
          eventType: 'profileClick',
        }),
      });
    } catch (error) {
      console.error('Error tracking profile click:', error);
    }
  };

  useEffect(() => {
    handleFiltersChange({ sortByScore });
  }, [sortByScore, handleFiltersChange, filters]);

  return (
    <div className="min-h-screen bg-white dark:bg-transparent py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Mobile Filters Toggle */}
        <div className="sm:hidden flex justify-between items-center mb-4">
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-8">
          {/* Filters Sidebar (mobile collapsible, desktop sticky) */}
          <div className={`sm:col-span-2 max-w-md ${filtersOpen ? '' : 'hidden sm:block'}`}>
            <div className="sm:sticky sm:top-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Find Your Coach</h2>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <label className="flex items-center space-x-2 text-base">
                    <input
                      type="checkbox"
                      checked={sortByScore}
                      onChange={(e) => setSortByScore(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Sort by Score</span>
                  </label>
                  <span>
                    <Tooltip
                      content={
                        <div className="w-[600px] grid grid-cols-5 gap-4">
                          <div className="col-span-5 mb-1">
                            <p className="font-medium text-center">Coach Score Components</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-300">Satisfaction</p>
                            <p className="text-sm">20%</p>
                            <p className="text-xs mt-1">Recent client reviews and feedback</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-300">Consistency</p>
                            <p className="text-sm">25%</p>
                            <p className="text-xs mt-1">Success rate with clients</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-300">Experience</p>
                            <p className="text-sm">15%</p>
                            <p className="text-xs mt-1">Years coaching and achievements</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-300">Success Ratio</p>
                            <p className="text-sm">25%</p>
                            <p className="text-xs mt-1">Client transformations and preps</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-blue-300">Retention</p>
                            <p className="text-sm">15%</p>
                            <p className="text-xs mt-1">Long-term client relationships</p>
                          </div>
                        </div>
                      }
                    >
                      <FaInfoCircle className="text-blue-500 hover:text-blue-600 cursor-help w-5 h-5" />
                    </Tooltip>
                  </span>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[70vh] pr-2">
              <AuthRequiredSearch>
                <CoachSearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
              </AuthRequiredSearch>
              </div>
            </div>
          </div>

          {/* Coaches Grid - right side, single column on mobile, cards full width */}
          <div className="sm:col-span-3 flex flex-col gap-4 sm:gap-6 items-start w-full">
            {loading && coaches.length === 0 ? (
              <div className="space-y-4 w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : coaches.length === 0 ? (
              <p>No coaches found.</p>
            ) : (
              <ul className="space-y-4 sm:space-y-6 w-full">
                {coaches.slice(0, 6).map((coach) => (
                  <li key={coach.id || coach.userId} className="w-full">
                    <CoachCard 
                      coach={{
                        id: coach.id || coach.userId,
                        name: coach.name,
                        specialties: coach.specialties || [],
                        bio: coach.bio || '',
                        profileImageUrl: coach.profileImage || '/placeholder-coach.jpg',
                        rating: coach.rating || 0,
                        testimonialCount: coach.testimonialCount || 0,
                        clientTypes: Array.isArray(coach.clientTypes)
                          ? coach.clientTypes
                          : coach.clientTypes
                            ? Object.entries(coach.clientTypes)
                                .filter(([_, v]) => v)
                                .map(([k]) => k)
                            : [],
                        divisions: coach.divisions || [],
                        federations: coach.federations || [],
                      }}
                      small
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 