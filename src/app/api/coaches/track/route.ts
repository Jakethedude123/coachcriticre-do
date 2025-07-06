import { NextRequest, NextResponse } from 'next/server';
import { getCoach } from '@/lib/firebase/firebaseUtils';
import { NotificationService } from '@/lib/services/NotificationService';
import { RateLimiter } from '@/lib/services/RateLimiter';

export async function POST(req: NextRequest) {
  try {
    const { coachId, eventType } = await req.json();

    if (!coachId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get coach data
    const coach = await getCoach(coachId);
    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    // Check rate limit before proceeding
    const isWithinLimit = await RateLimiter.checkRateLimit(coachId, eventType);
    if (!isWithinLimit) {
      // Still update analytics but skip notifications
      await NotificationService.updateAnalytics(coachId, eventType);
      return NextResponse.json({ success: true, rateLimit: true });
    }

    // Update analytics and send notifications based on event type
    switch (eventType) {
      case 'profileView':
        await NotificationService.notifyProfileView(coach);
        await NotificationService.updateAnalytics(coachId, 'profileViews');
        break;
      case 'searchAppearance':
        await NotificationService.notifySearchAppearance(coach);
        await NotificationService.updateAnalytics(coachId, 'searchAppearances');
        break;
      case 'profileClick':
        await NotificationService.notifyProfileClick(coach);
        await NotificationService.updateAnalytics(coachId, 'profileClicks');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 