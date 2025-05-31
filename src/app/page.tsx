'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/app/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = () => {
    if (!user && searchQuery.trim()) {
      localStorage.setItem('pendingSearch', searchQuery.trim());
      router.push('/login?message=' + encodeURIComponent('Please log in or sign up to search for coaches'));
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/coaches/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Bodybuilding or Powerlifting Coach
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with experienced coaches who can help you achieve your strength and physique goals
            </p>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
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
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Expert Coaches */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <FaDumbbell size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Expert Coaches</h2>
              <p className="text-gray-600 text-lg">
                Find certified coaches with proven track records in bodybuilding and powerlifting
              </p>
            </div>

            {/* Competition Prep */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <FaTrophy size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Competition Prep</h2>
              <p className="text-gray-600 text-lg">
                Get specialized guidance for your next bodybuilding show or powerlifting meet
              </p>
            </div>

            {/* Verified Reviews */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <FaUserCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verified Reviews</h2>
              <p className="text-gray-600 text-lg">
                Read authentic reviews from real clients to find your perfect coaching match
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
