'use client';

import { useState } from 'react';
import { FaUserCircle, FaStar, FaComment, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'review' | 'booking' | 'achievement';
  coachId: string;
  coachName: string;
  clientName: string;
  timestamp: string;
  content: string;
  rating?: number;
}

export default function RecentActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'review',
      coachId: '1',
      coachName: 'John Smith',
      clientName: 'Mike Johnson',
      timestamp: '2 hours ago',
      content: 'Amazing session! Coach John really knows how to push you to your limits while maintaining proper form.',
      rating: 5
    },
    {
      id: '2',
      type: 'booking',
      coachId: '1',
      coachName: 'John Smith',
      clientName: 'Emma Wilson',
      timestamp: '4 hours ago',
      content: 'Booked a 12-week powerlifting program'
    },
    {
      id: '3',
      type: 'achievement',
      coachId: '1',
      coachName: 'John Smith',
      clientName: 'David Brown',
      timestamp: '1 day ago',
      content: 'Client achieved a new personal record: 500lb deadlift!'
    }
  ]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'review':
        return <FaComment className="w-6 h-6 text-blue-500" />;
      case 'booking':
        return <FaCalendar className="w-6 h-6 text-green-500" />;
      case 'achievement':
        return <FaStar className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Recent Activity</h1>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <Link 
                      href={`/coaches/${activity.coachId}`}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {activity.coachName}
                    </Link>
                    <span className="text-gray-600">
                      {activity.type === 'review' ? ' received a review from ' :
                       activity.type === 'booking' ? ' was booked by ' :
                       ' helped '}
                      <span className="font-medium">{activity.clientName}</span>
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>
                
                <p className="mt-2 text-gray-600">{activity.content}</p>
                
                {activity.rating && (
                  <div className="mt-2 flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`w-4 h-4 ${
                          index < activity.rating! 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 