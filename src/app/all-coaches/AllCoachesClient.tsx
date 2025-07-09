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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Coaches{query && ` matching "${query}"`}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No coaches found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((coach) => (
            <li key={coach.userId}>
              <CoachCard coach={{
                id: coach.userId,
                name: coach.name,
                specialties: coach.specialties || [],
                bio: coach.bio || '',
                profileImageUrl: coach.avatar || '/placeholder-coach.jpg',
                rating: 0,
                testimonialCount: 0,
                credentials: coach.credentials || [],
                divisions: coach.divisions || [],
                clientTypes: coach.clientTypes || [],
                federations: coach.federations || [],
              }} small />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 