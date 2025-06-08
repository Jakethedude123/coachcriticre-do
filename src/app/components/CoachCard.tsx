import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Coach } from '@/lib/firebase/models/coach';

interface CoachCardProps {
  coach: Coach;
}

function formatPricing(coach: Coach): string {
  if (!coach.pricing) return '';
  return `$${coach.pricing.rate} ${coach.pricing.currency}/${coach.pricing.interval}`;
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link
      href={`/coaches/profile/${coach.userId}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={coach.avatar || '/placeholder-coach.jpg'}
              alt={coach.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{coach.name}</h2>
                <div className="mt-1 flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  {coach.location.city}, {coach.location.state}
                </div>
                <div className="mt-1 flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  {coach.experience} experience
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">{coach.experience}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 