'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/firebase");
      await addDoc(collection(db, "launchNotifications"), {
        email,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Thatsmyjacket") {
      setGateOpen(true);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (gateOpen) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" style={{backdropFilter: 'blur(2px)'}}>
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center relative">
        <div className="mb-6 flex justify-center">
          <img
            src="/images/optimized/hilogo.png"
            alt="CoachCritic Logo"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">CoachCritic</h1>
        <p className="mb-6 text-gray-600">Enter your email to be notified once CoachCritic launches.</p>
        {success ? (
          <div className="text-green-600 font-semibold">Thank you! We&apos;ll notify you soon.</div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="button-primary w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Notify Me'}
            </button>
          </form>
        )}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">Admin Access</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="button-primary w-full bg-gray-600 hover:bg-gray-700"
            >
              Enter Site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 