"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CoachCard from '@/app/components/CoachCard';

export default function CoachSearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(`/api/coaches/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{q}&quot;</h1>
      {loading ? (
        <p>Loading...</p>
      ) : coaches.length === 0 ? (
        <p>No coaches found.</p>
      ) : (
        <ul className="space-y-6">
          {coaches.map((coach: any) => (
            <li key={coach.id}>
              <CoachCard coach={coach} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 