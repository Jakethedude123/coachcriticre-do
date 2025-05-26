"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { CoachListing } from '@/lib/firebase/models/coach';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface ListingManagerProps {
  listings: CoachListing[];
  onSave: (listing: Partial<CoachListing>) => Promise<void>;
  onDelete: (listingId: string) => Promise<void>;
  onToggle: (listingId: string, active: boolean) => Promise<void>;
}

export default function ListingManager({ listings, onSave, onDelete, onToggle }: ListingManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingListing, setEditingListing] = useState<Partial<CoachListing> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editingListing) return;

    try {
      // Convert price to cents for Stripe
      const priceInCents = Math.round(Number(editingListing.price) * 100);
      await onSave({ ...editingListing, price: priceInCents });
      setIsEditing(false);
      setEditingListing(null);
    } catch (err) {
      setError('Failed to save listing. Please try again.');
    }
  };

  const handleNewListing = () => {
    setEditingListing({
      title: '',
      description: '',
      duration: '',
      price: 0,
      features: [''],
      active: true
    });
    setIsEditing(true);
  };

  const handleEditListing = (listing: CoachListing) => {
    // Convert price back to dollars for display
    setEditingListing({ ...listing, price: listing.price / 100 });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Coaching Packages</h2>
        <button
          onClick={handleNewListing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          <span>Add Package</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editingListing?.title || ''}
              onChange={(e) => setEditingListing({ ...editingListing!, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editingListing?.description || ''}
              onChange={(e) => setEditingListing({ ...editingListing!, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                value={editingListing?.duration || ''}
                onChange={(e) => setEditingListing({ ...editingListing!, duration: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 1 month"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={editingListing?.price || ''}
                onChange={(e) => setEditingListing({ ...editingListing!, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features</label>
            <div className="space-y-2">
              {editingListing?.features?.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(editingListing?.features || [])];
                      newFeatures[index] = e.target.value;
                      setEditingListing({ ...editingListing!, features: newFeatures });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Feature description"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = editingListing?.features?.filter((_, i) => i !== index);
                      setEditingListing({ ...editingListing!, features: newFeatures });
                    }}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newFeatures = [...(editingListing?.features || []), ''];
                  setEditingListing({ ...editingListing!, features: newFeatures });
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                + Add Feature
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingListing(null);
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Package
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{listing.title}</h3>
                  <p className="text-gray-600 mt-1">{listing.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEditListing(listing)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => onToggle(listing.id, !listing.active)}
                    className={`p-2 ${listing.active ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {listing.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="ml-2">{listing.duration}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="ml-2">${(listing.price / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-sm text-gray-500">Features:</span>
                <ul className="mt-2 space-y-1">
                  {listing.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 