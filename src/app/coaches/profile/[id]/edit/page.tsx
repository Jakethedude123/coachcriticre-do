"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCoachProfile, updateCoachProfile } from "@/lib/firebase/coachUtils";
import type { CoachData } from "@/lib/firebase/coachUtils";

export default function EditCoachProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!coach) return <div className="p-8 text-center">Coach not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Coach Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
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
          <label className="block font-medium mb-1">Specialties (comma separated)</label>
          <input
            type="text"
            value={coach.specialties.join(", ")}
            onChange={(e) => handleArrayChange("specialties", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Credentials (comma separated)</label>
          <input
            type="text"
            value={coach.credentials.join(", ")}
            onChange={(e) => handleArrayChange("credentials", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Divisions (comma separated)</label>
          <input
            type="text"
            value={coach.divisions.join(", ")}
            onChange={(e) => handleArrayChange("divisions", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Client Types (comma separated)</label>
          <input
            type="text"
            value={coach.clientTypes.join(", ")}
            onChange={(e) => handleArrayChange("clientTypes", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Federations (comma separated)</label>
          <input
            type="text"
            value={coach.federations.join(", ")}
            onChange={(e) => handleArrayChange("federations", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
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