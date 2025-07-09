'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaUser, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';
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
  const [theme, setTheme] = useState('light');

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

  // On mount, set theme from localStorage or default to light
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="bg-white dark:bg-[#0A0D12] shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/images/optimized/hilogo.png"
                alt="CoachCritic Logo"
                width={200}
                height={60}
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-coach.png'; }}
              />
            </Link>
            <div className="hidden md:flex md:ml-10 space-x-4">
              <Link
                href={user ? "/coaches/search" : "/login"}
                className="navbar-glass-tab"
              >
                Find Coaches
              </Link>
              <Link
                href="/recent-activity"
                className="navbar-glass-tab"
              >
                Recent Activity
              </Link>
              <Link
                href="/upgrade"
                className="navbar-glass-tab font-semibold"
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
                  className="navbar-glass-tab flex items-center gap-1 px-4 py-2 text-base"
                  onClick={handleDropdownToggle}
                >
                  <FaUser className="w-4 h-4" />
                  <span className="font-medium ml-1">Profile</span>
                </button>
                <Link href="/messages" className="navbar-glass-tab relative flex items-center justify-center ml-1 px-2 py-1 text-base">
                  <FaEnvelope className="h-4 w-4" />
                  {hasNewMessages && (
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                  )}
                </Link>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 min-w-[8rem] w-44 mt-2 py-1 navbar-glass-dropdown z-50"
                    style={{ top: '100%' }}
                  >
                    <Link
                      href={isCoach && coachId ? `/coaches/profile/${coachId}` : "/profile"}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all rounded-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUser className="w-4 h-4" />
                      <span>View Profile</span>
                    </Link>
                    <button
                      onClick={async () => {
                        setIsDropdownOpen(false);
                        await signOut();
                        router.push('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all rounded-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="button-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 flex items-center gap-2 rounded-full border-2 border-blue-400 dark:border-yellow-300 bg-white dark:bg-gray-800 text-yellow-500 dark:text-blue-300 shadow-lg hover:scale-110 transition z-50"
              aria-label="Toggle dark mode"
              type="button"
              style={{ minWidth: 40 }}
            >
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 