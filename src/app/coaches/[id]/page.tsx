'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaInstagram, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { getCoach } from '@/lib/firebase/firebaseUtils';
import { Coach } from '@/lib/firebase/models/coach';
import { useAuth } from '@/lib/hooks/useAuth';
import { Timestamp } from 'firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';

export default function CoachProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'testimonials'>('overview');
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const coachData = await getCoach(params.id);
        if (!coachData) {
          setCoach(null);
        } else {
          setCoach({ ...coachData, social: coachData.social || {} });
        }

        // Track profile view
        await fetch('/api/coaches/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coachId: params.id,
            eventType: 'profileView',
          }),
        });

        // Fetch testimonials
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, where('coachId', '==', params.id));
        const snapshot = await getDocs(q);
        setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Coach Not Found</h2>
            <p className="mt-4 text-gray-600">The coach you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/coaches" className="mt-8 inline-block text-blue-600 hover:text-blue-500">
              ← Back to Coaches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Image and Basic Info */}
        <div className="md:col-span-1">
          <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
            <Image
              src={coach.avatar || '/placeholder-coach.jpg'}
              alt={coach.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Middle Column - Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  {coach.location.city}, {coach.location.state}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  {coach.experience} experience
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600">{coach.bio}</p>
            </div>

            <div className="mt-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Credentials</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.credentials.map((credential, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {credential}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {coach.social && coach.social.instagram && (
                <a
                  href={coach.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-pink-600 hover:text-pink-700"
                >
                  <FaInstagram className="mr-2" />
                  Instagram
                </a>
              )}
              {coach.social && coach.social.website && (
                <a
                  href={coach.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FaGlobe className="mr-2" />
                  Website
                </a>
              )}
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Pricing & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900">Rate</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ${coach.pricing.rate} {coach.pricing.currency}/{coach.pricing.interval}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900">Availability</h4>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Timezone</h4>
                      <p className="text-gray-600">{coach.availability.timezone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                      {Object.entries(coach.availability.schedule).map(([day, times]) => (
                        times.length > 0 && (
                          <div key={day} className="text-gray-600">
                            {day}: {times.join(', ')}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="mt-8 mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => setInquiryOpen(true)}
            >
              Inquire About Coaching
            </button>

            {/* Reviews Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              {testimonials && testimonials.length > 0 ? (
                <div className="space-y-6">
                  {testimonials.map((review, idx) => (
                    <div key={review.id || idx} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-900 mr-2">{review.authorName}</span>
                        <span className="text-yellow-500 mr-2">{'★'.repeat(review.rating)}</span>
                        <span className="text-gray-500 text-sm">{review.date?.toDate ? review.date.toDate().toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.text}</p>
                      {review.verificationBadge && (
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {review.verificationBadge.text}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 