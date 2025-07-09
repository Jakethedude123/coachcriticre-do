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
    credentials?: string[];
    divisions?: string[];
    clientTypes?: string[];
    federations?: string[];
  };
  small?: boolean;
}

export default function CoachCard({ coach, small = false }: CoachCardProps) {
  if (!coach) {
    return null;
  }

  // Helper to render tags with color
  const renderTags = (items: string[], color: string, text: string) =>
    items.map((item, idx) => (
      <span
        key={item + idx}
        className={`inline-block px-2 py-1 mr-1 mb-1 rounded text-xs font-medium ${color}`}
      >
        {item}
      </span>
    ));

  return (
    <div className={`flex w-full ${small ? 'max-w-md' : 'max-w-xl'} rounded-2xl overflow-hidden shadow-lg`} style={{ minHeight: small ? 120 : 180 }}>
      {/* Left: Two-tone dark */}
      <div className={`w-2/5 ${small ? 'bg-[#3a4250]' : 'bg-[#374151]'}`} />
      {/* Right: Main info */}
      <div className={`w-3/5 ${small ? 'bg-[#2a3140] p-4' : 'bg-[#232b36] p-6'} flex flex-col justify-center`}>
        <h3 className={`font-bold text-white mb-1 ${small ? 'text-lg' : 'text-2xl'}`}>{coach.name}</h3>
        <p className={`text-white mb-3 ${small ? 'text-xs' : 'text-sm'}`}>{coach.bio}</p>
        <div className="flex flex-wrap gap-1 items-center">
          {renderTags(coach.specialties || [], 'bg-blue-100 text-blue-800', 'Specialty')}
          {renderTags(coach.credentials || [], 'bg-green-100 text-green-800', 'Credential')}
          {renderTags(coach.divisions || [], 'bg-purple-100 text-purple-800', 'Division')}
          {renderTags(coach.clientTypes || [], 'bg-yellow-100 text-yellow-800', 'Client Type')}
          {renderTags(coach.federations || [], 'bg-pink-100 text-pink-800', 'Federation')}
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