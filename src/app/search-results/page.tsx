"use client";
import { useEffect, useState } from "react";

interface Coach {
  id: string;
  name: string;
  specialty?: string;
  location?: string;
  [key: string]: any;
}

export default function SearchResultsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{coach.name}</h2>
            {coach.specialty && <p className="text-gray-600">Specialty: {coach.specialty}</p>}
            {coach.location && typeof coach.location === 'object' && (
              <p className="text-gray-600">
                Location: {coach.location.city || ''}{coach.location.city && coach.location.state ? ', ' : ''}{coach.location.state || ''}{coach.location.state && coach.location.country ? ', ' : ''}{coach.location.country || ''}
              </p>
            )}
            {/* Add more coach details as needed */}
          </div>
        ))}
      </div>
    </main>
  );
} 