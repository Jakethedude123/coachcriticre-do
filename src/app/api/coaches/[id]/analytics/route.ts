import { NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase/firebaseAdmin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d'; // Default to 7 days

    // Get the coach document
    const coachRef = db.collection('coaches').doc(params.id);
    const coachDoc = await coachRef.get();

    if (!coachDoc.exists) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const coach = coachDoc.data();

    // Calculate start date based on time range
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Return basic analytics if no history is available
    if (!coach.analytics?.history) {
      return NextResponse.json({
        profileViews: coach.analytics?.profileViews || 0,
        messagesSent: coach.analytics?.messagesSent || 0,
        inquiriesReceived: coach.analytics?.inquiriesReceived || 0,
        clientsGained: coach.analytics?.clientsGained || 0,
        history: [],
      });
    }

    // Filter analytics history based on time range
    const relevantHistory = coach.analytics.history.filter(
      (entry: { date: { toDate: () => Date } }) => entry.date.toDate() >= startDate
    );

    return NextResponse.json({
      profileViews: coach.analytics.profileViews,
      messagesSent: coach.analytics.messagesSent,
      inquiriesReceived: coach.analytics.inquiriesReceived,
      clientsGained: coach.analytics.clientsGained,
      history: relevantHistory,
    });
  } catch (error) {
    console.error('Error fetching coach analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 