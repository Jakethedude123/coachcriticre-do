"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CoachCard from "@/app/components/CoachCard";

export default function AllCoachesPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coaches/all")
      .then((res) => res.json())
      .then((data) => setCoaches(data.coaches || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? coaches.filter((coach) =>
        coach.name?.toLowerCase().includes(query) ||
        coach.specialties?.some((s) => s.toLowerCase().includes(query)) ||
        coach.location?.address?.toLowerCase().includes(query)
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
            <li key={coach.id}>
              <CoachCard coach={coach} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 