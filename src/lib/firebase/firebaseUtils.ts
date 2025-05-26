import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryConstraint,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Coach, CoachFormData } from './models/coach';
import { nanoid } from 'nanoid';

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

const COACHES_COLLECTION = 'coaches';
const COACHES_PER_PAGE = 12;

// Coach CRUD Operations
export async function createCoach(coachData: CoachFormData) {
  try {
    const docRef = await addDoc(collection(db, COACHES_COLLECTION), {
      ...coachData,
      rating: 0,
      reviewCount: 0,
      testimonials: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating coach:', error);
    throw error;
  }
}

export async function updateCoach(coachId: string, coachData: Partial<CoachFormData>) {
  try {
    const docRef = doc(db, COACHES_COLLECTION, coachId);
    await updateDoc(docRef, {
      ...coachData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    throw error;
  }
}

export async function deleteCoach(coachId: string) {
  try {
    await deleteDoc(doc(db, COACHES_COLLECTION, coachId));
  } catch (error) {
    console.error('Error deleting coach:', error);
    throw error;
  }
}

export async function getCoach(coachId: string): Promise<Coach | null> {
  try {
    const docRef = doc(db, COACHES_COLLECTION, coachId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId: data.userId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        specialties: data.specialties || [],
        experience: data.experience || '',
        credentials: data.credentials || [],
        certifications: data.certifications || [],
        availability: data.availability || {
          timezone: 'UTC',
          schedule: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        },
        pricing: data.pricing || {
          rate: 0,
          currency: 'USD',
          interval: 'hour'
        },
        analytics: data.analytics || {
          profileViews: 0,
          messagesSent: 0,
          inquiriesReceived: 0,
          clientsGained: 0,
          searchAppearances: 0,
          profileClicks: 0,
          history: []
        },
        social: data.social || {
          instagram: '',
          twitter: '',
          facebook: '',
          linkedin: '',
          youtube: '',
          website: ''
        },
        status: data.status || 'pending',
        featured: data.featured || false,
        verified: data.verified || false,
        avatar: data.avatar || '',
        coverImage: data.coverImage || '',
        location: data.location || {
          city: '',
          state: '',
          country: ''
        },
        trainingStyle: data.trainingStyle || [],
        responseTime: data.responseTime || '',
        stripeAccountId: data.stripeAccountId || '',
        stripeSubscriptionId: data.stripeSubscriptionId || '',
        subscription: data.subscription || {
          plan: 'free',
          status: 'active',
          stripeCustomerId: '',
          stripeSubscriptionId: ''
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting coach:', error);
    throw error;
  }
}

// Coach Search and Filtering
export async function searchCoaches(filters: {
  trainingStyle?: string[];
  responseTime?: string;
  minRating?: number;
  minTestimonials?: number;
  credentials?: string[];
  yearsExperience?: string;
  specialties?: string[];
  coachingModality?: string;
  maxMonthlyPrice?: number;
  maxHourlyPrice?: number;
  divisions?: string[];
  clientTypes?: string[];
  federations?: string[];
  searchQuery?: string;
  lastDoc?: any;
}) {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters.minRating) {
      constraints.push(where('rating', '>=', filters.minRating));
    }

    if (filters.minTestimonials) {
      constraints.push(where('reviewCount', '>=', filters.minTestimonials));
    }

    if (filters.maxMonthlyPrice) {
      constraints.push(where('pricing.monthly', '<=', filters.maxMonthlyPrice));
    }

    if (filters.maxHourlyPrice) {
      constraints.push(where('pricing.hourly', '<=', filters.maxHourlyPrice));
    }

    // Add array-contains-any queries for multi-select filters
    if (filters.trainingStyle?.length) {
      constraints.push(where('trainingStyle', 'array-contains-any', filters.trainingStyle));
    }

    if (filters.credentials?.length) {
      constraints.push(where('credentials', 'array-contains-any', filters.credentials));
    }

    if (filters.specialties?.length) {
      constraints.push(where('specialties', 'array-contains-any', filters.specialties));
    }

    if (filters.divisions?.length) {
      constraints.push(where('divisions', 'array-contains-any', filters.divisions));
    }

    if (filters.clientTypes?.length) {
      constraints.push(where('clientTypes', 'array-contains-any', filters.clientTypes));
    }

    if (filters.federations?.length) {
      constraints.push(where('federations', 'array-contains-any', filters.federations));
    }

    // Add exact match queries
    if (filters.responseTime) {
      constraints.push(where('responseTime', '==', filters.responseTime));
    }

    if (filters.yearsExperience) {
      constraints.push(where('experience', '==', filters.yearsExperience));
    }

    if (filters.coachingModality) {
      constraints.push(where('coachingModality', '==', filters.coachingModality));
    }

    // Add ordering and pagination
    constraints.push(orderBy('rating', 'desc'));
    constraints.push(limit(COACHES_PER_PAGE));

    if (filters.lastDoc) {
      constraints.push(startAfter(filters.lastDoc));
    }

    const q = query(collection(db, COACHES_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);

    const coaches: Coach[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      coaches.push({
        userId: data.userId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        specialties: data.specialties || [],
        experience: data.experience || '',
        credentials: data.credentials || [],
        certifications: data.certifications || [],
        availability: data.availability || {
          timezone: 'UTC',
          schedule: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }
        },
        pricing: data.pricing || {
          rate: 0,
          currency: 'USD',
          interval: 'hour'
        },
        analytics: data.analytics || {
          profileViews: 0,
          messagesSent: 0,
          inquiriesReceived: 0,
          clientsGained: 0,
          searchAppearances: 0,
          profileClicks: 0,
          history: []
        },
        social: data.social || {
          instagram: '',
          twitter: '',
          facebook: '',
          linkedin: '',
          youtube: '',
          website: ''
        },
        status: data.status || 'pending',
        featured: data.featured || false,
        verified: data.verified || false,
        avatar: data.avatar || '',
        coverImage: data.coverImage || '',
        location: data.location || {
          city: '',
          state: '',
          country: ''
        },
        trainingStyle: data.trainingStyle || [],
        responseTime: data.responseTime || '',
        stripeAccountId: data.stripeAccountId || '',
        stripeSubscriptionId: data.stripeSubscriptionId || '',
        subscription: data.subscription || {
          plan: 'free',
          status: 'active',
          stripeCustomerId: '',
          stripeSubscriptionId: ''
        }
      });
    });

    // If there's a search query, filter results client-side
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return coaches.filter(coach =>
        coach.name.toLowerCase().includes(query) ||
        coach.bio.toLowerCase().includes(query) ||
        coach.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
        coach.trainingStyle.some(style => style.toLowerCase().includes(query)) ||
        coach.location.city.toLowerCase().includes(query) ||
        coach.location.state.toLowerCase().includes(query) ||
        coach.location.country.toLowerCase().includes(query)
      );
    }

    return coaches;
  } catch (error) {
    console.error('Error searching coaches:', error);
    throw error;
  }
}

// Image Upload
export async function uploadCoachImage(coachId: string, file: File): Promise<string> {
  try {
    const imageRef = ref(storage, `coaches/${coachId}/profile-image`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    
    // Update coach document with new image URL
    await updateDoc(doc(db, COACHES_COLLECTION, coachId), {
      imageUrl,
      updatedAt: serverTimestamp()
    });

    return imageUrl;
  } catch (error) {
    console.error('Error uploading coach image:', error);
    throw error;
  }
}

interface TestimonialInput {
  authorId: string;
  authorName: string;
  rating: number;
  text: string;
  verificationBadge?: {
    type: 'paid' | 'verified' | 'longTerm';
    text: string;
  };
  achievements?: string[];
  progress?: string;
}

interface CoachData extends DocumentData {
  testimonials: Array<{
    id: string;
    authorId: string;
    authorName: string;
    rating: number;
    text: string;
    date: Timestamp;
    verificationBadge?: {
      type: string;
      text: string;
    };
    achievements?: string[];
    progress?: string;
  }>;
  rating: number;
  reviewCount: number;
}

export async function addTestimonial(coachId: string, testimonial: TestimonialInput) {
  try {
    const coachRef = doc(db, 'coaches', coachId);
    const coachDoc = await getDoc(coachRef);
    
    if (!coachDoc.exists()) {
      throw new Error('Coach not found');
    }

    const coach = coachDoc.data() as CoachData;
    const currentTestimonials = coach.testimonials || [];
    const currentRating = coach.rating || 0;
    const currentTotalRatings = coach.reviewCount || 0;

    const newTestimonial = {
      id: nanoid(),
      authorId: testimonial.authorId,
      authorName: testimonial.authorName,
      rating: testimonial.rating,
      text: testimonial.text,
      date: serverTimestamp(),
      verificationBadge: testimonial.verificationBadge,
      achievements: testimonial.achievements,
      progress: testimonial.progress,
    };

    // Calculate new rating
    const newTotalRatings = currentTotalRatings + 1;
    const newRating = ((currentRating * currentTotalRatings) + testimonial.rating) / newTotalRatings;

    await updateDoc(coachRef, {
      testimonials: [...currentTestimonials, newTestimonial],
      rating: newRating,
      reviewCount: newTotalRatings,
      updatedAt: serverTimestamp()
    });

    return newTestimonial;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(coachId: string, testimonialId: string) {
  try {
    const coachRef = doc(db, 'coaches', coachId);
    const coachDoc = await getDoc(coachRef);
    
    if (!coachDoc.exists()) {
      throw new Error('Coach not found');
    }

    const coach = coachDoc.data() as CoachData;
    const testimonialIndex = coach.testimonials.findIndex(t => t.id === testimonialId);

    if (testimonialIndex === -1) {
      throw new Error('Testimonial not found');
    }

    const testimonial = coach.testimonials[testimonialIndex];
    const currentRating = coach.rating;
    const currentTotalRatings = coach.reviewCount;

    // Calculate new rating
    const newTotalRatings = currentTotalRatings - 1;
    const newRating = newTotalRatings === 0 ? 0 : 
      ((currentRating * currentTotalRatings) - testimonial.rating) / newTotalRatings;

    const newTestimonials = [...coach.testimonials];
    newTestimonials.splice(testimonialIndex, 1);

    await updateDoc(coachRef, {
      testimonials: newTestimonials,
      rating: newRating,
      reviewCount: newTotalRatings,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

export async function getCoachByStripeAccount(stripeAccountId: string) {
  try {
    const coachesRef = collection(db, 'coaches');
    const q = query(coachesRef, where('stripeAccountId', '==', stripeAccountId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const coachDoc = querySnapshot.docs[0];
    const data = coachDoc.data();
    return {
      userId: data.userId || '',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      bio: data.bio || '',
      specialties: data.specialties || [],
      experience: data.experience || '',
      credentials: data.credentials || [],
      certifications: data.certifications || [],
      availability: data.availability || {
        timezone: 'UTC',
        schedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        }
      },
      pricing: data.pricing || {
        rate: 0,
        currency: 'USD',
        interval: 'hour'
      },
      analytics: data.analytics || {
        profileViews: 0,
        messagesSent: 0,
        inquiriesReceived: 0,
        clientsGained: 0,
        searchAppearances: 0,
        profileClicks: 0,
        history: []
      },
      social: data.social || {
        instagram: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        website: ''
      },
      status: data.status || 'pending',
      featured: data.featured || false,
      verified: data.verified || false,
      avatar: data.avatar || '',
      coverImage: data.coverImage || '',
      location: data.location || {
        city: '',
        state: '',
        country: ''
      },
      trainingStyle: data.trainingStyle || [],
      responseTime: data.responseTime || '',
      stripeAccountId: data.stripeAccountId || '',
      stripeSubscriptionId: data.stripeSubscriptionId || '',
      subscription: data.subscription || {
        plan: 'free',
        status: 'active',
        stripeCustomerId: '',
        stripeSubscriptionId: ''
      }
    };
  } catch (error) {
    console.error('Error getting coach by Stripe account:', error);
    return null;
  }
}
