"use client";

import { useState } from 'react';
import { FaBalanceScale, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Tooltip } from '@/components/ui/Tooltip';

interface CompareButtonProps {
  isActive: boolean;
  onToggle: () => void;
  selectedCount: number;
}

export default function CompareButton({ isActive, onToggle, selectedCount }: CompareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Sticky Compare Button */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={onToggle}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group ${
            isActive 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title="Compare Coaches"
        >
          <FaBalanceScale size={20} />
          
          {/* Selection count badge */}
          {selectedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {selectedCount}
            </span>
          )}
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isActive ? 'Exit Compare Mode' : 'Compare Coaches'}
          </span>
        </button>

        {/* Info button */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute -top-2 -left-2 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Compare Feature Info"
        >
          <FaInfoCircle size={14} />
        </button>

        {/* Info tooltip */}
        {showTooltip && (
          <div className="absolute right-full mr-3 top-0 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm max-w-xs shadow-lg">
            <div className="flex items-start space-x-2">
              <FaInfoCircle className="text-blue-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Compare Coaches Feature</p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Click to enter compare mode, then select up to 2 coaches to compare their specialties, 
                  credentials, and experience side-by-side.
                </p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 