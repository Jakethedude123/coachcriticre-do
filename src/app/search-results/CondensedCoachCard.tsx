import Image from 'next/image';

interface CondensedCoachCardProps {
  coach: {
    id: string;
    name: string;
    profileImageUrl?: string;
    rating: number;
    testimonialCount: number;
    specialties: string[];
    bio: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CondensedCoachCard({ coach }: CondensedCoachCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start space-x-4 min-w-[320px] max-w-[500px]">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={coach.profileImageUrl || '/placeholder-coach.jpg'}
          alt={coach.name || 'Coach'}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
        <div className="flex items-center mt-1 space-x-2">
          <StarRating rating={coach.rating || 0} />
          <span className="ml-1 text-sm text-gray-500">
            ({coach.testimonialCount || 0} reviews)
          </span>
        </div>
        {coach.specialties && coach.specialties.length > 0 && (
          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {coach.specialties[0]}
          </span>
        )}
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {coach.bio.length > 100 ? coach.bio.slice(0, 100) + '...' : coach.bio}
        </p>
      </div>
    </div>
  );
} 