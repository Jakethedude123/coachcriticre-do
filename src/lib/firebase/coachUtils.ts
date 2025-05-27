import { db, storage } from './firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, startAfter, QueryConstraint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import type { CoachProfile } from '../types/coach';
import { calculateCoachScore } from '../utils/coachScoring';

export interface CoachData {
  id: string;
  name: string;
  trainingStyle: string[];
  responseTime: string;
  rating: number;
  testimonialCount: number;
  credentials: string[];
  yearsExperience: string;
  specialties: string[];
  coachingModality: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  divisions: string[];
  clientTypes: string[];
  federations: string[];
  bio: string;
  profileImageUrl?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  notificationPreferences?: {
    email: {
      enabled: boolean;
      address: string;
      notifications: {
        profileViews: boolean;
        searchAppearances: boolean;
        profileClicks: boolean;
      };
    };
    sms: {
      enabled: boolean;
      phoneNumber?: string;
      notifications: {
        profileViews: boolean;
        searchAppearances: boolean;
        profileClicks: boolean;
      };
    };
  };
}

export interface SearchFilters {
  specialties?: string[];
  location?: string;
  trainingStyle?: string[];
  coachingModality?: string[];
  
  // Price filters
  maxMonthlyPrice?: number;
  maxYearlyPrice?: number;
  
  // Competition experience filters
  federations?: string[];
  divisions?: string[];
  hasCompetitionExperience?: boolean;

  // Technical expertise filters
  requiresFormCorrection?: boolean;
  requiresPosingCoaching?: boolean;
  requiresInjuryPrevention?: boolean;
  requiresInjuryRecovery?: boolean;
  requiresNutrition?: boolean;
  requiresLifestyleCoaching?: boolean;
  requiresPowerlifting?: boolean;
  requiresBodybuilding?: boolean;
  specialtyLifts?: string[];

  // Certification filters
  certifications?: string[];

  // Client type filters
  naturalOnly?: boolean;
  enhancedExperience?: boolean;
  experienceLevel?: 'beginners' | 'advanced' | 'competitors';
  weightClass?: string;

  // Contest prep filters
  requiresContestPrep?: boolean;
  minimumSuccessfulPreps?: number;
  requiresOffSeasonExperience?: boolean;

  // Sorting
  sortByScore?: boolean;
  
  // Free-form user input
  anythingElse?: string;
}

const COACHES_PER_PAGE = 10;

export async function createCoachProfile(userId: string, coachData: Omit<CoachData, 'id' | 'rating' | 'testimonialCount' | 'createdAt' | 'updatedAt' | 'userId'>, profileImage?: File): Promise<string> {
  try {
    console.log('Starting coach profile creation process...');
    
    let profileImageUrl = '';
    
    // Only attempt image upload if we have both the image and a valid storage bucket
    if (profileImage && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      console.log('Attempting to upload profile image...');
      try {
        // Create a unique filename using timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileExtension = profileImage.name.split('.').pop();
        const filename = `${userId}_${timestamp}_${randomString}.${fileExtension}`;
        
        // Create storage reference with a more specific path
        const imageRef = ref(storage, `coach-profiles/${userId}/${filename}`);
        
        // Basic metadata
        const metadata = {
          contentType: profileImage.type
        };

        // Simple upload without progress monitoring to reduce complexity
        await uploadBytes(imageRef, profileImage, metadata);
        profileImageUrl = await getDownloadURL(imageRef);
        console.log('Profile image uploaded successfully');
      } catch (uploadError) {
        console.error('Error uploading profile image:', uploadError);
        console.log('Continuing with profile creation without image...');
      }
    } else {
      console.log('No profile image provided or storage bucket not configured, skipping image upload');
    }

    // Create coach document
    console.log('Creating coach document...');
    const coachRef = doc(db, 'coaches', userId);
    const timestamp = new Date();
    
    const newCoachData: CoachData = {
      id: userId,
      ...coachData,
      profileImageUrl,
      userId,
      rating: 0,
      testimonialCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await setDoc(coachRef, newCoachData);
    console.log('Coach document created successfully');
    
    // Create or update user document
    console.log('Updating user document...');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log('Updating existing user...');
      await updateDoc(userRef, {
        isCoach: true,
        coachId: userId,
        updatedAt: timestamp
      });
    } else {
      console.log('Creating new user document...');
      await setDoc(userRef, {
        id: userId,
        isCoach: true,
        coachId: userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        email: '', // This will be updated when we implement user profile
        displayName: coachData.name,
        photoURL: profileImageUrl
      });
    }

    console.log('Coach profile creation completed successfully');
    return userId;
  } catch (error) {
    console.error('Detailed error in createCoachProfile:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create coach profile: ${error.message}`);
    }
    throw error;
  }
}

export async function getCoachProfile(coachId: string): Promise<CoachData | null> {
  try {
    const coachRef = doc(db, 'coaches', coachId);
    const coachSnap = await getDoc(coachRef);
    
    if (coachSnap.exists()) {
      return coachSnap.data() as CoachData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting coach profile:', error);
    throw error;
  }
}

export async function updateCoachProfile(coachId: string, updates: Partial<CoachData>, newProfileImage?: File): Promise<void> {
  try {
    // Upload new profile image if provided
    let profileImageUrl;
    if (newProfileImage) {
      const imageRef = ref(storage, `coach-profiles/${coachId}/${newProfileImage.name}`);
      await uploadBytes(imageRef, newProfileImage);
      profileImageUrl = await getDownloadURL(imageRef);
      updates.profileImageUrl = profileImageUrl;
    }

    // Update coach document
    const coachRef = doc(db, 'coaches', coachId);
    await updateDoc(coachRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating coach profile:', error);
    throw error;
  }
}

export async function searchCoaches(filters: SearchFilters, lastDoc?: any) {
  try {
    const coachesRef = collection(db, 'coaches');
    const constraints: QueryConstraint[] = [];

    // Basic filters
    if (filters.location) {
      constraints.push(where('location', '==', filters.location));
    }
    if (filters.specialties?.length) {
      constraints.push(where('specialties', 'array-contains-any', filters.specialties));
    }

    // Price filters
    if (filters.maxMonthlyPrice) {
      constraints.push(where('pricing.monthly', '<=', Number(filters.maxMonthlyPrice)));
    }
    if (filters.maxYearlyPrice) {
      constraints.push(where('pricing.yearly', '<=', Number(filters.maxYearlyPrice)));
    }

    // Competition experience filters
    if (filters.federations?.length) {
      constraints.push(where('competitionHistory.federations', 'array-contains-any', filters.federations));
    }

    // Technical expertise filters
    if (filters.requiresFormCorrection) {
      constraints.push(where('technicalExpertise.formCorrection', '==', true));
    }
    if (filters.requiresPosingCoaching) {
      constraints.push(where('technicalExpertise.posingCoaching', '==', true));
    }
    if (filters.requiresInjuryPrevention) {
      constraints.push(where('technicalExpertise.injuryPrevention', '==', true));
    }
    if (filters.requiresInjuryRecovery) {
      constraints.push(where('technicalExpertise.injuryRecovery', '==', true));
    }
    if (filters.requiresNutrition) {
      constraints.push(where('technicalExpertise.nutrition', '==', true));
    }
    if (filters.requiresLifestyleCoaching) {
      constraints.push(where('technicalExpertise.lifestyleCoaching', '==', true));
    }
    if (filters.requiresPowerlifting) {
      constraints.push(where('technicalExpertise.powerlifting', '==', true));
    }
    if (filters.requiresBodybuilding) {
      constraints.push(where('technicalExpertise.bodybuilding', '==', true));
    }
    if (filters.specialtyLifts?.length) {
      constraints.push(where('technicalExpertise.specialtyLifts', 'array-contains-any', filters.specialtyLifts));
    }

    // Certification filters
    if (filters.certifications?.length) {
      constraints.push(where('certifications', 'array-contains-any', filters.certifications));
    }

    // Client type filters
    if (filters.naturalOnly) {
      constraints.push(where('clientTypes.natural', '==', true));
    }
    if (filters.enhancedExperience) {
      constraints.push(where('clientTypes.enhanced', '==', true));
    }
    if (filters.weightClass) {
      constraints.push(where('clientTypes.weightClasses', 'array-contains', filters.weightClass));
    }

    // Contest prep filters
    if (filters.requiresContestPrep) {
      constraints.push(where('contestPrep.experienceLevel', '!=', null));
    }
    if (filters.minimumSuccessfulPreps) {
      constraints.push(where('contestPrep.successfulPreps', '>=', filters.minimumSuccessfulPreps));
    }

    // Add ordering and pagination
    constraints.push(orderBy('rating', 'desc'));
    constraints.push(limit(COACHES_PER_PAGE));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(coachesRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const coaches: CoachProfile[] = [];
    querySnapshot.forEach((doc) => {
      coaches.push({ id: doc.id, ...doc.data() } as CoachProfile);
    });

    // Process and score coaches
    const scoredCoaches = await Promise.all(coaches.map(async coach => {
      const scoreComponents = calculateCoachScore(coach);
      return {
        ...coach,
        score: scoreComponents.finalScore,
        scoreDetails: {
          satisfaction: scoreComponents.satisfactionScore,
          consistency: scoreComponents.consistencyScore,
          experience: scoreComponents.experienceScore,
          successRatio: scoreComponents.successRatio,
          retention: scoreComponents.clientRetentionScore
        }
      };
    }));

    // Sort by score if requested
    if (filters.sortByScore) {
      scoredCoaches.sort((a, b) => b.score - a.score);
    }

    return {
      coaches: scoredCoaches,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === COACHES_PER_PAGE
    };
  } catch (error) {
    console.error('Error searching coaches:', error);
    throw error;
  }
} 