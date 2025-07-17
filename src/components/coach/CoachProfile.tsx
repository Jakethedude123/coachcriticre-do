"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Coach, PLAN_BENEFITS } from '@/lib/firebase/models/coach';
import VerifiedBadge from './VerifiedBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaStar, FaMapMarkerAlt, FaBolt, FaUser, FaEnvelope } from 'react-icons/fa';

interface CoachProfileProps {
  coach: Coach;
  showActions?: boolean;
}

export default function CoachProfile({ coach, showActions = true }: CoachProfileProps) {
  const isVerified = coach.subscription?.plan === 'pro';
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  // Normalize and filter out empty tags
  const normalizeTags = (tags: string[] | undefined): string[] => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.filter(tag => tag && tag.trim().length > 0);
  };

  const specialties = normalizeTags(coach.specialties);
  const credentials = normalizeTags(coach.certifications);
  const divisions = normalizeTags(coach.divisions);
  const clientTypes = normalizeTags(coach.clientTypes);
  const federations = normalizeTags(coach.federations);

  // Helper to render tags with consistent styling
  const renderTags = (items: string[], color: string, text: string) =>
    items.map((item, idx) => (
      <span
        key={`${text}-${item}-${idx}`}
        className={`inline-block px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium ${color}`}
      >
        {item}
      </span>
    ));

  const handleSend = async () => {
    setSendStatus('idle');
    if (!user) return;
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: coach.userId,
          from: user.uid,
          text: message,
        }),
      });
      if (res.ok) {
        setSendStatus('success');
        setMessage('');
        setShowMessageBox(false);
      } else {
        setSendStatus('error');
      }
    } catch {
      setSendStatus('error');
    }
  };

  return (
    <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg transition-all duration-200 bg-white dark:bg-transparent">
      {/* Left: Image section */}
      <div className="w-1/3 bg-[#374151] relative min-h-[400px]">
        {coach.avatar ? (
          <Image
            src={coach.avatar}
            alt={coach.name}
            fill
            className="object-cover"
            unoptimized={coach.avatar.includes('firebasestorage.googleapis.com')}
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <FaUser className="text-white text-6xl opacity-50" />
          </div>
        )}
      </div>

      {/* Right: Main info */}
      <div className="w-2/3 bg-[#232b36] p-8 flex flex-col justify-start">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{coach.name}</h1>
            {isVerified && <VerifiedBadge />}
          </div>
          
          <p className="text-gray-300 text-lg mb-3">
            {coach.trainingStyle?.join(', ') || 'Bodybuilding Coach'}
          </p>

          <div className="flex items-center space-x-6 text-gray-300">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="font-medium">New</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>{coach.location?.city}, {coach.location?.state}</span>
            </div>
            <div className="flex items-center">
              <FaBolt className="mr-2" />
              <span>{coach.experience || 'Experienced'}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">About</h2>
          <p className="text-gray-300 leading-relaxed">{coach.bio || 'No bio available.'}</p>
        </div>

        {/* Specialties Section */}
        {specialties.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Specialties</h2>
            <div className="flex flex-wrap">
              {renderTags(specialties, 'bg-blue-100 text-blue-800', 'Specialty')}
            </div>
          </div>
        )}

        {/* Credentials Section */}
        {credentials.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Credentials</h2>
            <div className="flex flex-wrap">
              {renderTags(credentials, 'bg-green-100 text-green-800', 'Credential')}
            </div>
          </div>
        )}

        {/* Divisions Section */}
        {divisions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Divisions</h2>
            <div className="flex flex-wrap">
              {renderTags(divisions, 'bg-purple-100 text-purple-800', 'Division')}
            </div>
          </div>
        )}

        {/* Client Types Section */}
        {clientTypes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Client Types</h2>
            <div className="flex flex-wrap">
              {renderTags(clientTypes, 'bg-yellow-100 text-yellow-800', 'Client Type')}
            </div>
          </div>
        )}

        {/* Federations Section */}
        {federations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Federations</h2>
            <div className="flex flex-wrap">
              {renderTags(federations, 'bg-pink-100 text-pink-800', 'Federation')}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {showActions && (
          <div className="mt-auto">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              onClick={() => setShowMessageBox((v) => !v)}
            >
              <FaEnvelope />
              <span>Contact Coach</span>
            </button>
            
            {showMessageBox && (
              <div className="mt-4 space-y-3">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 resize-none"
                  rows={4}
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  onClick={handleSend}
                >
                  Send Message
                </button>
                {sendStatus === 'success' && (
                  <div className="text-green-400 text-sm text-center">Message sent successfully!</div>
                )}
                {sendStatus === 'error' && (
                  <div className="text-red-400 text-sm text-center">Failed to send message. Please try again.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 