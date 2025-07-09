'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaDumbbell, FaStar, FaUserCircle, FaTrophy, FaUserCheck, FaSearch } from 'react-icons/fa';
import CoachCard from '@/components/CoachCard';
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
            <CoachCard coach={{
              id: coach.userId,
              name: coach.name,
              specialties: coach.specialties || [],
              bio: coach.bio || '',
              profileImageUrl: coach.avatar || '/placeholder-coach.jpg',
              rating: 0,
              testimonialCount: 0,
              credentials: coach.credentials || [],
            }} />
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

const FEATURES = [
  {
    icon: <FaDumbbell size={32} />,
    title: "Expert Coaches",
    description: "Find certified bodybuilding and powerlifting coaches with proven track records in transformation.",
    accent: "border-blue-600"
  },
  {
    icon: <FaTrophy size={32} />,
    title: "Competition & Meet Prep",
    description: "Get specialized guidance for your next bodybuilding show or powerlifting meet—from prep to peak performance.",
    accent: "border-yellow-500"
  },
  {
    icon: <FaUserCheck size={32} />,
    title: "Verified Reviews",
    description: "Read authentic reviews from real clients to find your perfect bodybuilding or powerlifting coach.",
    accent: "border-green-600"
  },
];

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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              Discover Trusted Bodybuilding and Powerlifting Coaches
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-blue-100 font-semibold">
              Filtered by What Actually Matters
            </p>
            {/* Search Bar */}
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow h-full flex-1 flex flex-col items-center text-center border-t-4 ${feature.accent}`}
              >
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Spotlight Section (moved below features) */}
      <CoachSpotlight />
    </main>
  );
}
