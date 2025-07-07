'use client';
import React, { useState } from 'react';
import CoachCard from './CoachCard';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import type { CoachData } from '@/lib/firebase/coachUtils';
import {
  SPECIALTIES,
  CREDENTIALS,
  DIVISIONS,
  CLIENT_TYPES,
  FEDERATIONS,
} from '@/lib/utils/coachProfileOptions';
import { updateCoachProfile } from '@/lib/firebase/coachUtils';

interface CoachProfileDetailsProps {
  coach: CoachData;
  isOwner?: boolean;
  onEdit?: () => void;
}

const CoachProfileDetails: React.FC<CoachProfileDetailsProps> = ({ coach: initialCoach, isOwner, onEdit }) => {
  const [editBox, setEditBox] = useState<string | null>(null);
  const [coach, setCoach] = useState<CoachData>(initialCoach);

  // Helper to update coach profile and local state
  const handleArrayChange = async (
    field: keyof Pick<CoachData, 'specialties' | 'credentials' | 'divisions' | 'clientTypes' | 'federations'>,
    value: string,
    checked: boolean
  ) => {
    const prev = coach[field] as string[];
    const updated = checked ? [...prev, value] : prev.filter((v) => v !== value);
    setCoach((c) => ({ ...c, [field]: updated }));
    await updateCoachProfile(coach.id, { [field]: updated });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Coach Profile</h1>
      </div>
      <CoachCard coach={coach} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{coach.bio}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>Specialties</span>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              onClick={() => setEditBox(editBox === 'specialties' ? null : 'specialties')}
              aria-label="Edit Specialties"
            >
              <FaEdit size={18} />
            </button>
          </h2>
          <div className="flex flex-wrap gap-2">
            {coach.specialties.map((specialty) => (
              <span key={specialty} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {specialty}
              </span>
            ))}
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${editBox === 'specialties' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner">
              {SPECIALTIES.map((option) => (
                <label key={option} className="flex items-center gap-2 text-blue-800">
                  <input
                    type="checkbox"
                    checked={coach.specialties.includes(option)}
                    onChange={e => handleArrayChange('specialties', option, e.target.checked)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>Credentials</span>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              onClick={() => setEditBox(editBox === 'credentials' ? null : 'credentials')}
              aria-label="Edit Credentials"
            >
              <FaEdit size={18} />
            </button>
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
          <div
            className={`transition-all duration-300 overflow-hidden ${editBox === 'credentials' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner">
              {CREDENTIALS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-blue-800">
                  <input
                    type="checkbox"
                    checked={coach.credentials.includes(option)}
                    onChange={e => handleArrayChange('credentials', option, e.target.checked)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>Divisions</span>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              onClick={() => setEditBox(editBox === 'divisions' ? null : 'divisions')}
              aria-label="Edit Divisions"
            >
              <FaEdit size={18} />
            </button>
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.divisions.map((division) => (
              <li key={division}>{division}</li>
            ))}
          </ul>
          <div
            className={`transition-all duration-300 overflow-hidden ${editBox === 'divisions' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner">
              {DIVISIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-blue-800">
                  <input
                    type="checkbox"
                    checked={coach.divisions.includes(option)}
                    onChange={e => handleArrayChange('divisions', option, e.target.checked)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>Client Types</span>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              onClick={() => setEditBox(editBox === 'clientTypes' ? null : 'clientTypes')}
              aria-label="Edit Client Types"
            >
              <FaEdit size={18} />
            </button>
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.clientTypes.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
          <div
            className={`transition-all duration-300 overflow-hidden ${editBox === 'clientTypes' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner">
              {CLIENT_TYPES.map((option) => (
                <label key={option} className="flex items-center gap-2 text-blue-800">
                  <input
                    type="checkbox"
                    checked={coach.clientTypes.includes(option)}
                    onChange={e => handleArrayChange('clientTypes', option, e.target.checked)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 relative">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>Federations</span>
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              onClick={() => setEditBox(editBox === 'federations' ? null : 'federations')}
              aria-label="Edit Federations"
            >
              <FaEdit size={18} />
            </button>
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {coach.federations.map((federation) => (
              <li key={federation}>{federation}</li>
            ))}
          </ul>
          <div
            className={`transition-all duration-300 overflow-hidden ${editBox === 'federations' ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner">
              {FEDERATIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-blue-800">
                  <input
                    type="checkbox"
                    checked={coach.federations.includes(option)}
                    onChange={e => handleArrayChange('federations', option, e.target.checked)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachProfileDetails; 