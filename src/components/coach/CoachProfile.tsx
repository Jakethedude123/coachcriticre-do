"use client";

import Image from 'next/image';
import { Coach, TIER_BENEFITS } from '@/lib/firebase/models/coach';
import VerifiedBadge from './VerifiedBadge';

interface CoachProfileProps {
  coach: Coach;
  showActions?: boolean;
}

export default function CoachProfile({ coach, showActions = true }: CoachProfileProps) {
  const isVerified = coach.subscription?.plan === 'pro' || coach.subscription?.plan === 'premium';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start space-x-6">
        {/* Profile Image */}
        <div className="relative w-32 h-32">
          <Image
            src={coach.avatar || '/placeholder-coach.jpg'}
            alt={coach.name}
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        </div>

        {/* Coach Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">{coach.name}</h2>
            {isVerified && <VerifiedBadge />}
          </div>

          <p className="text-gray-600 mt-1">{coach.trainingStyle.join(', ')}</p>

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="font-medium">New</span>
            </div>
            <div className="text-gray-600">
              <span className="mr-2">📍</span>
              {`${coach.location.city}, ${coach.location.state}`}
            </div>
            <div className="text-gray-600">
              <span className="mr-2">⚡</span>
              {coach.experience}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">{coach.bio}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {coach.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {showActions && (
            <div className="mt-6 flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Coach
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                View Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 