'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaImage, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { createCoachProfile } from '@/lib/firebase/coachUtils';
import { Tooltip } from '@/components/ui/Tooltip';

interface CoachFormData {
  name: string;
  trainingStyle: ('bodybuilding' | 'powerlifting')[];
  responseTime: '1-12hrs' | '12-24hrs' | '24-36hrs' | '36-48hrs' | '48+hrs';
  credentials: ('CSCS' | 'NASM' | 'ISSA' | 'NCSF' | 'ACE' | 'MS' | 'BS' | 'IFBB Pro' | 'J3U')[];
  yearsExperience: '1-3' | '3-5' | '5-7' | '7-10' | '10+';
  specialties: ('rehab' | 'injury prevention' | 'injury recovery' | 'nutrition' | 'posing' | 'contest prep' | 'lifestyle' | 'raw' | 'equipped')[];
  coachingModality: 'online' | 'in-person' | 'both';
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  divisions: (
    | 'mens physique'
    | 'classic physique'
    | 'mens bodybuilding'
    | 'womens physique'
    | 'bikini'
    | 'wellness'
    | 'figure'
    | 'womens bodybuilding'
  )[];
  clientTypes: (
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'enhanced'
    | 'non-enhanced'
    | 'masters'
    | 'female specific'
    | 'Contest Prep'
    | 'Lifestyle'
  )[];
  federations: ('OCB' | 'NPC' | 'IFBB' | 'IPF' | 'USAPL' | 'WRPF' | 'RPS' | 'APF')[];
  bio: string;
  profileImage?: File;
}

export default function CreateCoachProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CoachFormData>({
    name: '',
    trainingStyle: [],
    responseTime: '1-12hrs',
    credentials: [],
    yearsExperience: '1-3',
    specialties: [],
    coachingModality: 'online',
    location: {
      address: '',
    },
    divisions: [],
    clientTypes: [],
    federations: [],
    bio: ''
  });
  const [profileCreated, setProfileCreated] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<CoachFormData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Starting profile creation...');
    setUploadProgress(0);
    setFormError(null);

    try {
      if (!user) {
        throw new Error('User must be logged in to create a coach profile');
      }

      // Validate required fields
      if (!formData.name.trim()) {
        setFormError('Name is required');
        setLoading(false);
        return;
      }

      if (!formData.bio.trim()) {
        setFormError('Bio is required');
        setLoading(false);
        return;
      }

      if (formData.trainingStyle.length === 0) {
        setFormError('Please select at least one training style');
        setLoading(false);
        return;
      }

      // Validate image size if one is provided
      if (formData.profileImage && formData.profileImage.size > 5 * 1024 * 1024) {
        setFormError('Profile image must be less than 5MB');
        setLoading(false);
        return;
      }

      setStatus('Creating coach profile...');
      
      await createCoachProfile(
        user.uid,
        {
          name: formData.name,
          trainingStyle: formData.trainingStyle,
          responseTime: formData.responseTime,
          credentials: formData.credentials,
          yearsExperience: formData.yearsExperience,
          specialties: formData.specialties,
          coachingModality: formData.coachingModality,
          location: formData.location,
          divisions: formData.divisions,
          clientTypes: formData.clientTypes,
          federations: formData.federations,
          bio: formData.bio
        },
        formData.profileImage
      );
      
      setStatus('Profile created successfully!');
      setProfileCreated(true);
      setCreatedProfile(formData);
    } catch (error: any) {
      console.error('Final error:', error);
      setFormError(error.message || 'Failed to create coach profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please Login to Create a Coach Profile</h1>
        <p className="text-gray-600">
          You need to be logged in to create and manage your coach profile.
        </p>
      </div>
    );
  }

  if (profileCreated && createdProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Profile Created!</h2>
          <div className="flex flex-col items-center mb-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {createdProfile.profileImage ? (
                <Image
                  src={URL.createObjectURL(createdProfile.profileImage)}
                  alt="Profile preview"
                  width={128}
                  height={128}
                  className="object-cover rounded-full"
                />
              ) : (
                <FaUser className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold">{createdProfile.name}</h3>
            <p className="text-gray-600 mb-2">{createdProfile.bio}</p>
            <div className="text-sm text-gray-500 mb-2">{createdProfile.location.address}</div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {createdProfile.specialties.map((s) => (
                <span key={s} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{s}</span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {createdProfile.credentials.map((c) => (
                <span key={c} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{c}</span>
              ))}
            </div>
          </div>
          <div className="text-green-700 font-semibold mb-4">You are now entered into the system!</div>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => router.push('/coaches')}
          >
            Go to Coaches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Coach Profile</h1>
      
      {formError && (
        <div className="text-red-600 text-sm text-center mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <div className="flex items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  {formData.profileImage ? (
                    <Image
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <FaImage className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, profileImage: file });
                    }
                  }}
                  className="ml-4"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tell potential clients about yourself, your experience, and your coaching philosophy..."
              />
            </div>

            {/* Training Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Training Style</label>
              <div className="space-y-2">
                {['bodybuilding', 'powerlifting'].map((style) => (
                  <label key={style} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={formData.trainingStyle.includes(style as any)}
                      onChange={(e) => {
                        const newStyles = e.target.checked
                          ? [...formData.trainingStyle, style as any]
                          : formData.trainingStyle.filter((s) => s !== style);
                        setFormData({ ...formData, trainingStyle: newStyles });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 capitalize">{style}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credentials and Experience */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Credentials and Experience</h2>
          
          <div className="space-y-4">
            {/* Credentials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
              <div className="flex flex-wrap gap-2">
                {['CSCS', 'NASM', 'ISSA', 'NCSF', 'ACE', 'MS', 'BS', 'IFBB Pro', 'J3U'].map((credential) => (
                  <label key={credential} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.credentials.includes(credential as any)}
                      onChange={(e) => {
                        const newCredentials = e.target.checked
                          ? [...formData.credentials, credential as any]
                          : formData.credentials.filter((c) => c !== credential);
                        setFormData({ ...formData, credentials: newCredentials });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{credential}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <select
                required
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-7">5-7 years</option>
                <option value="7-10">7-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'rehab',
                  'injury prevention',
                  'injury recovery',
                  'nutrition',
                  'posing',
                  'contest prep',
                  'lifestyle',
                  'raw',
                  'equipped'
                ].map((specialty) => (
                  <label key={specialty} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty as any)}
                      onChange={(e) => {
                        const newSpecialties = e.target.checked
                          ? [...formData.specialties, specialty as any]
                          : formData.specialties.filter((s) => s !== specialty);
                        setFormData({ ...formData, specialties: newSpecialties });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 capitalize">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coaching Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Coaching Details</h2>
          
          <div className="space-y-4">
            {/* Response Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
              <select
                required
                value={formData.responseTime}
                onChange={(e) => setFormData({ ...formData, responseTime: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1-12hrs">1-12 hours</option>
                <option value="12-24hrs">12-24 hours</option>
                <option value="24-36hrs">24-36 hours</option>
                <option value="36-48hrs">36-48 hours</option>
                <option value="48+hrs">48+ hours</option>
              </select>
            </div>

            {/* Coaching Modality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coaching Modality</label>
              <select
                required
                value={formData.coachingModality}
                onChange={(e) => setFormData({ ...formData, coachingModality: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="online">Online Only</option>
                <option value="in-person">In-Person Only</option>
                <option value="both">Both Online & In-Person</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        {/* Competition Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Competition Categories</h2>
          
          <div className="space-y-4">
            {/* Divisions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisions</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'mens physique',
                  'classic physique',
                  'mens bodybuilding',
                  'womens physique',
                  'bikini',
                  'wellness',
                  'figure',
                  'womens bodybuilding'
                ].map((division) => (
                  <label key={division} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.divisions.includes(division as any)}
                      onChange={(e) => {
                        const newDivisions = e.target.checked
                          ? [...formData.divisions, division as any]
                          : formData.divisions.filter((d) => d !== division);
                        setFormData({ ...formData, divisions: newDivisions });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 capitalize">{division}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Client Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Types</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'beginner',
                  'intermediate',
                  'advanced',
                  'enhanced',
                  'non-enhanced',
                  'masters',
                  'female specific',
                  'Contest Prep',
                  'Lifestyle'
                ].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.clientTypes.includes(type as any)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.clientTypes, type as any]
                          : formData.clientTypes.filter((t) => t !== type);
                        setFormData({ ...formData, clientTypes: newTypes });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 capitalize flex items-center">
                      {type}
                      {type === 'Lifestyle' && (
                        <Tooltip
                          content={
                            <span>
                              Lifestyle coaching is focused on helping clients stay healthy, fit, and in good shape year-round, without the demands of contest preparation.
                            </span>
                          }
                        >
                          <span className="ml-1 text-blue-500 cursor-help">&#9432;</span>
                        </Tooltip>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Federations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Federations</label>
              <div className="flex flex-wrap gap-2">
                {['OCB', 'NPC', 'IFBB', 'IPF', 'USAPL', 'WRPF', 'RPS', 'APF'].map((federation) => (
                  <label key={federation} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.federations.includes(federation as any)}
                      onChange={(e) => {
                        const newFederations = e.target.checked
                          ? [...formData.federations, federation as any]
                          : formData.federations.filter((f) => f !== federation);
                        setFormData({ ...formData, federations: newFederations });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{federation}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button and Status */}
        <div className="space-y-4">
          {status && (
            <div className="text-center text-sm text-gray-600">
              {status}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-lg font-semibold text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="ml-2 text-blue-600">Creating your profile...</span>
        </div>
      )}
    </div>
  );
} 