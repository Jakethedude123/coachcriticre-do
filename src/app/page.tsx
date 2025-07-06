'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/app/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';
import SearchBar from '@/components/SearchBar';
import type { Coach } from '@/lib/firebase/models/coach';

// CoachSpotlight carousel key fix - force redeploy
function CoachSpotlight() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/coaches/all')
      .then(res => res.json())
      .then(data => {
        // Filter for Pro coaches, fallback to first 5
        const proCoaches = (data.coaches || []).filter((c: Coach) => c.subscription?.plan === 'pro');
        setCoaches(proCoaches.length > 0 ? proCoaches : (data.coaches || []).slice(0, 5));
      });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (coaches.length < 2) return;
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % coaches.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [coaches]);

  if (!coaches.length) return null;

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">Coach Spotlight</h2>
        <p className="text-gray-500">Meet our top coaches—handpicked for their expertise and results.</p>
      </div>
      <div className="relative max-w-xl mx-auto flex items-center justify-center">
        {coaches.map((coach, idx) => (
          <div
            key={coach.userId || idx}
            className={`absolute left-0 right-0 transition-all duration-700 ${idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'} pointer-events-none`}
            style={{ minHeight: 320 }}
          >
            <CoachCard coach={coach} />
          </div>
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {coaches.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Show coach ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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

      {/* Coach Spotlight Section (moved below features) */}
      <CoachSpotlight />
    </main>
  );
}
