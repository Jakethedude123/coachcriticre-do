import React from 'react';
import CoachCard from './CoachCard';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import type { CoachData } from '@/lib/firebase/coachUtils';

interface CoachProfileDetailsProps {
  coach: CoachData;
  isOwner?: boolean;
  onEdit?: () => void;
}

const CoachProfileDetails: React.FC<CoachProfileDetailsProps> = ({ coach, isOwner, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Coach Profile</h1>
        {isOwner && (
          <Link
            href={`/coaches/profile/${coach.id}/edit`}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaEdit size={16} color="white" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>
      <CoachCard coach={coach} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{coach.bio}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {coach.specialties.map((specialty) => (
              <span key={specialty} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {specialty}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Credentials</h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Divisions</h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.divisions.map((division) => (
              <li key={division}>{division}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Client Types</h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.clientTypes.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Federations</h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.federations.map((federation) => (
              <li key={federation}>{federation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoachProfileDetails; 