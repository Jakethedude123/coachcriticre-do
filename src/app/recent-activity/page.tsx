"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { FaUser, FaStar, FaEdit, FaUserPlus } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface Activity {
  id: string;
  type: 'new_coach' | 'new_review' | 'profile_update';
  timestamp: Date;
  userId: string;
  coachId?: string;
  rating?: number;
  userName: string;
  coachName?: string;
  reviewText?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        
        const fetchedActivities = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
          } as Activity;
        });

        setActivities(fetchedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  function formatTimestamp(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  }

  function getActivityIcon(type: Activity['type']) {
    switch (type) {
      case 'new_coach':
        return <FaUserPlus className="text-blue-500" />;
      case 'new_review':
        return <FaStar className="text-yellow-500" />;
      case 'profile_update':
        return <FaEdit className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  }

  function getActivityText(activity: Activity) {
    switch (activity.type) {
      case 'new_coach':
        return (
          <span>
            <Link href={`/profile/${activity.userId}`} className="font-semibold hover:text-blue-600">
              {activity.userName}
            </Link>{' '}
            registered as a new coach
          </span>
        );
      case 'new_review':
        return (
          <span>
            <Link href={`/profile/${activity.userId}`} className="font-semibold hover:text-blue-600">
              {activity.userName}
            </Link>{' '}
            reviewed{' '}
            <Link href={`/coaches/${activity.coachId}`} className="font-semibold hover:text-blue-600">
              {activity.coachName}
            </Link>
            {activity.rating && (
              <span className="flex items-center space-x-1 ml-2">
                <span>{activity.rating}</span>
                <FaStar className="text-yellow-500" />
              </span>
            )}
          </span>
        );
      case 'profile_update':
        return (
          <span>
            <Link href={`/profile/${activity.userId}`} className="font-semibold hover:text-blue-600">
              {activity.userName}
            </Link>{' '}
            updated their profile
          </span>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h1>
        
        {activities.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">No recent activity to show</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-900">
                        {getActivityText(activity)}
                      </div>
                      <time className="text-sm text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </time>
                    </div>
                    {activity.type === 'new_review' && activity.reviewText && (
                      <p className="mt-2 text-gray-600">{activity.reviewText}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 