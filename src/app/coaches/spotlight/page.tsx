'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaTrophy, FaMedal, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface SpotlightCoach {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  achievements: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  featured: boolean;
}

export default function CoachSpotlight() {
  const [spotlightCoaches, setSpotlightCoaches] = useState<SpotlightCoach[]>([
    {
      id: '1',
      name: 'John Smith',
      title: 'Elite Powerlifting Coach',
      imageUrl: '/placeholder-coach.jpg',
      achievements: [
        'IPF World Champion Coach',
        '20+ National Champions',
        'USAPL Coach of the Year'
      ],
      rating: 4.9,
      reviewCount: 156,
      specialties: ['Powerlifting', 'Strength Training', 'Competition Prep'],
      featured: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'IFBB Pro Coach',
      imageUrl: '/placeholder-coach.jpg',
      achievements: [
        'IFBB Pro Card Holder',
        'Coached 30+ Pro Card Winners',
        'Natural Bodybuilding Champion'
      ],
      rating: 4.8,
      reviewCount: 142,
      specialties: ['Bodybuilding', 'Contest Prep', 'Nutrition Planning'],
      featured: true
    },
    {
      id: '3',
      name: 'Mike Davis',
      title: 'Performance Specialist',
      imageUrl: '/placeholder-coach.jpg',
      achievements: [
        'Elite Powerlifting Total',
        'Sports Science PhD',
        'Strength & Conditioning Specialist'
      ],
      rating: 4.9,
      reviewCount: 178,
      specialties: ['Powerlifting', 'Athletic Performance', 'Injury Prevention'],
      featured: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Coach Spotlight</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our most distinguished coaches, recognized for their exceptional achievements and consistent success in transforming athletes.
          </p>
        </div>

        {/* Featured Coaches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spotlightCoaches.map((coach) => (
            <div key={coach.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Coach Image */}
              <div className="relative h-64">
                <Image
                  src={coach.imageUrl}
                  alt={coach.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {coach.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Coach Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{coach.name}</h2>
                <p className="text-blue-600 font-semibold mb-4">{coach.title}</p>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaTrophy className="text-yellow-400 mr-2" />
                    Achievements
                  </h3>
                  <ul className="space-y-2">
                    {coach.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <FaMedal className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <FaStar />
                      <span className="ml-1 text-gray-900 font-semibold">
                        {coach.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{coach.reviewCount} reviews</span>
                  </div>
                </div>

                {/* View Profile Button */}
                <Link
                  href={`/coaches/${coach.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 