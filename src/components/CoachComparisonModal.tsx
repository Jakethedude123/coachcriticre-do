'use client';

import React from 'react';
import { FaTimes, FaRedo } from 'react-icons/fa';

interface CoachData {
  id?: string;
  userId?: string;
  name: string;
  specialties: string[];
  bio: string;
  rating?: number;
  testimonialCount?: number;
  credentials?: string[];
  divisions?: string[];
  clientTypes?: string[];
  federations?: string[];
  responseTime?: string;
  yearsExperience?: number;
}

interface CoachComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOver: () => void;
  coach1: CoachData;
  coach2: CoachData;
}

export default function CoachComparisonModal({ 
  isOpen, 
  onClose, 
  onStartOver, 
  coach1, 
  coach2 
}: CoachComparisonModalProps) {
  if (!isOpen) return null;

  // Generate comparison summary
  const generateComparisonSummary = (coach1: CoachData, coach2: CoachData): string => {
    if (!coach1 || !coach2) {
      return "Unable to generate comparison at this time.";
    }
    const comparisons: string[] = [];

    // Compare ratings
    if (coach1.rating && coach2.rating) {
      if (coach1.rating > coach2.rating) {
        comparisons.push(`${coach1.name} has a higher rating (${coach1.rating.toFixed(1)} vs ${coach2.rating.toFixed(1)})`);
      } else if (coach2.rating > coach1.rating) {
        comparisons.push(`${coach2.name} has a higher rating (${coach2.rating.toFixed(1)} vs ${coach1.rating.toFixed(1)})`);
      } else {
        comparisons.push(`Both coaches have similar ratings (${coach1.rating.toFixed(1)})`);
      }
    } else if (coach1.rating && !coach2.rating) {
      comparisons.push(`${coach1.name} has a rating of ${coach1.rating.toFixed(1)}`);
    } else if (coach2.rating && !coach1.rating) {
      comparisons.push(`${coach2.name} has a rating of ${coach2.rating.toFixed(1)}`);
    }

    // Compare testimonial count
    if (coach1.testimonialCount && coach2.testimonialCount) {
      if (coach1.testimonialCount > coach2.testimonialCount) {
        comparisons.push(`${coach1.name} has more client testimonials (${coach1.testimonialCount} vs ${coach2.testimonialCount})`);
      } else if (coach2.testimonialCount > coach1.testimonialCount) {
        comparisons.push(`${coach2.name} has more client testimonials (${coach2.testimonialCount} vs ${coach1.testimonialCount})`);
      }
    } else if (coach1.testimonialCount && !coach2.testimonialCount) {
      comparisons.push(`${coach1.name} has ${coach1.testimonialCount} client testimonials`);
    } else if (coach2.testimonialCount && !coach1.testimonialCount) {
      comparisons.push(`${coach2.name} has ${coach2.testimonialCount} client testimonials`);
    }

    // Compare response time
    if (coach1.responseTime && coach2.responseTime) {
      const time1 = coach1.responseTime;
      const time2 = coach2.responseTime;
      if (time1 !== time2) {
        comparisons.push(`${coach1.name} typically responds within ${time1}, while ${coach2.name} responds within ${time2}`);
      }
    }

    // Compare specialties focus
    const contestPrep1 = coach1.specialties?.some(s => s.toLowerCase().includes('contest prep'));
    const contestPrep2 = coach2.specialties?.some(s => s.toLowerCase().includes('contest prep'));
    if (contestPrep1 && !contestPrep2) {
      comparisons.push(`${coach1.name} specializes in contest preparation, while ${coach2.name} focuses on other areas`);
    } else if (contestPrep2 && !contestPrep1) {
      comparisons.push(`${coach2.name} specializes in contest preparation, while ${coach1.name} focuses on other areas`);
    }

    // Compare client types
    const enhanced1 = coach1.clientTypes?.some(c => c.toLowerCase().includes('enhanced'));
    const enhanced2 = coach2.clientTypes?.some(c => c.toLowerCase().includes('enhanced'));
    const natural1 = coach1.clientTypes?.some(c => c.toLowerCase().includes('non-enhanced') || c.toLowerCase().includes('natural'));
    const natural2 = coach2.clientTypes?.some(c => c.toLowerCase().includes('non-enhanced') || c.toLowerCase().includes('natural'));
    
    if (enhanced1 && !enhanced2) {
      comparisons.push(`${coach1.name} works with enhanced athletes, while ${coach2.name} focuses on natural athletes`);
    } else if (enhanced2 && !enhanced1) {
      comparisons.push(`${coach2.name} works with enhanced athletes, while ${coach1.name} focuses on natural athletes`);
    }

    // Compare federations
    const ifbb1 = coach1.federations?.some(f => f.includes('IFBB'));
    const ifbb2 = coach2.federations?.some(f => f.includes('IFBB'));
    const npc1 = coach1.federations?.some(f => f.includes('NPC'));
    const npc2 = coach2.federations?.some(f => f.includes('NPC'));
    
    if (ifbb1 && !ifbb2) {
      comparisons.push(`${coach1.name} has IFBB experience, which may be valuable for elite-level competition`);
    } else if (ifbb2 && !ifbb1) {
      comparisons.push(`${coach2.name} has IFBB experience, which may be valuable for elite-level competition`);
    }

    // Compare credentials
    const hasAdvancedCreds1 = coach1.credentials?.some(c => ['MS', 'PhD', 'CSCS'].includes(c));
    const hasAdvancedCreds2 = coach2.credentials?.some(c => ['MS', 'PhD', 'CSCS'].includes(c));
    
    if (hasAdvancedCreds1 && !hasAdvancedCreds2) {
      comparisons.push(`${coach1.name} holds advanced certifications (${coach1.credentials?.filter(c => ['MS', 'PhD', 'CSCS'].includes(c)).join(', ')})`);
    } else if (hasAdvancedCreds2 && !hasAdvancedCreds1) {
      comparisons.push(`${coach2.name} holds advanced certifications (${coach2.credentials?.filter(c => ['MS', 'PhD', 'CSCS'].includes(c)).join(', ')})`);
    }

    // If we don't have enough comparisons, add some general observations
    if (comparisons.length < 2) {
      if (coach1.specialties?.length && coach2.specialties?.length) {
        const unique1 = coach1.specialties.filter(s => !coach2.specialties?.includes(s));
        const unique2 = coach2.specialties.filter(s => !coach1.specialties?.includes(s));
        
        if (unique1.length > 0) {
          comparisons.push(`${coach1.name} offers unique specialties like ${unique1.slice(0, 2).join(', ')}`);
        }
        if (unique2.length > 0) {
          comparisons.push(`${coach2.name} offers unique specialties like ${unique2.slice(0, 2).join(', ')}`);
        }
      }
    }

    // Combine into a natural summary
    if (comparisons.length === 0) {
      return `Both ${coach1.name} and ${coach2.name} appear to be qualified coaches with similar experience levels. Consider reaching out to both to discuss your specific goals and see which coach's approach better aligns with your needs.`;
    }

    const summary = comparisons.slice(0, 3).join('. ') + '.';
    return summary.charAt(0).toUpperCase() + summary.slice(1);
  };

  const summary = generateComparisonSummary(coach1, coach2);

  if (!coach1 || !coach2) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#232b36] rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Coach Comparison
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Coach Names */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {coach1.name}
              </h3>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {coach1.rating?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-500 text-sm">
                  ({coach1.testimonialCount || 0} reviews)
                </span>
              </div>
            </div>
            
            <div className="text-gray-400 mx-4">vs</div>
            
            <div className="text-center flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {coach2.name}
              </h3>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {coach2.rating?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-500 text-sm">
                  ({coach2.testimonialCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 dark:bg-[#2a3441] rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Smart Summary
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Key Differences */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Key Differences
            </h4>
            
            {/* Specialties */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {coach1.name}'s Specialties
                </h5>
                <div className="flex flex-wrap gap-1">
                  {coach1.specialties?.slice(0, 3).map((specialty, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {coach2.name}'s Specialties
                </h5>
                <div className="flex flex-wrap gap-1">
                  {coach2.specialties?.slice(0, 3).map((specialty, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Types */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {coach1.name}'s Client Types
                </h5>
                <div className="flex flex-wrap gap-1">
                  {coach1.clientTypes?.slice(0, 2).map((type, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {coach2.name}'s Client Types
                </h5>
                <div className="flex flex-wrap gap-1">
                  {coach2.clientTypes?.slice(0, 2).map((type, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onStartOver}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <FaRedo size={16} />
            <span>Start Over</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 