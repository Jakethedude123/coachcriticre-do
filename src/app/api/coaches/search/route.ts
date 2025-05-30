import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function POST(req: NextRequest) {
  try {
    const coachesRef = collection(db, 'coaches');
    const snapshot = await getDocs(coachesRef);
    const coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ coaches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const coachesRef = collection(db, 'coaches');
    const snapshot = await getDocs(coachesRef);
    const coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ coaches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
} 