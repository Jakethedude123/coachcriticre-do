'use client';

import { useEffect, useState } from 'react';
import { FaUserCircle, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface SpotlightCoach {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  achievements: string[];
  rating: number;
  testimonial: string;
  clientCount: number;
  imageUrl?: string;
}

export default function SpotlightPage() {
  const [spotlightCoaches, setSpotlightCoaches] = useState<SpotlightCoach[]>([
    {
      id: 'mock-1',
      name: 'John "The Mountain" Davis',
      specialty: 'Powerlifting & Bodybuilding',
      experience: 10,
      achievements: [
        'IFBB Pro',
        'Team Pro Physique Coach',
        'ISSA Certified',
        'Trained 100+ Competition Winners'
      ],
      rating: 4.9,
      testimonial: "His attention to detail with form correction and programming helped me add 150lbs to my total in just 6 months while staying injury-free.",
      clientCount: 200,
      imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5'
    },
    {
      id: 'mock-2',
      name: 'Sarah Johnson',
      specialty: 'Figure & Bikini',
      experience: 8,
      achievements: [
        'IFBB Pro Figure Athlete',
        'NPC National Level Coach',
        '20+ Pro Card Winners',
        'Posing Specialist'
      ],
      rating: 4.9,
      testimonial: "Her knowledge of peak week strategies and posing was invaluable. She helped me win my pro card in Figure!",
      clientCount: 150,
      imageUrl: 'https://images.unsplash.com/photo-1609899464726-861593284d78'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Featured Coaches</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {spotlightCoaches.map((coach) => (
          <Link 
            href={`/coaches/${coach.id}`} 
            key={coach.id}
            className="block transition-transform hover:scale-[1.02] duration-200"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center">
                  {coach.imageUrl ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden relative">
                      <Image
                        src={coach.imageUrl}
                        alt={coach.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <FaUserCircle className="w-20 h-20" />
                  )}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{coach.name}</h2>
                    <p className="text-blue-100">{coach.specialty} Expert</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Experience & Achievements</h3>
                  <p className="text-gray-600 mb-2">{coach.experience} Years of Experience</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {coach.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Client Success</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400" />
                      <span className="ml-1 font-semibold">{coach.rating}</span>
                    </div>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-600">{coach.clientCount}+ Clients Coached</span>
                  </div>
                  <blockquote className="italic text-gray-600 border-l-4 border-blue-500 pl-4">
                    &ldquo;{coach.testimonial}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        &ldquo;Featured Coach of the Week&rdquo;
      </h2>
    </div>
  );
} 