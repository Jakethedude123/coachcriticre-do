'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaEdit, FaSave } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { getCoachProfile } from '@/lib/firebase/coachUtils';
import CoachProfileDetails from '@/components/CoachProfileDetails';
import type { CoachData } from '@/lib/firebase/coachUtils';

interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  imageUrl: string;
  location: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  isCoach?: boolean;
  coachId?: string;
}

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    imageUrl: '',
    location: '',
    socialLinks: {}
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [coachProfile, setCoachProfile] = useState<CoachData | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (searchParams.get('welcome') === '1') {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 10000);
      return () => clearTimeout(timer);
    }
    // Fetch user profile from Firestore
    const fetchProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile({
            ...data,
            socialLinks: data.socialLinks || {}
          });
          // If user is a coach, fetch their coach profile
          if (data.isCoach && data.coachId) {
            const coachData = await getCoachProfile(data.coachId);
            setCoachProfile(coachData);
          }
        }
      }
    };
    fetchProfile();
  }, [user, router, searchParams]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement Firebase Storage upload
      console.log('Uploading file:', file);
    }
  };

  const handleSave = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), profile);
      setIsEditing(false);
    }
  };

  if (!user) return null;

  // If user is a coach, show their coach profile card
  if (profile.isCoach && coachProfile) {
    return <CoachProfileDetails coach={coachProfile} isOwner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showWelcome && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in">
          <span>👋 Hello! Thank you for signing up. Customizing your profile will simplify your experience and help you get the most out of CoachCritic!</span>
          <button onClick={() => setShowWelcome(false)} className="ml-4 text-white hover:text-gray-200 font-bold">&times;</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? (
              <>
                <FaSave size={16} color="white" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <FaEdit size={16} color="white" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              {profile.imageUrl ? (
                <Image
                  src={profile.imageUrl}
                  alt="Profile"
                  width={192}
                  height={192}
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser size={96} color="#9CA3AF" />
                </div>
              )}
            </div>
            {isEditing && (
              <div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                  Upload Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Profile Details Section */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setProfile({ ...profile, displayName: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Social Links</label>
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={profile.socialLinks.instagram || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                    })}
                    disabled={!isEditing}
                    placeholder="Instagram URL"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={profile.socialLinks.twitter || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                    })}
                    disabled={!isEditing}
                    placeholder="Extra URL"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={profile.socialLinks.website || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, website: e.target.value }
                    })}
                    disabled={!isEditing}
                    placeholder="Extra 2 URL"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 