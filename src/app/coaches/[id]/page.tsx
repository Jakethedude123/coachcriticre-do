import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import CoachProfile from '@/components/coach/CoachProfile';
import { Coach } from '@/lib/firebase/models/coach';

function serializeCoach(coach: any): any {
  // Recursively convert Firestore Timestamps to ISO strings
  if (coach === null || coach === undefined) return coach;
  if (typeof coach !== 'object') return coach;
  if (coach.toDate) return coach.toDate().toISOString(); // Firestore Timestamp
  if (Array.isArray(coach)) return coach.map(serializeCoach);
  const obj: any = {};
  for (const key in coach) {
    obj[key] = serializeCoach(coach[key]);
  }
  return obj;
}

export default async function CoachProfilePage({ params }: { params: { id: string } }) {
  if (!adminDb) {
    throw new Error('Database not initialized');
  }

  const doc = await adminDb.collection('coaches').doc(params.id).get();
  if (!doc.exists) return notFound();
  const coach = serializeCoach(doc.data()) as Coach;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <CoachProfile coach={coach} />
      </div>
    </div>
  );
} 