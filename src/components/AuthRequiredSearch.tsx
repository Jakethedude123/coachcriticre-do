import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthRequiredSearchProps {
  children: ReactNode;
}

export default function AuthRequiredSearch({ children }: AuthRequiredSearchProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Access Search Filters</h3>
        <p className="text-gray-600 mb-4">
          To use our advanced search features and find the perfect coach for your needs,
          please sign in or create an account.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 