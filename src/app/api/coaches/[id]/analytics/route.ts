import { NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase/firebaseAdmin';

function serialize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj.toDate) return obj.toDate().toISOString(); // Firestore Timestamp
  if (Array.isArray(obj)) return obj.map(serialize);
  const out: any = {};
  for (const key in obj) {
    out[key] = serialize(obj[key]);
  }
  return out;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d'; // Default to 7 days

    // Get the coach document
    const coachRef = db!.collection('coaches').doc(params.id);
    const coachDoc = await coachRef.get();

    if (!coachDoc.exists) {
      const resp = { error: 'Coach not found' };
      console.log('[analytics API] Response:', resp);
      return NextResponse.json(resp, { status: 404 });
    }

    const coach = coachDoc.data();
    if (!coach) {
      const resp = { error: 'Coach data not found' };
      console.log('[analytics API] Response:', resp);
      return NextResponse.json(resp, { status: 404 });
    }

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

    // Defensive: always return all fields, never undefined
    const analytics = coach.analytics || {};
    const profileViews = analytics.profileViews ?? 0;
    const messagesSent = analytics.messagesSent ?? 0;
    const inquiriesReceived = analytics.inquiriesReceived ?? 0;
    const clientsGained = analytics.clientsGained ?? 0;
    let history = Array.isArray(analytics.history)
      ? analytics.history.filter((entry: { date: { toDate: () => Date } }) => entry.date && entry.date.toDate && entry.date.toDate() >= startDate)
      : [];
    history = serialize(history);

    const resp = {
      profileViews,
      messagesSent,
      inquiriesReceived,
      clientsGained,
      history,
    };
    console.log('[analytics API] Response:', resp);
    return NextResponse.json(resp);
  } catch (error) {
    console.error('Error fetching coach analytics:', error);
    const resp = { error: 'Failed to fetch analytics' };
    console.log('[analytics API] Response:', resp);
    return NextResponse.json(resp, { status: 500 });
  }
} 