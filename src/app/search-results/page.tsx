"use client";
import { useEffect, useState } from "react";
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
    <main className="min-h-screen bg-white dark:bg-transparent p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Coach Directory</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {coaches.map((coach) => {
          // Map coach data to match unified CoachCard props
          const mappedCoach = {
            id: coach.id || coach.userId,
            name: coach.name,
            specialties: Array.isArray(coach.specialties) ? coach.specialties : (coach.specialty ? [coach.specialty] : []),
            bio: coach.bio || '',
            profileImageUrl: coach.profileImageUrl || coach.avatar || '/placeholder-coach.jpg',
            rating: coach.rating || 0,
            testimonialCount: coach.testimonialCount || 0,
            credentials: Array.isArray(coach.certifications) ? coach.certifications : [],
            divisions: Array.isArray(coach.divisions) ? coach.divisions : [],
            clientTypes: Array.isArray(coach.clientTypes) ? coach.clientTypes : [],
            federations: Array.isArray(coach.federations) ? coach.federations : [],
          };
          const isExpanded = hoveredCoachId === coach.id;
          return (
            <div
              key={coach.id}
              onMouseEnter={() => setHoveredCoachId(coach.id)}
              onMouseLeave={() => setHoveredCoachId(null)}
              className={`transition-all duration-300 overflow-hidden bg-white rounded-lg ${isExpanded ? 'shadow-2xl' : 'shadow'} p-0`}
              style={{
                maxHeight: isExpanded ? 420 : 120,
                minHeight: isExpanded ? 420 : 120,
                boxShadow: isExpanded ? '0 8px 32px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.08)',
                marginBottom: '8px',
              }}
            >
              <div className="transition-opacity duration-200" style={{ opacity: 1, width: '100%' }}>
                <CoachCard coach={mappedCoach} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
} 