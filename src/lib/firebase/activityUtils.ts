import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ActivityData {
  type: 'new_coach' | 'new_review' | 'profile_update';
  userId: string;
  userName: string;
  coachId?: string;
  coachName?: string;
  rating?: number;
  reviewText?: string;
}

export async function recordActivity(data: ActivityData) {
  try {
    const activityRef = collection(db, 'activities');
    await addDoc(activityRef, {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error recording activity:', error);
  }
} 