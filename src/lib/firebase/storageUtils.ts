import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from './firebase';

export class StorageService {
  /**
   * Upload a profile image for a coach
   */
  static async uploadProfileImage(userId: string, imageBlob: Blob): Promise<string> {
    try {
      // Ensure user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to upload images');
      }

      // Verify the user is uploading to their own folder
      if (user.uid !== userId) {
        throw new Error('You can only upload images to your own profile');
      }

      // Create a unique filename
      const filename = `profile-image-${Date.now()}.jpg`;
      const storageRef = ref(storage, `coach-profiles/${userId}/${filename}`);
      
      // Upload the image with proper metadata
      const snapshot = await uploadBytes(storageRef, imageBlob, {
        contentType: 'image/jpeg',
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalSize: imageBlob.size.toString(),
        }
      });
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      
      // Provide more specific error messages
      if (error.code === 'storage/unauthorized') {
        throw new Error('You do not have permission to upload images. Please check your authentication.');
      } else if (error.code === 'storage/quota-exceeded') {
        throw new Error('Storage quota exceeded. Please try a smaller image.');
      } else if (error.code === 'storage/unauthenticated') {
        throw new Error('Please log in to upload images.');
      } else {
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Delete a profile image
   */
  static async deleteProfileImage(userId: string, imageUrl: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to delete images');
      }

      // Extract the path from the URL
      const url = new URL(imageUrl);
      const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '');
      
      if (!path) {
        throw new Error('Invalid image URL');
      }

      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  }

  /**
   * Get a signed URL for uploading (if needed)
   */
  static async getUploadURL(userId: string, filename: string): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const storageRef = ref(storage, `coach-profiles/${userId}/${filename}`);
      // For now, return the reference path - you can implement signed URLs if needed
      return `coach-profiles/${userId}/${filename}`;
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw error;
    }
  }
} 