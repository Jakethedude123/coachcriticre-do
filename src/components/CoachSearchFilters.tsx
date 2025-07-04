"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaDumbbell, FaTrophy, FaCog, FaUsers, FaMedal, FaGlobeAmericas, FaMapMarkerAlt } from 'react-icons/fa';
import { SearchFilters } from '@/lib/firebase/coachUtils';
import { Tooltip } from '@/components/ui/Tooltip';

interface FilterProps {
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
}

const TIME_ZONES = [
  'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'EET', 'IST', 'AEST', 'JST'
];

export default function CoachSearchFilters({ onFiltersChange }: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    pricing: true,
    competition: true,
    specializations: false,
    timeZone: false,
    proximity: false,
    clientTypes: false,
    contestPrep: false,
    certifications: false
  });

  const [filters, setFilters] = useState<SearchFilters>({
    specialties: [],
    location: '',
    trainingStyle: [],
    coachingModality: [],
    federations: [],
        hasCompetitionExperience: false,
    requiresFormCorrection: false,
    requiresPosingCoaching: false,
    requiresInjuryPrevention: false,
    requiresInjuryRecovery: false,
    requiresNutrition: false,
    requiresLifestyleCoaching: false,
    requiresBodybuilding: false,
    specialtyLifts: [],
    naturalOnly: false,
    enhancedExperience: false,
    experienceLevel: 'beginners',
    weightClass: '',
    requiresContestPrep: false,
    minimumSuccessfulPreps: 0,
    requiresOffSeasonExperience: false,
    certifications: [],
    sortByScore: true,
    experiencedFemalePED: false,
    edRecovery: false,
    labworkInterpretation: false,
    timeZones: [],
    proximityMiles: 0,
    proximityLocation: ''
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof SearchFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* Competition Experience Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('competition')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Looking to Compete In
          </span>
          {expandedSections.competition ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.competition && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Your Federation</label>
              <div className="mt-2 space-y-2">
                {['IFBB', 'NPC','OCB'].map(federation => (
                  <label key={federation} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={filters.federations?.includes(federation)}
                      onChange={() => handleArrayFilterChange('federations', federation)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{federation}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select the federation(s) you plan to compete in</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Your Division</label>
              <div className="mt-2 space-y-2">
                {[
                  'Mens Physique',
                  'Mens Classic Physique',
                  'Mens Bodybuilding',
                  "Women's Bodybuilding",
                  "Women's Physique",
                  'Figure',
                  'Wellness',
                  'Bikini'
                ].map(division => (
                  <label key={division} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={filters.divisions?.includes(division)}
                      onChange={() => handleArrayFilterChange('divisions', division)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{division}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select the division(s) you plan to compete in</p>
            </div>
          </div>
        )}
      </div>

      {/* Specializations Section (renamed from Technical Expertise) */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('specializations')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaCog className="text-gray-500" />
            Specializations
          </span>
          {expandedSections.specializations ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.specializations && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresFormCorrection}
                  onChange={(e) => handleFilterChange('requiresFormCorrection', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Form Correction</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresPosingCoaching}
                  onChange={(e) => handleFilterChange('requiresPosingCoaching', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Posing Coaching</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresInjuryRecovery}
                  onChange={(e) => handleFilterChange('requiresInjuryRecovery', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Injury Recovery</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresNutrition}
                  onChange={(e) => handleFilterChange('requiresNutrition', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Nutrition</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.experiencedFemalePED}
                  onChange={(e) => handleFilterChange('experiencedFemalePED', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Experienced in Female PED Use</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.edRecovery}
                  onChange={(e) => handleFilterChange('edRecovery', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">ED Recovery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.labworkInterpretation}
                  onChange={(e) => handleFilterChange('labworkInterpretation', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Labwork Interpretation</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Time Zone Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('timeZone')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaGlobeAmericas className="text-green-500" />
            Time Zone
          </span>
          {expandedSections.timeZone ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.timeZone && (
          <div className="space-y-2 mt-4">
            {TIME_ZONES.map(tz => (
              <label key={tz} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={filters.timeZones?.includes(tz)}
                  onChange={() => handleArrayFilterChange('timeZones', tz)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">{tz}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location/Proximity Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('proximity')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            Location / Proximity
          </span>
          {expandedSections.proximity ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.proximity && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.proximityLocation}
                onChange={e => handleFilterChange('proximityLocation', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter city, state, or zip code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proximity (miles)</label>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.proximityMiles}
                onChange={e => handleFilterChange('proximityMiles', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Show coaches within {filters.proximityMiles} miles</div>
            </div>
          </div>
        )}
      </div>

      {/* Client Types Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('clientTypes')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaUsers className="text-purple-500" />
            Client Types
          </span>
          {expandedSections.clientTypes ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.clientTypes && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.naturalOnly}
                  onChange={(e) => handleFilterChange('naturalOnly', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Natural Athletes Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.enhancedExperience}
                  onChange={(e) => handleFilterChange('enhancedExperience', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Enhanced Athletes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresLifestyleCoaching}
                  onChange={(e) => handleFilterChange('requiresLifestyleCoaching', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center">Lifestyle
                  <Tooltip content={<span>Lifestyle coaching is focused on helping clients stay healthy, fit, and in good shape year-round, without the demands of contest preparation.</span>}>
                    <span className="ml-1 text-blue-500 cursor-help">&#9432;</span>
                  </Tooltip>
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Contest Prep Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('contestPrep')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaMedal className="text-yellow-600" />
            Contest Prep
          </span>
          {expandedSections.contestPrep ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.contestPrep && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.requiresContestPrep}
                  onChange={(e) => handleFilterChange('requiresContestPrep', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Contest Prep Experience Required</span>
              </label>
            </div>
            {filters.requiresContestPrep && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Successful Preps</label>
                <input
                  type="number"
                  value={filters.minimumSuccessfulPreps}
                  onChange={(e) => handleFilterChange('minimumSuccessfulPreps', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter minimum number"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('certifications')}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaMedal className="text-yellow-500" />
            Certifications
          </span>
          {expandedSections.certifications ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.certifications && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Certifications</label>
              <div className="mt-2 space-y-2">
                {['ISSA', 'NASM', 'ACE', 'NSCA', 'CSCS', 'NCSF', 'B.S.', 'M.S.', 'PhD', 'VizualFX', 'N1', 'HCU', 'J3U'].map(cert => (
                  <label key={cert} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={filters.certifications?.includes(cert)}
                      onChange={() => handleArrayFilterChange('certifications', cert)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{cert}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select required certifications</p>
            </div>
          </div>
        )}
      </div>

      {/* Add a textbox below all sorting criteria */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="anything else?"
          value={filters.anythingElse || ''}
          onChange={e => handleFilterChange('anythingElse', e.target.value)}
          className="w-full rounded-md border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
} 