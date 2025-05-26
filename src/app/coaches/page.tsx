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
  const { user } = useAuth();
  const router = useRouter();

  const handleFiltersChange = useCallback(async (filters: Partial<SearchFilters>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('/api/coaches/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
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
  }, [sortByScore, handleFiltersChange]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="col-span-1">
            <div className="sticky top-4">
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
                </div>
              </div>
              <AuthRequiredSearch>
                <CoachSearchFilters onFiltersChange={handleFiltersChange} />
              </AuthRequiredSearch>
            </div>
          </div>

          {/* Coaches Grid */}
          <div className="col-span-3">
            {loading && coaches.length === 0 ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : coaches.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">
                  {!user 
                    ? "Sign in to use search filters and find your perfect coach"
                    : "No coaches found matching your criteria"
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {coaches.map((coach) => (
                    <Link
                      key={coach.id}
                      href={`/coaches/${coach.id}`}
                      onClick={() => handleCoachClick(coach.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <CoachCard 
                        coach={{
                          ...coach,
                          rating: coach.rating || 0,
                          testimonialCount: coach.testimonialCount || 0
                        }} 
                      />
                    </Link>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 