"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import TeaserAnalyticsDashboard from '@/components/TeaserAnalyticsDashboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';

const AnalyticsDashboard = dynamic(() => import('@/components/AnalyticsDashboard'), { ssr: false });
const PostPerformance = dynamic(() => import('@/components/posts/PostPerformance'), { ssr: false });

export default function AnalyticsPage() {
  const { user, isCoach, coachId, loading } = useAuth();
  const [coachProfile, setCoachProfile] = useState<any>(null);
  const [plan, setPlan] = useState<'basic' | 'pro' | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpgradeClick = () => {
    router.push('/upgrade');
  };

  useEffect(() => {
    if (!coachId) return;
    setProfileLoading(true);
    setProfileError(null);
    getDoc(doc(db, 'coaches', coachId))
      .then((snap) => {
        if (snap.exists()) {
          setCoachProfile(snap.data());
          setPlan(snap.data().plan || 'basic');
        } else {
          setProfileError('Coach profile not found.');
        }
      })
      .catch((err) => {
        setProfileError('Failed to load coach profile.');
      })
      .finally(() => setProfileLoading(false));
  }, [coachId]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f1419] dark:to-[#1a1f2e] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || !isCoach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f1419] dark:to-[#1a1f2e] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You must be a coach to view analytics.</p>
        </div>
      </div>
    );
  }

  if (profileError || !coachProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f1419] dark:to-[#1a1f2e] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{profileError || 'Coach profile not found.'}</p>
        </div>
      </div>
    );
  }

  // Basic plan: show teaser dashboard
  if (plan === 'basic') {
    return (
      <TeaserAnalyticsDashboard onUpgradeClick={handleUpgradeClick} />
    );
  }

  // Pro plan: show full analytics with proper layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f1419] dark:to-[#1a1f2e] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your profile performance and connect with interested athletes</p>
        </div>
        <div className="space-y-8">
          <AnalyticsDashboard coach={coachProfile} />
          <PostPerformance />
        </div>
      </div>
    </div>
  );
} 