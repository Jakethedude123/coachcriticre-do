'use client';

import React, { useState, useEffect } from 'react';
import { SearchFilters } from '@/types/coach';

interface CoachSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isMobile?: boolean;
}

const CoachSearchFilters: React.FC<CoachSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  isMobile = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterChange = (key: keyof SearchFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  return (
    <div className="bg-white dark:bg-[#181d23] rounded-2xl shadow-lg border border-gray-200 dark:border-[#232b36] p-6">
      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left mb-4 p-3 bg-gray-50 dark:bg-[#232b36] rounded-lg"
        >
          <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      <div className={`${isMobile && !isExpanded ? 'hidden' : ''}`}>
        {/* Division Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Select Your Division</h3>
          <div className="grid grid-cols-2 gap-2">
            {['D1', 'D2', 'D3', 'NAIA', 'NJCAA', 'Club'].map((division) => (
              <button
                key={division}
                onClick={() => handleArrayFilterChange('divisions', division)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.divisions || []).includes(division)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {division}
              </button>
            ))}
          </div>
        </div>

        {/* Position Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Select Your Position</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((position) => (
              <button
                key={position}
                onClick={() => handleArrayFilterChange('positions', position)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.positions || []).includes(position)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Experience Level</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((level) => (
              <button
                key={level}
                onClick={() => handleArrayFilterChange('experienceLevels', level)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.experienceLevels || []).includes(level)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Specialization Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specialization</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Technical Skills', 'Tactical Analysis', 'Physical Training', 'Mental Game', 'Recovery', 'Nutrition'].map((specialization) => (
              <button
                key={specialization}
                onClick={() => handleArrayFilterChange('specializations', specialization)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.specializations || []).includes(specialization)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {specialization}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
          <div className="grid grid-cols-2 gap-2">
            {['$0-50', '$51-100', '$101-200', '$201+'].map((range) => (
              <button
                key={range}
                onClick={() => handleArrayFilterChange('priceRanges', range)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.priceRanges || []).includes(range)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Availability</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Weekdays', 'Weekends', 'Evenings', 'Mornings'].map((availability) => (
              <button
                key={availability}
                onClick={() => handleArrayFilterChange('availability', availability)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  (filters.availability || []).includes(availability)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-300 dark:hover:bg-[#2d3748]'
                }`}
              >
                {availability}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => onFiltersChange({})}
          className="w-full p-3 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors dark:bg-[#232b36] dark:border-[#374151] dark:text-gray-400 dark:hover:bg-[#2d3748]"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default CoachSearchFilters; 