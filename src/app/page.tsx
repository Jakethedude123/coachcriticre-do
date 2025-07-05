'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/app/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';
import SearchBar from '@/components/SearchBar';

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
      router.push(`/coaches?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Perfect Bodybuilding or Lifestyle Coach for You
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with experienced coaches who can help you achieve your physique, health, and fitness goals—whether you're aiming for the stage or just want to get in shape.
            </p>
            {/* Search Bar */}
            <SearchBar />
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
                Find certified coaches with proven track records in bodybuilding and lifestyle transformation.
              </p>
            </div>

            {/* Competition Prep */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <FaTrophy size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Competition & Lifestyle Prep</h2>
              <p className="text-gray-600 text-lg">
                Get specialized guidance for your next bodybuilding show—or expert help to get lean, healthy, and confident for everyday life.
              </p>
            </div>

            {/* Verified Reviews */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <FaUserCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verified Reviews</h2>
              <p className="text-gray-600 text-lg">
                Read authentic reviews from real clients to find your perfect bodybuilding or lifestyle coaching match.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
