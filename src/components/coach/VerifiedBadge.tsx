"use client";

import { FaCheckCircle, FaAward } from 'react-icons/fa';

interface VerifiedBadgeProps {
  className?: string;
  isPremium?: boolean;
}

export default function VerifiedBadge({ className = '', isPremium = false }: VerifiedBadgeProps) {
  return (
    <div className="relative group">
      {isPremium ? (
        <FaAward 
          className={`text-yellow-500 ${className}`}
          aria-label="Premium Verified Coach"
        />
      ) : (
        <FaCheckCircle 
          className={`text-blue-500 ${className}`}
          aria-label="Verified Coach"
        />
      )}
      
      {/* Tooltip */}
      <div className="
        absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2
        w-72 p-3 bg-gray-900 text-white text-sm rounded-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200
        shadow-lg
      ">
        <div className="text-center">
          <p className="font-medium mb-1">
            {isPremium ? 'Premium Verified Coach' : 'Verified Coach'}
          </p>
          <p className="text-gray-300 text-xs">
            {isPremium 
              ? 'This coach is a premium member of CoachCritic, demonstrating their commitment to excellence and continuous improvement.'
              : 'This coach has subscribed to CoachCritic to support their growth and gain access to marketing tools.'}
            {' '}CoachCritic does not accept payment for reviews or ratings.
          </p>
        </div>
        
        {/* Tooltip Arrow */}
        <div className="
          absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
          border-8 border-transparent border-t-gray-900
        " />
      </div>
    </div>
  );
} 