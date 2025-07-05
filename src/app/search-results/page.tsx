"use client";
import { useEffect, useState } from "react";
import CondensedCoachCard from './CondensedCoachCard';
import CoachCard from '@/components/CoachCard';

interface Coach {
  id: string;
  name: string;
  specialty?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function SearchResultsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCoachId, setHoveredCoachId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoaches() {
      try {
        const res = await fetch("/api/coaches/all");
        const data = await res.json();
        if (data.coaches) {
          setCoaches(data.coaches);
        } else {
          setError("No coaches found.");
        }
      } catch (err) {
        setError("Failed to load coaches.");
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Coach Directory</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {coaches.map((coach) => {
          const mappedCoach = {
            id: coach.id,
            name: coach.name,
            profileImageUrl: coach.profileImageUrl || coach.avatar || '/placeholder-coach.jpg',
            rating: coach.rating || 0,
            testimonialCount: coach.testimonialCount || 0,
            specialties: coach.specialties || (coach.specialty ? [coach.specialty] : []),
            bio: coach.bio || '',
            ...coach,
          };
          return (
            <div
              key={coach.id}
              onMouseEnter={() => setHoveredCoachId(coach.id)}
              onMouseLeave={() => setHoveredCoachId(null)}
              className="transition-all duration-200"
            >
              {hoveredCoachId === coach.id ? (
                <CoachCard coach={mappedCoach} />
              ) : (
                <CondensedCoachCard coach={mappedCoach} />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
} 