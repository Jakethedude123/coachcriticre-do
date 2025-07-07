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
      className="block bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex items-center gap-8 max-w-2xl mx-auto border border-blue-100 hover:scale-[1.025]"
    >
      {/* Left: Circular Image with border */}
      <div className="flex-shrink-0">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md bg-white">
          <Image
            src={coach.avatar || '/placeholder-coach.jpg'}
            alt={coach.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      {/* Right: Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-1 tracking-tight">{coach.name}</h2>
        <div className="text-base text-blue-700 font-semibold mb-2">{coach.headline || coach.specialties?.[0]}</div>
        <div className="text-gray-600 mb-2 font-medium">
          <span className="font-semibold">{coach.location.city}, {coach.location.state}</span>
        </div>
        <div className="text-gray-500 mb-2 text-sm">
          {coach.experience} experience
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {coach.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-200 text-blue-900 text-xs rounded-full font-semibold shadow-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
        {coach.bio && (
          <div className="mt-3 text-gray-700 text-sm leading-relaxed line-clamp-2">{coach.bio}</div>
        )}
      </div>
    </Link>
  );
} 