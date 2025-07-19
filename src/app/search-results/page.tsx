"use client";
import { useEffect, useState } from "react";
import CoachCard from '@/components/CoachCard';
import type { Coach } from "@/lib/firebase/models/coach";

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
          const isExpanded = hoveredCoachId === coach.userId;
          return (
            <div
              key={coach.userId}
              onMouseEnter={() => setHoveredCoachId(coach.userId)}
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
                <CoachCard coach={coach} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
} 