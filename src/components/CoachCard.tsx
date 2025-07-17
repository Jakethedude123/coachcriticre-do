import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaStar, FaInfoCircle, FaEdit, FaCamera, FaUser } from 'react-icons/fa';
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
    certifications?: string[];
    divisions?: string[];
    clientTypes?: string[];
    federations?: string[];
    responseTime?: string;
    yearsExperience?: number | string;
  };
  small?: boolean;
  isOwner?: boolean;
  onImageEdit?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (coachId: string, selected: boolean) => void;
  showCheckbox?: boolean;
}

export default function CoachCard({ 
  coach, 
  small = false, 
  isOwner = false, 
  onImageEdit,
  selectable = false,
  selected = false,
  onSelect,
  showCheckbox = false
}: CoachCardProps) {
  const [imageError, setImageError] = useState(false);
  
  if (!coach) {
    return null;
  }

  // Normalize and filter out empty tags, and fix old option names
  const normalizeTags = (tags: string[] | undefined): string[] => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags
      .filter(tag => tag && tag.trim().length > 0)
      .map(tag => {
        // Fix old option names
        if (tag.toLowerCase().includes('experienced in female ped use') || 
            tag.toLowerCase().includes('experience in female ped use') ||
            tag.toLowerCase().includes('female ped use')) {
          return 'Female PED Use';
        }
        return tag;
      })
      .filter((tag, index, array) => array.indexOf(tag) === index); // Remove duplicates
  };

  const specialties = normalizeTags(coach.specialties);
  const credentials = normalizeTags(coach.credentials || coach.certifications);
  const fixDivisionName = (division: string) => {
    if (division.trim().toLowerCase() === 'womens bodybuilding') {
      return "Women's Bodybuilding";
    }
    return division;
  };

  const divisions = normalizeTags(coach.divisions).map(fixDivisionName);
  const clientTypes = normalizeTags(coach.clientTypes);
  const federations = normalizeTags(coach.federations);

  // Helper to render tags with consistent styling
  const renderTags = (items: string[], color: string, text: string) =>
    items.map((item, idx) => (
      <span
        key={`${text}-${item}-${idx}`}
        className={`inline-block px-2 py-1 mr-1 mb-1 rounded text-xs font-medium ${color}`}
      >
        {item}
      </span>
    ));

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectable && onSelect) {
      onSelect(coach.id, !selected);
    }
  };

  return (
    <div 
      className={`flex w-full ${small ? 'max-w-md' : 'max-w-xl'} rounded-2xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl`} 
      style={{ minHeight: small ? 120 : 180 }}
    >
      {/* Left: Image section */}
      <div className={`w-2/5 ${small ? 'bg-[#3a4250]' : 'bg-[#374151]'} relative`}>
        {coach.profileImageUrl && !imageError ? (
          <Image
            src={coach.profileImageUrl}
            alt={coach.name}
            fill
            className="object-cover"
            unoptimized={coach.profileImageUrl.includes('firebasestorage.googleapis.com')}
            onError={() => {
              console.error('Failed to load image:', coach.profileImageUrl);
              setImageError(true);
            }}
          />
        ) : null}
        {isOwner && onImageEdit && (
          <button
            onClick={onImageEdit}
            className="absolute top-2 left-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200 hover:scale-110"
            title="Edit profile image"
          >
            <FaCamera size={small ? 12 : 16} />
          </button>
        )}
      </div>
      {/* Right: Main info */}
      <div className={`w-3/5 ${small ? 'bg-[#2a3140] p-4' : 'bg-[#232b36] p-6'} flex flex-col justify-center relative`}>
        {/* Selection checkbox - only show when in compare mode */}
        {selectable && showCheckbox && (
          <div className="absolute top-2 right-2">
            <button
              onClick={handleSelectionClick}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                selected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'bg-transparent border-white hover:border-blue-300'
              }`}
              title={selected ? "Deselect for comparison" : "Select for comparison"}
            >
              {selected && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        <h3 className={`font-bold text-white mb-1 ${small ? 'text-lg' : 'text-2xl'}`}>{coach.name}</h3>
        <p className={`text-white mb-3 ${small ? 'text-xs' : 'text-sm'}`}>{coach.bio}</p>
        <div className="flex flex-wrap gap-1 items-center mb-3">
          {specialties.length > 0 && renderTags(specialties, 'bg-blue-100 text-blue-800', 'Specialty')}
          {credentials.length > 0 && renderTags(credentials, 'bg-green-100 text-green-800', 'Credential')}
          {divisions.length > 0 && renderTags(divisions, 'bg-purple-100 text-purple-800', 'Division')}
          {clientTypes.length > 0 && renderTags(clientTypes, 'bg-yellow-100 text-yellow-800', 'Client Type')}
          {federations.length > 0 && renderTags(federations, 'bg-pink-100 text-pink-800', 'Federation')}
        </div>
        
        {/* Profile link button */}
        <Link 
          href={`/coaches/${coach.id}`}
          className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
            small 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FaUser className="mr-2" size={small ? 12 : 14} />
          View Profile
        </Link>
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