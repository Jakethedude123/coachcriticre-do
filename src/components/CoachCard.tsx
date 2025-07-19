import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaStar, FaInfoCircle, FaEdit, FaCamera, FaUser, FaMedal, FaTrophy, FaAward } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip';

import { Coach } from '@/lib/firebase/models/coach';
import type { CoachProfile } from '@/lib/types/coach';

interface CoachCardProps {
  coach: Coach | CoachProfile | any; // Allow CoachData and other compatible types
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
        className={`inline-block px-2 py-1 mr-1 mb-1 rounded-full text-xs font-medium ${color} tag-hover transform`}
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
    <Link 
      href={`/coaches/${'id' in coach ? coach.id : coach.userId}`}
      className="block w-full h-full"
    >
      <div 
        className={`flex w-full h-full ${small ? 'max-w-sm' : 'max-w-lg'} rounded-2xl overflow-hidden shadow-2xl coach-card-enhanced group cursor-pointer relative border border-gray-100`} 
        style={{ 
          minHeight: small ? 120 : 180,
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced hover overlay effect */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/15 to-purple-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none`}></div>
        
        {/* Left: Image section */}
      <div className={`w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden`}>
        {/* Handle both Coach and CoachProfile image fields */}
        {(() => {
          const imageUrl = 'profileImage' in coach ? coach.profileImage : ('avatar' in coach ? coach.avatar : undefined);
          return imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={coach.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110`}
              unoptimized={imageUrl.includes('firebasestorage.googleapis.com')}
              onError={() => {
                console.error('Failed to load image:', imageUrl);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <FaUser className="text-gray-400 text-5xl" />
            </div>
          );
        })()}
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
      <div className={`w-3/5 ${small ? 'p-4' : 'p-6'} flex flex-col justify-center relative`} style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        
        <h3 className={`font-extrabold text-gray-900 mb-2 ${small ? 'text-lg' : 'text-3xl'} transition-all duration-500 group-hover:text-blue-600 group-hover:scale-105 transform bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text group-hover:from-blue-600 group-hover:to-blue-800`}>{coach.name}</h3>
        <p className={`text-gray-600 mb-3 ${small ? 'text-xs' : 'text-base'} line-clamp-2 leading-relaxed transition-all duration-500 group-hover:text-gray-700 overflow-hidden font-medium`}>
          {coach.bio && coach.bio.length > 100 ? `${coach.bio.substring(0, 100)}...` : (coach.bio || 'No bio available')}
        </p>
        <div className="flex flex-wrap gap-2 items-center mb-3">
          {specialties.length > 0 && renderTags(specialties, 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 group-hover:from-blue-200 group-hover:to-blue-300 group-hover:text-blue-900 shadow-sm', 'Specialty')}
          {credentials.length > 0 && renderTags(credentials, 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 group-hover:from-green-200 group-hover:to-green-300 group-hover:text-green-900 shadow-sm', 'Credential')}
          {divisions.length > 0 && renderTags(divisions, 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 group-hover:from-purple-200 group-hover:to-purple-300 group-hover:text-purple-900 shadow-sm', 'Division')}
          {clientTypes.length > 0 && renderTags(clientTypes, 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 group-hover:from-yellow-200 group-hover:to-yellow-300 group-hover:text-yellow-900 shadow-sm', 'Client Type')}
          {federations.length > 0 && renderTags(federations, 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 group-hover:from-pink-200 group-hover:to-pink-300 group-hover:text-pink-900 shadow-sm', 'Federation')}
        </div>
        
        {/* Selection checkbox for compare mode */}
        {showCheckbox && (
          <div 
            className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 cursor-pointer ${
              selected 
                ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 shadow-lg' 
                : 'bg-white border-gray-300 hover:border-red-400'
            }`}
            onClick={handleSelectionClick}
          >
            {selected && (
              <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}

        {/* Enhanced click indicator (only show when not in compare mode) */}
        {!showCheckbox && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
    </Link>
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