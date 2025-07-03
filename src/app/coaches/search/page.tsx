import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CoachSearchFilters } from '@/lib/dynamic-imports';

const CoachSearchFiltersComponent = dynamic(() => import('@/components/CoachSearchFilters'), {
  loading: () => <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

export default function FindCoachesPage() {
  redirect('/coaches');
} 