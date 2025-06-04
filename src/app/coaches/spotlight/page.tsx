'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaTrophy, FaUserCheck } from 'react-icons/fa';

export default function CoachSpotlightPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coach Spotlight</h1>
          <p className="text-xl text-gray-600">
            Meet our featured coaches who have demonstrated exceptional expertise and client success
          </p>
        </div>

        {/* Featured Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Featured Coach Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src="/images/placeholder-coach.jpg"
                alt="Featured Coach"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">John Smith</h3>
                <div className="flex items-center text-yellow-400">
                  <FaStar />
                  <span className="ml-1 text-gray-600">4.9</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Specializing in bodybuilding competition prep with over 10 years of experience
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaTrophy className="mr-1" />
                  <span>50+ Competitions</span>
                </div>
                <div className="flex items-center">
                  <FaUserCheck className="mr-1" />
                  <span>200+ Clients</span>
                </div>
              </div>
              <Link
                href="/coaches/john-smith"
                className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 