import { adminDb } from '@/lib/firebase/firebaseAdmin';

interface RateLimitData {
  count: number;
  lastReset: number;
}

export class RateLimiter {
  private static readonly LIMITS = {
    profileViews: { max: 10, window: 60 * 60 }, // 10 per hour
    searchAppearances: { max: 20, window: 60 * 60 }, // 20 per hour
    profileClicks: { max: 10, window: 60 * 60 } // 10 per hour
  };

  private static async getRateLimitData(coachId: string, type: keyof typeof RateLimiter.LIMITS): Promise<RateLimitData> {
    if (!adminDb) {
      console.error('Database not initialized for rate limiting');
      return { count: 0, lastReset: Date.now() };
    }

    const docRef = adminDb.collection('rateLimits').doc(`${coachId}_${type}`);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return {
        count: 0,
        lastReset: Date.now()
      };
    }

    return docSnap.data() as RateLimitData;
  }

  private static async updateRateLimit(coachId: string, type: keyof typeof RateLimiter.LIMITS, data: RateLimitData) {
    if (!adminDb) {
      console.error('Database not initialized for rate limiting');
      return;
    }

    const docRef = adminDb.collection('rateLimits').doc(`${coachId}_${type}`);
    await docRef.set(data);
  }

  static async checkRateLimit(coachId: string, type: keyof typeof RateLimiter.LIMITS): Promise<boolean> {
    const limit = this.LIMITS[type];
    const data = await this.getRateLimitData(coachId, type);
    const now = Date.now();

    // Reset counter if window has passed
    if (now - data.lastReset > limit.window * 1000) {
      await this.updateRateLimit(coachId, type, {
        count: 1,
        lastReset: now
      });
      return true;
    }

    // Check if we're under the limit
    if (data.count < limit.max) {
      await this.updateRateLimit(coachId, type, {
        count: data.count + 1,
        lastReset: data.lastReset
      });
      return true;
    }

    return false;
  }
} 