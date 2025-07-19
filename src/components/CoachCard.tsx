import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaStar, FaInfoCircle, FaEdit, FaCamera, FaUser, FaMedal, FaTrophy, FaAward } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip';

import { Coach } from '@/lib/firebase/models/coach';
import type { CoachProfile } from '@/lib/types/coach';

interface CoachCardProps {
  coach: Coach | CoachProfile;
  small?: boolean;
  isOwner?: boolean;
  onImageEdit?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (coachId: string, selected: boolean) => void;
  showCheckbox?: boolean;
  hideViewProfile?: boolean;
}

export default function CoachCard({ 
  coach, 
  small = false, 
  isOwner = false, 
  onImageEdit,
  selectable = false,
  selected = false,
  onSelect,
  showCheckbox = false,
  hideViewProfile = false
}: CoachCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animate card entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
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

  // Handle both Coach and CoachProfile types for all fields
  const specialties = normalizeTags(coach.specialties);
  const credentials = normalizeTags('credentials' in coach ? coach.credentials : coach.certifications);
  const fixDivisionName = (division: string) => {
    if (division.trim().toLowerCase() === 'womens bodybuilding') {
      return "Women's Bodybuilding";
    }
    return division;
  };

  const divisions = normalizeTags(coach.divisions).map(fixDivisionName);
  
  // Handle clientTypes - CoachProfile has object, Coach has string array
  const clientTypes = (() => {
    if ('clientTypes' in coach) {
      if (Array.isArray(coach.clientTypes)) {
        return normalizeTags(coach.clientTypes);
      } else if (coach.clientTypes && typeof coach.clientTypes === 'object') {
        // Convert boolean object to string array
        const types: string[] = [];
        if (coach.clientTypes.natural) types.push('Natural');
        if (coach.clientTypes.enhanced) types.push('Enhanced');
        if (coach.clientTypes.beginners) types.push('Beginners');
        if (coach.clientTypes.advanced) types.push('Advanced');
        if (coach.clientTypes.competitors) types.push('Competitors');
        return normalizeTags(types);
      }
    }
    return normalizeTags([]);
  })();
  
  const federations = normalizeTags(coach.federations);

  // Helper to render tags with consistent styling and animations
  const renderTags = (items: string[], color: string, text: string) =>
    items.map((item, idx) => (
      <span
        key={`${text}-${item}-${idx}`}
        className={`inline-block px-2 py-1 mr-1 mb-1 rounded-full text-xs font-medium ${color} transition-all duration-300 hover:scale-110 hover:shadow-md transform`}
        style={{ 
          animationDelay: `${idx * 50}ms`,
          animation: isLoaded ? 'fadeInUp 0.5s ease-out forwards' : 'none'
        }}
      >
        {item}
      </span>
    ));

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectable && onSelect) {
      // Handle both Coach and CoachProfile types
      const coachId = 'id' in coach ? coach.id : coach.userId;
      onSelect(coachId, !selected);
    }
  };

  return (
    <div 
      className={`flex w-full h-full ${small ? 'max-w-sm' : 'max-w-lg'} rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] group bg-white !bg-white`} 
      style={{ 
        minHeight: small ? 120 : 160,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-out',
        backgroundColor: 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: Image section */}
      <div className={`w-2/5 ${small ? 'bg-gray-200' : 'bg-gray-300'} relative overflow-hidden`}>
        {/* Handle both Coach and CoachProfile image fields */}
        {(() => {
          const imageUrl = 'profileImage' in coach ? coach.profileImage : coach.avatar;
          return imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={coach.name}
              fill
              className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              unoptimized={imageUrl.includes('firebasestorage.googleapis.com')}
              onError={() => {
                console.error('Failed to load image:', imageUrl);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          );
        })()}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isOwner && onImageEdit && (
          <button
            onClick={onImageEdit}
            className="absolute top-2 left-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            title="Edit profile image"
          >
            <FaCamera size={small ? 12 : 16} />
          </button>
        )}
      </div>
      {/* Right: Main info */}
      <div className={`w-3/5 ${small ? 'bg-white p-4' : 'bg-white p-6'} flex flex-col justify-center relative !bg-white`} style={{ backgroundColor: 'white' }}>
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
        
        <h3 className={`font-bold text-gray-900 mb-2 ${small ? 'text-lg' : 'text-2xl'} transition-all duration-300 ${isHovered ? 'text-blue-600' : ''}`}>{coach.name}</h3>
        <p className={`text-gray-600 mb-4 ${small ? 'text-xs' : 'text-sm'} line-clamp-2 leading-relaxed transition-all duration-300 ${isHovered ? 'text-gray-700' : ''}`}>
          {coach.bio.length > 100 ? `${coach.bio.substring(0, 100)}...` : coach.bio}
        </p>
        <div className="flex flex-wrap gap-1 items-center mb-4">
          {specialties.length > 0 && renderTags(specialties, 'bg-blue-100 text-blue-800', 'Specialty')}
          {credentials.length > 0 && renderTags(credentials, 'bg-green-100 text-green-800', 'Credential')}
          {divisions.length > 0 && renderTags(divisions, 'bg-purple-100 text-purple-800', 'Division')}
          {clientTypes.length > 0 && renderTags(clientTypes, 'bg-yellow-100 text-yellow-800', 'Client Type')}
          {federations.length > 0 && renderTags(federations, 'bg-pink-100 text-pink-800', 'Federation')}
        </div>
        
        {/* Profile link button */}
        {!hideViewProfile && (
          <Link 
            href={`/coaches/${'id' in coach ? coach.id : coach.userId}`}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform`}
          >
            <FaUser className="mr-2" size={small ? 12 : 14} />
            View Profile
          </Link>
        )}
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