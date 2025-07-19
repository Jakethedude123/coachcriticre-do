'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/components/CoachCard';
import { useAuth } from '@/lib/hooks/useAuth';
import SearchBar from '@/components/SearchBar';
import type { Coach } from '@/lib/firebase/models/coach';

// Featured Coach Spotlight
function CoachSpotlight() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/coaches/all')
      .then(res => res.json())
      .then(data => {
        // Get the first available coach
        const availableCoaches = data.coaches || [];
        setCoaches(availableCoaches.slice(0, 1)); // Just show one coach
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-transparent py-6">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-5xl font-extrabold mb-3 text-blue-900 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Featured Coach
          </h2>
          <p className="text-xl font-semibold text-gray-700 mb-2">This week's featured coach from our community.</p>
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
          Featured Coach
        </h2>
        <p className="text-xl font-semibold text-gray-700 mb-2">This week's featured coach from our community.</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>
      <div className="max-w-3xl mx-auto px-4">
        <CoachCard coach={coaches[0]} />
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
