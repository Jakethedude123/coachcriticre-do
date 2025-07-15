'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FaTimes, FaUpload, FaCrop, FaCheck } from 'react-icons/fa';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageBlob: Blob) => void;
  currentImageUrl?: string;
}

export default function ImageUploadModal({ isOpen, onClose, onSave, currentImageUrl }: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = {
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    };
    setCrop(crop);
  }, []);

  const getCroppedImg = useCallback(async (): Promise<Blob> => {
    if (!imgRef.current || !completedCrop) {
      throw new Error('No image or crop data');
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg();
      onSave(croppedBlob);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImageSrc('');
    setCrop({
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    });
    setCompletedCrop(undefined);
    setIsCropping(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Upload Profile Image</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          {!imageSrc ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <FaUpload size={48} className="mx-auto text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Upload a profile image</p>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Choose Image
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Crop your image</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Drag and resize the crop area to select the perfect portion of your image
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="max-w-full overflow-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imageSrc}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto"
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaCheck size={14} />
                  Save Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 