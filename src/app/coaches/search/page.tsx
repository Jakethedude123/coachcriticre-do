'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import CoachCard from '@/app/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';

export default function CoachSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const handleSearch = () => {
    if (!user && searchQuery.trim()) {
      localStorage.setItem('pendingSearch', searchQuery.trim());
      window.location.href = '/login?message=' + encodeURIComponent('Please log in or sign up to search for coaches');
      return;
    }
    if (searchQuery.trim()) {
      window.location.href = `/coaches/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Coach</h1>
          <p className="text-xl text-gray-600 mb-8">
            Search through our network of experienced bodybuilding and powerlifting coaches
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search coaches by name, specialty, or location..."
                className="w-full p-4 pr-12 text-lg rounded-lg border-2 border-blue-400 shadow-lg focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-xl"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-12">
          {searchParams.get('q') ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Search Results for "{searchParams.get('q')}"
              </h2>
              {/* Add search results here */}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Enter a search term to find coaches
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 