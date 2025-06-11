import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import CoachProfile from '@/components/coach/CoachProfile';
import { Coach } from '@/lib/firebase/models/coach';

export default async function CoachProfilePage({ params }: { params: { id: string } }) {
  const doc = await adminDb.collection('coaches').doc(params.id).get();
  if (!doc.exists) return notFound();
  const coach = doc.data() as Coach;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <CoachProfile coach={coach} />
    </div>
  );
} 