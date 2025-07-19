"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CoachCard from '@/components/CoachCard';
import type { Coach } from "@/lib/firebase/models/coach";

export default function AllCoachesClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coaches/all")
      .then((res) => res.json())
      .then((data) => setCoaches(data.coaches || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? coaches.filter((coach: Coach) =>
        coach.name?.toLowerCase().includes(query) ||
        coach.specialties?.some((s) => s.toLowerCase().includes(query)) ||
        coach.location?.city?.toLowerCase().includes(query) ||
        coach.location?.state?.toLowerCase().includes(query) ||
        coach.location?.country?.toLowerCase().includes(query)
      )
    : coaches;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-transparent rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Coach Directory{query && ` matching "${query}"`}</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No coaches found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coach) => (
            <div key={coach.userId} className="h-full">
              <CoachCard coach={coach} small />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 