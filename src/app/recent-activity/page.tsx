"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaUserPlus, FaMedal } from 'react-icons/fa';

export default function RecentActivityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recent Activity</h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest achievements and milestones in our community
          </p>
        </div>

        {/* Activity Feed */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Example Activity Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaStar className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  <Link href="/coaches/john-smith" className="font-semibold hover:text-blue-600">
                    John Smith
                  </Link>{' '}
                  received a 5-star review from{' '}
                  <Link href="/users/jane-doe" className="font-semibold hover:text-blue-600">
                    Jane Doe
                  </Link>
                </p>
                <p className="text-gray-500 text-sm mt-1">2 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUserPlus className="text-green-600 text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  <Link href="/coaches/sarah-johnson" className="font-semibold hover:text-blue-600">
                    Sarah Johnson
                  </Link>{' '}
                  joined CoachCritic as a new coach
                </p>
                <p className="text-gray-500 text-sm mt-1">5 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FaMedal className="text-yellow-600 text-xl" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  <Link href="/coaches/mike-wilson" className="font-semibold hover:text-blue-600">
                    Mike Wilson
                  </Link>{' '}
                  achieved Elite Coach status
                </p>
                <p className="text-gray-500 text-sm mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 