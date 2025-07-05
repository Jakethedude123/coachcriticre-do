'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut, isCoach, coachId } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'messages'),
      where('to', '==', user.uid),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasNewMessages(!snapshot.empty);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/hilogo.png"
                alt="CoachCritic Logo"
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
                quality={80}
              />
              <span className="ml-2 text-xl font-bold text-gray-900">CoachCritic</span>
            </Link>
            <div className="hidden md:flex md:ml-10 space-x-8">
              <Link
                href={user ? "/coaches/search" : "/login"}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Find Coaches
              </Link>
              <Link
                href="/coaches/spotlight"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Coach Spotlight
              </Link>
              <Link
                href="/recent-activity"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Recent Activity
              </Link>
              <Link
                href="/upgrade"
                className="text-gray-700 hover:text-yellow-600 px-3 py-2 rounded-md font-semibold"
              >
                Upgrade
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && !isCoach && (
              <Link
                href={user ? "/coaches/create" : "/login"}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md border border-gray-300 hover:border-red-600"
                onClick={() => setIsDropdownOpen(false)}
              >
                Register as Coach
              </Link>
            )}
            {loading ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="relative group flex items-center space-x-2">
                <button
                  type="button"
                  ref={buttonRef}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  onClick={handleDropdownToggle}
                >
                  <FaUser />
                  <span>Profile</span>
                </button>
                <Link href="/messages" className="relative text-gray-600 hover:text-blue-600 transition-colors flex items-center ml-2">
                  <FaEnvelope className="h-5 w-5" />
                  {hasNewMessages && (
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                  )}
                </Link>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 min-w-[8rem] w-40 mt-2 py-1 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                    style={{ top: '100%' }}
                  >
                    <Link
                      href={isCoach && coachId ? `/coaches/profile/${coachId}` : "/profile"}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={async () => {
                        setIsDropdownOpen(false);
                        await signOut();
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 