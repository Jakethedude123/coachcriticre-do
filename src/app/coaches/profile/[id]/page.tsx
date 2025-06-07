'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle, FaStar, FaMapMarkerAlt, FaClock, FaMedal, FaEdit } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCoachProfile } from '@/lib/firebase/coachUtils';
import Image from 'next/image';
import type { CoachData } from '@/lib/firebase/coachUtils';
import { CoachProfile } from '@/lib/dynamic-imports';
import CoachCard from '@/components/CoachCard';

export default function CoachProfilePage() {
  const { id } = useParams();
  const { user, isCoach } = useAuth();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    console.log('[CoachProfile] Auth ready at', new Date().toISOString());
    async function loadCoachProfile() {
      console.log('[CoachProfile] Fetch start at', new Date().toISOString());
      try {
        const coachData = await getCoachProfile(user!.uid);
        setCoach(coachData);
        console.log('[CoachProfile] Fetch end at', new Date().toISOString());
      } catch (error) {
        console.error('Error loading coach profile:', error);
        setError('Failed to load coach profile');
      } finally {
        setLoading(false);
      }
    }
    loadCoachProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Skeleton Loader */}
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mr-6" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Coach profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CoachCard coach={coach} />

      {/* Bio */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{coach.bio}</p>
      </div>

      {/* Credentials and Specialties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Credentials</h2>
          <ul className="list-disc list-inside text-gray-600">
            {coach.credentials.map((credential: string) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {coach.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Competition Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Divisions</h2>
          <ul className="list-disc list-inside text-gray-600">
            {coach.divisions.map((division: string) => (
              <li key={division}>{division}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client Types</h2>
          <ul className="list-disc list-inside text-gray-600">
            {coach.clientTypes.map((type: string) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Federations</h2>
          <ul className="list-disc list-inside text-gray-600">
            {coach.federations.map((federation: string) => (
              <li key={federation}>{federation}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact Button */}
      {!isCoach && (
        <div className="fixed bottom-8 right-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
            Contact Coach
          </button>
        </div>
      )}
    </div>
  );
} 