'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle, FaStar, FaMapMarkerAlt, FaClock, FaMedal, FaEdit } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCoachProfile } from '@/lib/firebase/coachUtils';
import Image from 'next/image';
import type { CoachData } from '@/lib/firebase/coachUtils';

export default function CoachProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoachProfile() {
      if (!user) return;
      try {
        const coachData = await getCoachProfile(user.uid);
        setCoach(coachData);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            {coach.profileImageUrl ? (
              <Image
                src={coach.profileImageUrl}
                alt={`${coach.name}'s profile`}
                width={128}
                height={128}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaUserCircle className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{coach.name}</h1>
              <p className="text-gray-600 capitalize">{coach.trainingStyle.join(', ')}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`w-5 h-5 ${
                        index < coach.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {coach.rating.toFixed(1)} ({coach.testimonialCount} reviews)
                </span>
              </div>
            </div>
          </div>
          {user?.uid === coach.userId && (
            <Link
              href={`/coaches/profile/${id}/edit`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="w-5 h-5 mr-2" />
              <span>{coach.location.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaClock className="w-5 h-5 mr-2" />
              <span>Responds within {coach.responseTime}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">Experience:</span> {coach.yearsExperience}
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">Coaching:</span> {coach.coachingModality}
            </div>
          </div>
        </div>
      </div>

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
      <div className="fixed bottom-8 right-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
          Contact Coach
        </button>
      </div>
    </div>
  );
} 