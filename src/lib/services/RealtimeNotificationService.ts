import { ref, onValue, off, set, get } from 'firebase/database';
import { database } from '@/lib/firebase/firebase';
import { NotificationService } from './NotificationService';

export class RealtimeNotificationService {
  private static instance: RealtimeNotificationService;
  private notificationService: NotificationService;
  private activeViewers: Map<string, Set<string>> = new Map();
  private viewerTimeouts: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.notificationService = new NotificationService();
  }

  public static getInstance(): RealtimeNotificationService {
    if (!RealtimeNotificationService.instance) {
      RealtimeNotificationService.instance = new RealtimeNotificationService();
    }
    return RealtimeNotificationService.instance;
  }

  public async trackProfileView(coachId: string, viewerId: string): Promise<void> {
    const viewerRef = ref(database, `profileViews/${coachId}/${viewerId}`);
    const timestamp = Date.now();

    // Set the viewer's last active timestamp
    await set(viewerRef, {
      timestamp,
      lastActive: timestamp,
    });

    // Set up a timeout to remove the viewer after 5 minutes of inactivity
    this.setupViewerTimeout(coachId, viewerId);

    // Check if this is a new viewer
    const viewers = this.activeViewers.get(coachId) || new Set();
    if (!viewers.has(viewerId)) {
      viewers.add(viewerId);
      this.activeViewers.set(coachId, viewers);

      // Send notification to the coach
      await this.notifyCoach(coachId, viewerId);
    }
  }

  private setupViewerTimeout(coachId: string, viewerId: string): void {
    const timeoutKey = `${coachId}-${viewerId}`;
    const existingTimeout = this.viewerTimeouts.get(timeoutKey);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(async () => {
      const viewers = this.activeViewers.get(coachId);
      if (viewers) {
        viewers.delete(viewerId);
        if (viewers.size === 0) {
          this.activeViewers.delete(coachId);
        }
      }
      this.viewerTimeouts.delete(timeoutKey);
    }, 5 * 60 * 1000); // 5 minutes

    this.viewerTimeouts.set(timeoutKey, timeout);
  }

  private async notifyCoach(coachId: string, viewerId: string): Promise<void> {
    try {
      // Get coach's notification preferences
      const coachRef = ref(database, `coaches/${coachId}`);
      const coachSnapshot = await get(coachRef);
      const coach = coachSnapshot.val();

      if (!coach?.notificationPreferences?.realTimeViews) {
        return;
      }

      // Get viewer's basic info (if available)
      const viewerRef = ref(database, `users/${viewerId}`);
      const viewerSnapshot = await get(viewerRef);
      const viewer = viewerSnapshot.val();

      const viewerName = viewer?.name || 'Someone';
      const message = `${viewerName} is viewing your profile`;

      // Send notification using the public method which handles both email and SMS
      await NotificationService.notifyProfileView(coach);
    } catch (error) {
      console.error('Error sending profile view notification:', error);
    }
  }

  public getActiveViewers(coachId: string): number {
    return this.activeViewers.get(coachId)?.size || 0;
  }

  public cleanup(): void {
    // Clear all timeouts
    this.viewerTimeouts.forEach(timeout => clearTimeout(timeout));
    this.viewerTimeouts.clear();
    this.activeViewers.clear();
  }
} 