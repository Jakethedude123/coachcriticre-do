"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCoachProfile, updateCoachProfile } from "@/lib/firebase/coachUtils";
import type { CoachData } from "@/lib/firebase/coachUtils";
import { storage } from '@/lib/firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const SPECIALTIES = [
  'rehab', 'injury recovery', 'nutrition', 'posing', 'contest prep', 'lifestyle'
];
const CREDENTIALS = [
  'CSCS', 'NASM', 'ISSA', 'NCSF', 'ACE', 'MS', 'BS', 'J3U', 'VizualFX', 'N1', 'HCU'
];
const DIVISIONS = [
  'mens physique', 'classic physique', 'mens bodybuilding', 'womens physique', 'bikini', 'wellness', 'figure', 'womens bodybuilding'
];
const CLIENT_TYPES = [
  'beginner', 'intermediate', 'advanced', 'enhanced', 'non-enhanced', 'masters', 'female specific', 'Contest Prep', 'Lifestyle'
];
const FEDERATIONS = [
  'OCB', 'NPC', 'IFBB'
];

export default function EditCoachProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    async function fetchCoach() {
      setLoading(true);
      try {
        const data = await getCoachProfile(id as string);
        setCoach(data);
      } catch (err) {
        setError("Failed to load coach profile");
      } finally {
        setLoading(false);
      }
    }
    fetchCoach();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!coach) return;
    const { name, value } = e.target;
    setCoach({ ...coach, [name]: value });
  };

  const handleArrayChange = (field: keyof CoachData, value: string) => {
    if (!coach) return;
    setCoach({ ...coach, [field]: value.split(",").map((v) => v.trim()) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    setSaving(true);
    setError(null);
    try {
      await updateCoachProfile(coach.id, coach);
      router.push(`/coaches/profile/${coach.id}`);
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !coach) return;
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    try {
      const storageRef = ref(storage, `coachProfileImages/${coach.id}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setUploadError(error.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCoach((prev) => prev ? { ...prev, profileImageUrl: downloadURL } : prev);
          setUploading(false);
        }
      );
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!coach) return <div className="p-8 text-center">Coach not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Coach Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-32 h-32 mb-2">
            {coach.profileImageUrl ? (
              <img
                src={coach.profileImageUrl}
                alt="Profile"
                className="object-cover w-32 h-32 rounded-full border"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">?</span>
              </div>
            )}
          </div>
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
            Upload Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          {uploading && (
            <div className="mt-2 text-blue-600">Uploading: {uploadProgress.toFixed(0)}%</div>
          )}
          {uploadError && (
            <div className="mt-2 text-red-600">Error: {uploadError}</div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={coach.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={coach.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={coach.location?.address || ''}
            onChange={e => setCoach({ ...coach, location: { ...coach.location, address: e.target.value } })}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your city, state, or country"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((specialty) => (
              <label key={specialty} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={coach.specialties.includes(specialty)}
                  onChange={e => {
                    const newSpecialties = e.target.checked
                      ? [...coach.specialties, specialty]
                      : coach.specialties.filter(s => s !== specialty);
                    setCoach({ ...coach, specialties: newSpecialties });
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{specialty}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Credentials</label>
          <div className="flex flex-wrap gap-2">
            {CREDENTIALS.map((credential) => (
              <label key={credential} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={coach.credentials.includes(credential)}
                  onChange={e => {
                    const newCredentials = e.target.checked
                      ? [...coach.credentials, credential]
                      : coach.credentials.filter(c => c !== credential);
                    setCoach({ ...coach, credentials: newCredentials });
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{credential}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Divisions</label>
          <div className="flex flex-wrap gap-2">
            {DIVISIONS.map((division) => (
              <label key={division} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={coach.divisions.includes(division)}
                  onChange={e => {
                    const newDivisions = e.target.checked
                      ? [...coach.divisions, division]
                      : coach.divisions.filter(d => d !== division);
                    setCoach({ ...coach, divisions: newDivisions });
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{division}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Client Types</label>
          <div className="flex flex-wrap gap-2">
            {CLIENT_TYPES.map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={coach.clientTypes.includes(type)}
                  onChange={e => {
                    const newTypes = e.target.checked
                      ? [...coach.clientTypes, type]
                      : coach.clientTypes.filter(t => t !== type);
                    setCoach({ ...coach, clientTypes: newTypes });
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Federations</label>
          <div className="flex flex-wrap gap-2">
            {FEDERATIONS.map((federation) => (
              <label key={federation} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={coach.federations.includes(federation)}
                  onChange={e => {
                    const newFeds = e.target.checked
                      ? [...coach.federations, federation]
                      : coach.federations.filter(f => f !== federation);
                    setCoach({ ...coach, federations: newFeds });
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{federation}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            onClick={() => router.push(`/coaches/profile/${coach.id}`)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
} 