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
      className="block rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-xl mx-auto border border-blue-100 bg-white overflow-hidden flex h-56 dark:bg-black dark:border-cyan-400 neon-glow"
    >
      {/* Left: Full photo, half width */}
      <div className="w-1/2 h-full relative">
        <Image
          src={coach.avatar || '/placeholder-coach.jpg'}
          alt={coach.name}
          fill
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right: Name and bio, 40% width */}
      <div className="w-2/5 flex flex-col justify-center px-6 py-6 bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-2 truncate dark:text-cyan-300">{coach.name}</h2>
        {coach.bio && (
          <div className="text-gray-700 text-base leading-relaxed line-clamp-4 dark:text-cyan-100">{coach.bio}</div>
        )}
      </div>
    </Link>
  );
} 