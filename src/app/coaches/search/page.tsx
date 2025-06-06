'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FindCoachesPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/coaches/search-results?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Coaches</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search by name, specialty, location..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>
    </div>
  );
} 