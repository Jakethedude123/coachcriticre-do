'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, user, resetPassword } = useAuth();

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/profile');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    }
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email or username');
      return;
    }
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      router.push('/profile');
    } catch (err: any) {
      setError(err?.message || 'Invalid email/username or password');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError('Error sending reset email. Please check your email address.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to CoachCritic
          </h2>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-100"
          >
            <Image
              src="/images/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="h-5 w-5"
              priority
            />
            Continue with Google
          </button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {step === 'email' && (
          <form className="space-y-6" onSubmit={handleEmailContinue}>
            <div>
              <input
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="button-primary w-full mt-4"
            >
              Continue
            </button>
          </form>
        )}
        {step === 'password' && (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="button-primary w-full mt-4"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isResetting}
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              {isResetting ? 'Sending reset email...' : 'Forgot your password?'}
            </button>
            {resetSent && (
              <div className="text-green-500 text-sm text-center">
                Password reset email sent! Please check your inbox.
              </div>
            )}
          </form>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 