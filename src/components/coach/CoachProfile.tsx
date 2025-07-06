"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Coach, PLAN_BENEFITS } from '@/lib/firebase/models/coach';
import VerifiedBadge from './VerifiedBadge';
import { useAuth } from '@/lib/hooks/useAuth';

interface CoachProfileProps {
  coach: Coach;
  showActions?: boolean;
}

export default function CoachProfile({ coach, showActions = true }: CoachProfileProps) {
  const isVerified = coach.subscription?.plan === 'pro' || coach.subscription?.plan === 'premium';
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  // For debugging avatar
  // console.log('Avatar:', coach.avatar);

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
            <div className="mt-6 flex flex-col space-y-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowMessageBox((v) => !v)}
              >
                Contact Coach
              </button>
              {showMessageBox && (
                <div className="mt-4">
                  <textarea
                    className="w-full border rounded-lg p-2 mb-2"
                    rows={4}
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={handleSend}
                  >
                    Send
                  </button>
                  {sendStatus === 'success' && (
                    <div className="text-green-600 mt-2 text-sm">Message sent!</div>
                  )}
                  {sendStatus === 'error' && (
                    <div className="text-red-600 mt-2 text-sm">Failed to send message.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Force redeploy: update for Vercel cache busting 