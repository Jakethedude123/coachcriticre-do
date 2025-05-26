'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaDumbbell, FaTrophy, FaClock } from 'react-icons/fa';
import { searchCoaches } from '@/lib/firebase/firebaseUtils';
import { Coach } from '@/lib/firebase/models/coach';
import Image from 'next/image';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        
        const filters = {
          trainingStyle: searchParams.get('trainingStyle')?.split(','),
          responseTime: searchParams.get('responseTime') || undefined,
          minRating: Number(searchParams.get('minRating')) || undefined,
          minTestimonials: Number(searchParams.get('minTestimonials')) || undefined,
          credentials: searchParams.get('credentials')?.split(','),
          yearsExperience: searchParams.get('yearsExperience') || undefined,
          specialties: searchParams.get('specialties')?.split(','),
          coachingModality: searchParams.get('coachingModality') || undefined,
          maxMonthlyPrice: Number(searchParams.get('maxMonthlyPrice')) || undefined,
          maxHourlyPrice: Number(searchParams.get('maxHourlyPrice')) || undefined,
          divisions: searchParams.get('divisions')?.split(','),
          clientTypes: searchParams.get('clientTypes')?.split(','),
          federations: searchParams.get('federations')?.split(','),
          searchQuery: searchParams.get('q') || undefined
        };

        const results = await searchCoaches(filters);
        setCoaches(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [searchParams]);

  const loadMore = async () => {
    if (!hasMore) return;

    try {
      const filters = {
        // ... same filters as above ...
        lastDoc
      };

      const results = await searchCoaches(filters);
      
      if (results.length === 0) {
        setHasMore(false);
        return;
      }

      setCoaches((prev) => [...prev, ...results]);
      setLastDoc(results[results.length - 1]);
    } catch (error) {
      console.error('Error loading more coaches:', error);
    }
  };

  function formatPricing(coach: Coach): string {
    return `$${coach.pricing.rate} ${coach.pricing.currency}/${coach.pricing.interval}`;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700">Error: {error.message}</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters to see more results
          </p>
          <Link
            href="/coaches"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        <Link
          href="/coaches"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          Modify Search
        </Link>
      </div>

      {coaches.length > 0 ? (
        <>
          <div className="space-y-6">
            {coaches.map((coach) => (
              <Link
                href={`/coaches/${coach.userId}`}
                key={coach.userId}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={coach.avatar || '/placeholder-coach.jpg'}
                        alt={coach.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{coach.name}</h2>
                          <div className="mt-1 flex items-center text-gray-600">
                            <FaMapMarkerAlt className="mr-2" />
                            {coach.location.city}, {coach.location.state}
                          </div>
                          <div className="mt-1 flex items-center text-gray-600">
                            <FaClock className="mr-2" />
                            {coach.experience} experience
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-blue-600 font-semibold whitespace-nowrap">
                            {formatPricing(coach)}
                          </span>
                          <span className="text-sm text-gray-500">{coach.experience}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {coach.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Load More Results
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700">No coaches found matching your criteria</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters to see more results
          </p>
          <Link
            href="/coaches"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
} 