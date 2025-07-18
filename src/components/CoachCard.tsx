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

  // Reset image error when coach changes
  useEffect(() => {
    setImageError(false);
  }, [coach.profileImage, coach.avatar]);
  
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
    e.preventDefault();
    if (selectable && onSelect) {
      // Handle both Coach and CoachProfile types
      const coachId = 'id' in coach ? coach.id : coach.userId;
      onSelect(coachId, !selected);
    }
  };

  // Helper function to get image URL from coach data
  const getImageUrl = (coach: any): string | undefined => {
    // Check multiple possible field names for the profile image
    const possibleFields = ['profileImageUrl', 'profileImage', 'avatar', 'image', 'profilePicture', 'photo'];
    
    for (const field of possibleFields) {
      if (coach[field] && typeof coach[field] === 'string' && coach[field].trim() !== '') {
        console.log(`Found image in field: ${field}`, coach[field]);
        return coach[field];
      }
    }
    
    console.log('No image found in coach data:', {
      profileImageUrl: coach.profileImageUrl,
      profileImage: coach.profileImage,
      avatar: coach.avatar,
      image: coach.image,
      profilePicture: coach.profilePicture,
      photo: coach.photo
    });
    
    return undefined;
  };

  // Helper function to truncate bio with word limit
  const truncateBio = (bio: string, wordLimit: number = 8) => {
    if (!bio) return 'No bio available';
    const words = bio.split(' ');
    if (words.length <= wordLimit) return bio;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

    const cardContent = (
    <div 
      className={`flex flex-col w-full ${small ? 'w-full' : 'max-w-xs'} rounded-2xl overflow-hidden shadow-2xl coach-card-enhanced group cursor-pointer relative border border-gray-100`} 
      style={{ 
        minHeight: small ? 200 : 360, // Increased height for better 50/50 split
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={showCheckbox ? handleSelectionClick : undefined}
    >
      {/* Enhanced hover overlay effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[#667eea]/15 to-[#764ba2]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none`}></div>
      
      {/* Top: Image section with Instagram story-style background */}
      <div className={`h-1/2 relative overflow-hidden flex items-center justify-center`}>
        {/* Blurred background image (Instagram story style) */}
        {(() => {
          const imageUrl = getImageUrl(coach);
          return imageUrl && !imageError ? (
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={coach.name}
                fill
                className="object-cover blur-sm scale-110"
                unoptimized={imageUrl.includes('firebasestorage.googleapis.com')}
                onError={() => {
                  console.error('Failed to load background image:', imageUrl);
                  setImageError(true);
                }}
              />
              {/* Gradient overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/80 to-[#764ba2]/80"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]"></div>
          );
        })()}
        
        {/* Circular profile picture */}
        {(() => {
          const imageUrl = getImageUrl(coach);
          return imageUrl && !imageError ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
              <Image
                src={imageUrl}
                alt={coach.name}
                width={128}
                height={128}
                className={`object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110`}
                unoptimized={imageUrl.includes('firebasestorage.googleapis.com')}
                onError={() => {
                  console.error('Failed to load profile image:', imageUrl);
                  setImageError(true);
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg relative z-10">
              <FaUser className="text-white text-6xl" />
            </div>
          );
        })()}
        
        {/* Camera edit button */}
        {isOwner && onImageEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onImageEdit();
            }}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm z-20"
            title="Edit profile image"
          >
            <FaCamera size={small ? 12 : 14} />
          </button>
        )}
      </div>

      {/* Bottom: Main info */}
      <div className={`h-1/2 p-4 flex flex-col justify-start relative bg-white`}>
        {/* Coach name */}
        <h3 className={`font-bold text-gray-900 mb-2 text-center ${small ? 'text-lg' : 'text-xl'} transition-all duration-500 group-hover:text-blue-600`}>
          {coach.name.toUpperCase()}
        </h3>
        
        {/* Bio with word limit */}
        <p className={`text-gray-600 mb-3 text-center text-sm leading-relaxed transition-all duration-500 group-hover:text-gray-700`}>
          {truncateBio(coach.bio, 8)}
        </p>
        
        {/* All Tags - Show more tags */}
        <div className="flex flex-wrap gap-1 justify-center">
          {specialties.map((specialty, idx) => (
            <span key={`specialty-${idx}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {specialty}
            </span>
          ))}
          {credentials.map((credential, idx) => (
            <span key={`credential-${idx}`} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {credential}
            </span>
          ))}
          {divisions.map((division, idx) => (
            <span key={`division-${idx}`} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {division}
            </span>
          ))}
          {clientTypes.map((clientType, idx) => (
            <span key={`clientType-${idx}`} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              {clientType}
            </span>
          ))}
          {federations.map((federation, idx) => (
            <span key={`federation-${idx}`} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
              {federation}
            </span>
          ))}
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
            <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-xl border-2 border-white">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Conditionally wrap in Link only when not in compare mode
  if (showCheckbox) {
    return cardContent;
  }

  return (
    <Link 
      href={`/coaches/${'id' in coach ? coach.id : coach.userId}`}
      className="block w-full h-full"
    >
      {cardContent}
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