import { notFound } from 'next/navigation';

export default async function CoachProfilePage({ params }: { params: { id: string } }) {
  // TODO: Fetch coach data here using params.id
  // Example:
  // const coach = await getCoachById(params.id);

  // if (!coach) return notFound();

  return (
    <div>
      <h1>Coach Profile: {params.id}</h1>
      {/* Render coach details here */}
    </div>
  );
} 