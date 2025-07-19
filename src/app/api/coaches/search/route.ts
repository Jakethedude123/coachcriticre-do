import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const coachesRef = db!.collection('coaches');
    const snapshot = await coachesRef.get();
    const coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ coaches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const coachesRef = db!.collection('coaches');
    const snapshot = await coachesRef.get();
    const coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ coaches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
} 