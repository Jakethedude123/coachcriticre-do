'use client';
import React, { useState } from 'react';
import CoachCard from './CoachCard';
import ImageUploadModal from './ImageUploadModal';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import type { CoachData } from '@/lib/firebase/coachUtils';
import {
  SPECIALTIES,
  CREDENTIALS,
  DIVISIONS,
  CLIENT_TYPES,
  FEDERATIONS,
} from '@/lib/utils/coachProfileOptions';
import { updateCoachProfile, getCoachProfile } from '@/lib/firebase/coachUtils';
import { StorageService } from '@/lib/firebase/storageUtils';

interface CoachProfileDetailsProps {
  coach: CoachData;
  isOwner?: boolean;
  onEdit?: () => void;
}

const CoachProfileDetails: React.FC<CoachProfileDetailsProps> = ({ coach: initialCoach, isOwner, onEdit }) => {
  const [editBox, setEditBox] = useState<string | null>(null);
  const [coach, setCoach] = useState<CoachData>(initialCoach);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to fix old option names and normalize data
  const fixOldOptionNames = (items: string[]): string[] => {
    return items.map(item => {
      if (item.toLowerCase().includes('experienced in female ped use') || 
          item.toLowerCase().includes('experience in female ped use') ||
          item.toLowerCase().includes('female ped use')) {
        return 'Female PED Use';
      }
      return item;
    }).filter((item, index, array) => array.indexOf(item) === index); // Remove duplicates
  };

  // Helper function to check if an option is actually selected (handles old text variations)
  const isOptionSelected = (field: 'specialties' | 'divisions', option: string): boolean => {
    const items = coach[field] as string[];
    if (field === 'specialties') {
      // For specialties, check both the exact option and old variations
      return items.some(item => {
        if (option === 'Female PED Use') {
          return item === 'Female PED Use' || 
                 item.toLowerCase().includes('experienced in female ped use') ||
                 item.toLowerCase().includes('experience in female ped use') ||
                 item.toLowerCase().includes('female ped use');
        }
        return item === option;
      });
    } else if (field === 'divisions') {
      // For divisions, check both the exact option and old variations
      return items.some(item => {
        if (option === "Women's Bodybuilding") {
          return item === "Women's Bodybuilding" || 
                 item.trim().toLowerCase() === 'womens bodybuilding';
        }
        return item === option;
      });
    }
    return items.includes(option);
  };

  // Helper to fix division display
  const fixDivisionName = (division: string) => {
    if (division.trim().toLowerCase() === 'womens bodybuilding') {
      return "Women's Bodybuilding";
    }
    return division;
  };

  // Helper to update coach profile and local state
  const handleArrayChange = async (
    field: keyof Pick<CoachData, 'specialties' | 'credentials' | 'divisions' | 'clientTypes' | 'federations'>,
    value: string,
    checked: boolean
  ) => {
    const prev = coach[field] as string[];
    let updated: string[];
    
    if (checked) {
      // When checking, add the value
      updated = [...prev, value];
    } else {
      // When unchecking, remove both the exact value and any old variations
      updated = prev.filter((v) => {
        if (field === 'specialties' && value === 'Female PED Use') {
          return v !== 'Female PED Use' && 
                 !v.toLowerCase().includes('experienced in female ped use') &&
                 !v.toLowerCase().includes('experience in female ped use') &&
                 !v.toLowerCase().includes('female ped use');
        } else if (field === 'divisions' && value === "Women's Bodybuilding") {
          return v !== "Women's Bodybuilding" && 
                 v.trim().toLowerCase() !== 'womens bodybuilding';
        } else {
          return v !== value;
        }
      });
    }
    
    setCoach((c) => ({ ...c, [field]: updated }));
    await updateCoachProfile(coach.id, { [field]: updated });
    
    // Refetch the latest coach data to ensure all components stay in sync
    try {
      const updatedCoachData = await getCoachProfile(coach.id);
      if (updatedCoachData) {
        setCoach(updatedCoachData);
      }
    } catch (error) {
      console.error('Error refetching coach data after update:', error);
    }
  };

  // Bio change handlers
  const handleBioChange = (newBio: string) => {
    setCoach((c) => ({ ...c, bio: newBio }));
  };

  const handleBioSave = async () => {
    try {
      await updateCoachProfile(coach.id, { bio: coach.bio });
      setEditBox(null);
      
      // Refetch the latest coach data to ensure all components stay in sync
      const updatedCoachData = await getCoachProfile(coach.id);
      if (updatedCoachData) {
        setCoach(updatedCoachData);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleImageSave = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true);
      
      // Upload the cropped image using the StorageService
      const downloadURL = await StorageService.uploadProfileImage(coach.id, croppedImageBlob);
      
      // Update the coach profile with the new image URL
      await updateCoachProfile(coach.id, { profileImageUrl: downloadURL });
      
      // Update local state
      setCoach(prev => ({ ...prev, profileImageUrl: downloadURL }));
      
      // Refetch the latest coach data to ensure all components stay in sync
      const updatedCoachData = await getCoachProfile(coach.id);
      if (updatedCoachData) {
        setCoach(updatedCoachData);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show a user-friendly error message here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Coach Profile</h1>
      </div>
      <div className="flex justify-center mb-8">
        <CoachCard 
          coach={coach} 
          isOwner={isOwner}
          onImageEdit={() => setIsImageModalOpen(true)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-x-hidden">
        {/* About Box */}
        {editBox === 'about' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>About</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'about' ? null : 'about')}
                aria-label="Edit About"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="space-y-4">
              <textarea
                value={coach.bio}
                onChange={(e) => handleBioChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Tell us about your coaching experience, philosophy, and what makes you unique..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditBox(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBioSave()}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>About</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'about' ? null : 'about')}
                aria-label="Edit About"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{coach.bio}</p>
          </div>
        )}
        {/* Specialties Box with edit icon and all options as checkboxes */}
        {editBox === 'specialties' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Specialties</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'specialties' ? null : 'specialties')}
                aria-label="Edit Specialties"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {fixOldOptionNames(coach.specialties).length > 0 && fixOldOptionNames(coach.specialties).map((specialty) => (
                <span key={specialty} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {specialty}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'specialties' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="coach-dropdown-dark">
                {SPECIALTIES.map((option) => (
                  <label key={option} className={`coach-dropdown-option-dark ${isOptionSelected('specialties', option) ? 'coach-dropdown-option-selected-dark' : 'coach-dropdown-option-text-dark'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={isOptionSelected('specialties', option)}
                    onChange={e => handleArrayChange('specialties', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Specialties</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'specialties' ? null : 'specialties')}
                aria-label="Edit Specialties"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {fixOldOptionNames(coach.specialties).length > 0 && fixOldOptionNames(coach.specialties).map((specialty) => (
                <span key={specialty} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {specialty}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'specialties' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="coach-dropdown-dark">
                {SPECIALTIES.map((option) => (
                  <label key={option} className={`coach-dropdown-option-dark ${isOptionSelected('specialties', option) ? 'coach-dropdown-option-selected-dark' : 'coach-dropdown-option-text-dark'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={isOptionSelected('specialties', option)}
                    onChange={e => handleArrayChange('specialties', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Credentials Box with edit icon and all options as checkboxes */}
        {editBox === 'credentials' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Credentials</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'credentials' ? null : 'credentials')}
                aria-label="Edit Credentials"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.credentials.length > 0 && coach.credentials.map((credential) => (
                <span key={credential} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {credential}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'credentials' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {CREDENTIALS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.credentials.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.credentials.includes(option)}
                    onChange={e => handleArrayChange('credentials', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Credentials</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'credentials' ? null : 'credentials')}
                aria-label="Edit Credentials"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.credentials.length > 0 && coach.credentials.map((credential) => (
                <span key={credential} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {credential}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'credentials' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {CREDENTIALS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.credentials.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.credentials.includes(option)}
                    onChange={e => handleArrayChange('credentials', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Divisions Box with edit icon and all options as checkboxes */}
        {editBox === 'divisions' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Divisions</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'divisions' ? null : 'divisions')}
                aria-label="Edit Divisions"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.divisions.length > 0 && coach.divisions.map((division) => (
                <span key={division} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  {fixDivisionName(division)}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'divisions' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {DIVISIONS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${isOptionSelected('divisions', option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={isOptionSelected('divisions', option)}
                    onChange={e => handleArrayChange('divisions', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Divisions</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'divisions' ? null : 'divisions')}
                aria-label="Edit Divisions"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.divisions.length > 0 && coach.divisions.map((division) => (
                <span key={division} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  {fixDivisionName(division)}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'divisions' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {DIVISIONS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${isOptionSelected('divisions', option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={isOptionSelected('divisions', option)}
                    onChange={e => handleArrayChange('divisions', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        )}
                {/* Client Types Box with edit icon and all options as checkboxes */}
        {editBox === 'clientTypes' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Client Types</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'clientTypes' ? null : 'clientTypes')}
                aria-label="Edit Client Types"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.clientTypes.length > 0 && coach.clientTypes.map((type) => (
                <span key={type} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  {type}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'clientTypes' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {CLIENT_TYPES.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.clientTypes.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.clientTypes.includes(option)}
                    onChange={e => handleArrayChange('clientTypes', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Client Types</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'clientTypes' ? null : 'clientTypes')}
                aria-label="Edit Client Types"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.clientTypes.length > 0 && coach.clientTypes.map((type) => (
                <span key={type} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  {type}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'clientTypes' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {CLIENT_TYPES.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.clientTypes.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.clientTypes.includes(option)}
                    onChange={e => handleArrayChange('clientTypes', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        )}
                {/* Federations Box with edit icon and all options as checkboxes */}
        {editBox === 'federations' ? (
          <div className="bg-white rounded-lg shadow p-6 relative col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Federations</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'federations' ? null : 'federations')}
                aria-label="Edit Federations"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.federations.length > 0 && coach.federations.map((federation) => (
                <span key={federation} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                  {federation}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'federations' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {FEDERATIONS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.federations.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.federations.includes(option)}
                    onChange={e => handleArrayChange('federations', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
              <span>Federations</span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                onClick={() => setEditBox(editBox === 'federations' ? null : 'federations')}
                aria-label="Edit Federations"
              >
                <FaEdit size={18} />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 min-h-6">
              {coach.federations.length > 0 && coach.federations.map((federation) => (
                <span key={federation} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                  {federation}
                </span>
              ))}
            </div>
            <div
              className={`transition-all duration-300 ${editBox === 'federations' ? 'opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 shadow-inner grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {FEDERATIONS.map((option) => (
                  <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-semibold tracking-wide shadow-sm bg-white hover:bg-blue-50 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 ${coach.federations.includes(option) ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'text-gray-800'}`}
                  style={{ userSelect: 'none' }}
                >
                  <input
                    type="checkbox"
                    checked={coach.federations.includes(option)}
                    onChange={e => handleArrayChange('federations', option, e.target.checked)}
                    className="accent-blue-600 w-5 h-5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-blue-400 flex-shrink-0"
                  />
                  <span className="transition-all duration-200 text-sm">{option}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSave={handleImageSave}
        currentImageUrl={coach.profileImageUrl}
      />
    </div>
  );
};

export default CoachProfileDetails; 