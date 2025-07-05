import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'coaches'));
    const coaches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ coaches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coaches.' }, { status: 500 });
  }
} 