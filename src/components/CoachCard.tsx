import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip';

interface CoachCardProps {
  coach: {
    id: string;
    name: string;
    specialties: string[];
    bio: string;
    profileImageUrl?: string;
    rating: number;
    testimonialCount: number;
    score?: number;
    scoreDetails?: {
      satisfaction: number;
      consistency: number;
      experience: number;
      successRatio: number;
      retention: number;
    };
  };
}

export default function CoachCard({ coach }: CoachCardProps) {
  if (!coach) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={coach.profileImageUrl || '/placeholder-coach.jpg'}
            alt={coach.name || 'Coach'}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        {/* Coach Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{coach.name}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <div className="flex items-center">
                  <StarRating rating={coach.rating || 0} />
                  <span className="ml-1 text-sm text-gray-500">
                    ({coach.testimonialCount || 0} reviews)
                  </span>
                </div>
                {coach.score && (
                  <div className="flex items-center">
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded flex items-center gap-1">
                      Score: {coach.score}
                      <Tooltip
                        content={
                          <div className="w-[600px] grid grid-cols-5 gap-4">
                            <div className="col-span-5 mb-1">
                              <p className="font-medium text-center">Score Breakdown</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-300">Satisfaction</p>
                              <p className="text-lg font-medium">{coach.scoreDetails?.satisfaction}</p>
                              <p className="text-xs mt-1 text-blue-200">20% Weight</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-300">Consistency</p>
                              <p className="text-lg font-medium">{coach.scoreDetails?.consistency}</p>
                              <p className="text-xs mt-1 text-blue-200">25% Weight</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-300">Experience</p>
                              <p className="text-lg font-medium">{coach.scoreDetails?.experience}</p>
                              <p className="text-xs mt-1 text-blue-200">15% Weight</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-300">Success</p>
                              <p className="text-lg font-medium">{coach.scoreDetails?.successRatio}</p>
                              <p className="text-xs mt-1 text-blue-200">25% Weight</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-300">Retention</p>
                              <p className="text-lg font-medium">{coach.scoreDetails?.retention}</p>
                              <p className="text-xs mt-1 text-blue-200">15% Weight</p>
                            </div>
                          </div>
                        }
                      >
                        <FaInfoCircle className="text-blue-600 hover:text-blue-700 cursor-help ml-1 w-4 h-4" />
                      </Tooltip>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {coach.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <p className="mt-2 text-gray-600 text-sm line-clamp-2">{coach.bio}</p>

          {/* Score Details */}
          {coach.scoreDetails && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
              <ScoreDetail label="Satisfaction" value={coach.scoreDetails.satisfaction} />
              <ScoreDetail label="Consistency" value={coach.scoreDetails.consistency} />
              <ScoreDetail label="Experience" value={coach.scoreDetails.experience} />
              <ScoreDetail label="Success" value={coach.scoreDetails.successRatio} />
              <ScoreDetail label="Retention" value={coach.scoreDetails.retention} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreDetail({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center p-1 bg-gray-50 rounded">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-700">{value}</div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
} 