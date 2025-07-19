'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';
import SearchBar from '@/components/SearchBar';
import type { Coach } from '@/lib/firebase/models/coach';

// Modern Coach Spotlight - Working Carousel
function CoachSpotlight() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/coaches/all')
      .then(res => res.json())
      .then(data => {
        // Get up to 5 coaches for the carousel
        const availableCoaches = data.coaches || [];
        setCoaches(availableCoaches.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (coaches.length < 2) return;
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % coaches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [coaches]);

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-transparent py-6">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-5xl font-extrabold mb-3 text-blue-900 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Coach Spotlight
          </h2>
          <p className="text-xl font-semibold text-gray-700 mb-2">Meet our top coaches—handpicked for their expertise and results.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex">
              <div className="w-32 h-32 bg-gray-200 rounded-lg mr-6"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!coaches.length) return null;

  return (
    <section className="w-full bg-white dark:bg-transparent py-6">
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h2 className="text-5xl font-extrabold mb-3 text-blue-900 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
          Coach Spotlight
        </h2>
        <p className="text-xl font-semibold text-gray-700 mb-2">Meet our top coaches—handpicked for their expertise and results.</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>
      <div className="max-w-3xl mx-auto px-4 relative">
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-2xl">
          {coaches.map((coach, idx) => (
            <div
              key={coach.userId || idx}
              className={`absolute left-0 right-0 transition-all duration-700 ${
                idx === current 
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
            >
              <CoachCard coach={coach} />
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        {coaches.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {coaches.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === current 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Show coach ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Navigation Arrows */}
        {coaches.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
              onClick={() => setCurrent(c => (c - 1 + coaches.length) % coaches.length)}
              aria-label="Previous coach"
            >
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
              onClick={() => setCurrent(c => (c + 1) % coaches.length)}
              aria-label="Next coach"
            >
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: <FaDumbbell size={32} color="#4FC3F7" />,
    title: "Expert Coaches",
    description: "Find certified bodybuilding and powerlifting coaches with proven track records in transformation.",
    accent: "border-blue-600"
  },
  {
    icon: <FaTrophy size={32} color="#4FC3F7" />,
    title: "Competition & Meet Prep",
    description: "Get specialized guidance for your next bodybuilding show or powerlifting meet—from prep to peak performance.",
    accent: "border-yellow-500"
  },
  {
    icon: <FaUserCheck size={32} color="#4FC3F7" />,
    title: "Verified Reviews",
    description: "Read authentic reviews from real clients to find your perfect bodybuilding or powerlifting coach.",
    accent: "border-green-600"
  },
];

// Add this style for 3D text effect
const headline3DStyle = {
  fontWeight: 900,
  textShadow: '0 2px 6px rgba(30, 60, 90, 0.10), 0 1px 0 #e3eaf3', // subtle gray shadow for depth
};

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
    <main className="min-h-screen bg-white dark:bg-transparent">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-10 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight drop-shadow-lg text-black dark:text-white"
          >
            Discover Trusted Bodybuilding and Powerlifting Coaches
          </h1>
          <p
            className="text-2xl md:text-3xl mb-8 font-bold tracking-tight drop-shadow text-black dark:text-white"
            style={{ textShadow: '0 1px 4px rgba(79,195,247,0.18), 0 1px 0 #fff' }}
          >
            Train Smarter, Choose Better
          </p>
          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className={
                  `rounded-xl p-6 shadow-md flex-1 flex flex-col items-center text-center bg-white dark:bg-[#181d23]/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-[#232b36] cursor-pointer`
                }
                style={{ minHeight: 200 }}
              >
                <div className="mb-3 text-blue-600 text-3xl">{feature.icon}</div>
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Spotlight Section */}
      <section className="w-full bg-white dark:bg-transparent py-6">
        <CoachSpotlight />
      </section>
    </main>
  );
}
