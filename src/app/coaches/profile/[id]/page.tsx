'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle, FaStar, FaMapMarkerAlt, FaClock, FaMedal, FaEdit } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCoachProfile } from '@/lib/firebase/coachUtils';
import Image from 'next/image';
import type { CoachData } from '@/lib/firebase/coachUtils';
import CoachProfileDetails from '@/components/CoachProfileDetails';

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
    <CoachProfileDetails coach={coach} isOwner={user?.uid === coach.userId} />
  );
} 