"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Coach, PLAN_BENEFITS } from '@/lib/firebase/models/coach';
import VerifiedBadge from './VerifiedBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaStar, FaMapMarkerAlt, FaBolt, FaUser, FaEnvelope, FaMedal, FaTrophy, FaAward, FaCheckCircle } from 'react-icons/fa';

interface CoachProfileProps {
  coach: Coach;
  showActions?: boolean;
}

export default function CoachProfile({ coach, showActions = true }: CoachProfileProps) {
  const isVerified = coach.subscription?.plan === 'pro';
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Animate component entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Helper to render tags with consistent styling (keeping original style as requested)
  const renderTags = (items: string[], color: string, text: string) =>
    items.map((item, idx) => (
      <span
        key={`${text}-${item}-${idx}`}
        className={`inline-block px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium ${color} transition-all duration-300 hover:scale-105 hover:shadow-md`}
        style={{ 
          animationDelay: `${idx * 50}ms`,
          animation: isLoaded ? 'fadeInUp 0.5s ease-out forwards' : 'none'
        }}
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
    <div 
      className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg transition-all duration-300 bg-white transform hover:scale-[1.005]"
      style={{ 
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}
    >
      {/* Left: Image section */}
      <div className="w-2/5 bg-gray-200 relative min-h-[400px] overflow-hidden">
        {coach.avatar ? (
          <Image
            src={coach.avatar}
            alt={coach.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            unoptimized={coach.avatar.includes('firebasestorage.googleapis.com')}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-400 text-6xl" />
          </div>
        )}
        
        {/* Status badge overlay */}
        <div className="absolute top-4 left-4">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-md">
            <FaStar className="mr-1" />
            New Coach
          </div>
        </div>
      </div>

      {/* Right: Main info */}
      <div className="w-3/5 bg-white p-8 flex flex-col justify-start">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{coach.name}</h1>
            {isVerified && <VerifiedBadge />}
          </div>
          
          <p className="text-blue-600 text-lg mb-4 font-medium">
            {coach.trainingStyle?.join(', ') || 'Bodybuilding Coach'}
          </p>

          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              <span className="font-medium">{coach.location?.city}, {coach.location?.state}</span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <FaBolt className="mr-2 text-yellow-500" />
              <span className="font-medium">{coach.experience || 'Experienced'}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <FaUser className="mr-3 text-blue-500" />
            About
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{coach.bio || 'No bio available.'}</p>
          </div>
        </div>

        {/* Specialties Section */}
        {specialties.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FaMedal className="mr-3 text-blue-500" />
              Specialties
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap">
                {renderTags(specialties, 'bg-blue-100 text-blue-800', 'Specialty')}
              </div>
            </div>
          </div>
        )}

        {/* Credentials Section */}
        {credentials.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FaAward className="mr-3 text-green-500" />
              Credentials
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap">
                {renderTags(credentials, 'bg-green-100 text-green-800', 'Credential')}
              </div>
            </div>
          </div>
        )}

        {/* Divisions Section */}
        {divisions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FaTrophy className="mr-3 text-purple-500" />
              Divisions
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap">
                {renderTags(divisions, 'bg-purple-100 text-purple-800', 'Division')}
              </div>
            </div>
          </div>
        )}

        {/* Client Types Section */}
        {clientTypes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FaCheckCircle className="mr-3 text-yellow-500" />
              Client Types
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap">
                {renderTags(clientTypes, 'bg-yellow-100 text-yellow-800', 'Client Type')}
              </div>
            </div>
          </div>
        )}

        {/* Federations Section */}
        {federations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FaTrophy className="mr-3 text-pink-500" />
              Federations
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-wrap">
                {renderTags(federations, 'bg-pink-100 text-pink-800', 'Federation')}
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {showActions && (
          <div className="mt-auto">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-md hover:shadow-lg"
              onClick={() => setShowMessageBox((v) => !v)}
            >
              <FaEnvelope className="text-base" />
              <span className="text-base">Contact Coach</span>
            </button>
            
            {showMessageBox && (
              <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <textarea
                  className="w-full border border-gray-300 bg-white rounded-lg p-3 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write your message to this coach..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                  onClick={handleSend}
                >
                  Send Message
                </button>
                {sendStatus === 'success' && (
                  <div className="text-green-700 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-300">
                    ✓ Message sent successfully!
                  </div>
                )}
                {sendStatus === 'error' && (
                  <div className="text-red-700 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-300">
                    ✗ Failed to send message. Please try again.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 