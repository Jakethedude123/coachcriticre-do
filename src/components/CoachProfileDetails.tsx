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

// Add custom styles for glassmorphism, gradient, and fade-in
const boxBase = "profile-fade-in bg-white/70 rounded-lg shadow p-6 backdrop-blur-md border border-blue-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:bg-opacity-90";
const headingBase = "text-lg font-semibold mb-2 text-blue-700";
const badgeColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
];

const CoachProfileDetails: React.FC<CoachProfileDetailsProps> = ({ coach, isOwner, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Coach Profile</h1>
        {isOwner && (
          <Link
            href={`/coaches/profile/${coach.id}/edit`}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in hover:scale-105 hover:shadow-lg"
          >
            <FaEdit size={16} color="white" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>
      <CoachCard coach={coach} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className={boxBase}>
          <h2 className={headingBase}>About</h2>
          <p className="text-gray-700 whitespace-pre-line">{coach.bio}</p>
        </div>
        <div className={boxBase}>
          <h2 className={headingBase}>Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {coach.specialties.map((specialty, i) => (
              <span
                key={specialty}
                className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-all duration-200 ${badgeColors[i % badgeColors.length]} hover:scale-110 hover:shadow-md`}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        <div className={boxBase}>
          <h2 className={headingBase}>Credentials</h2>
          <ul className="list-disc list-inside">
            {coach.credentials.map((credential) => (
              <li key={credential} className="text-blue-700 hover:underline hover:font-semibold transition-colors duration-150">{credential}</li>
            ))}
          </ul>
        </div>
        <div className={boxBase}>
          <h2 className={headingBase}>Divisions</h2>
          <ul className="list-disc list-inside">
            {coach.divisions.map((division) => (
              <li key={division} className="text-blue-700 hover:underline hover:font-semibold transition-colors duration-150">{division}</li>
            ))}
          </ul>
        </div>
        <div className={boxBase}>
          <h2 className={headingBase}>Client Types</h2>
          <ul className="list-disc list-inside">
            {coach.clientTypes.map((type) => (
              <li key={type} className="text-blue-700 hover:underline hover:font-semibold transition-colors duration-150">{type}</li>
            ))}
          </ul>
        </div>
        <div className={boxBase}>
          <h2 className={headingBase}>Federations</h2>
          <ul className="list-disc list-inside">
            {coach.federations.map((federation) => (
              <li key={federation} className="text-blue-700 hover:underline hover:font-semibold transition-colors duration-150">{federation}</li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx global>{`
        .profile-fade-in {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) forwards;
        }
        .profile-fade-in:nth-child(1) { animation-delay: 0.05s; }
        .profile-fade-in:nth-child(2) { animation-delay: 0.12s; }
        .profile-fade-in:nth-child(3) { animation-delay: 0.19s; }
        .profile-fade-in:nth-child(4) { animation-delay: 0.26s; }
        .profile-fade-in:nth-child(5) { animation-delay: 0.33s; }
        .profile-fade-in:nth-child(6) { animation-delay: 0.40s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CoachProfileDetails; 