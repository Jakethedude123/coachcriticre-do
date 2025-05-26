'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/components/CoachCard';
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

      {/* Featured Coaches Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Coaches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CoachCard
              coach={{
                id: 'john-smith',
                name: 'John Smith',
                specialties: ['Powerlifting', 'Strength Training', 'Competition Prep'],
                bio: 'Specializing in strength training and competition prep with 10+ years of experience.',
                profileImageUrl: '/placeholder-coach.jpg',
                rating: 4.9,
                testimonialCount: 127,
                score: 95,
                scoreDetails: {
                  satisfaction: 98,
                  consistency: 95,
                  experience: 100,
                  successRatio: 92,
                  retention: 90
                }
              }}
            />
            <CoachCard
              coach={{
                id: 'sarah-johnson',
                name: 'Sarah Johnson',
                specialties: ['Bodybuilding', 'Figure', 'Contest Prep'],
                bio: 'Professional bodybuilding coach with experience preparing athletes for national shows.',
                profileImageUrl: '/placeholder-coach.jpg',
                rating: 4.8,
                testimonialCount: 98,
                score: 92,
                scoreDetails: {
                  satisfaction: 95,
                  consistency: 90,
                  experience: 95,
                  successRatio: 88,
                  retention: 92
                }
              }}
            />
            <CoachCard
              coach={{
                id: 'mike-davis',
                name: 'Mike Davis',
                specialties: ['Powerlifting', 'Technique', 'Strength Programming'],
                bio: 'Specializing in powerlifting technique and strength programming.',
                profileImageUrl: '/placeholder-coach.jpg',
                rating: 4.9,
                testimonialCount: 156,
                score: 97,
                scoreDetails: {
                  satisfaction: 100,
                  consistency: 98,
                  experience: 95,
                  successRatio: 95,
                  retention: 97
                }
              }}
            />
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/coaches"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Coaches
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Recent Activity</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-lg">Alex Thompson</p>
                    <p className="text-gray-600">Left a review for Coach Mike Davis</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, index) => (
                          <FaStar key={index} className="w-4 h-4" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 ml-2">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  &ldquo;Amazing experience working with Mike! His programming helped me add 50lbs to my squat in just 12 weeks.&rdquo;
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/recent-activity"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              View All Activity
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">What Our Clients Say</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg">John Doe</p>
                  <p className="text-gray-600">Client</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                &ldquo;CoachCritic has transformed how I find and connect with coaches. The verified reviews and detailed profiles make it easy to find the perfect match for my goals.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
