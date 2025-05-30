'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaUser } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  if (pathname === '/') return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo_transparent.png" alt="Logo" width={48} height={48} />
              <span className="ml-2 text-xl font-bold text-gray-900">CoachCritic</span>
            </Link>
            <div className="hidden md:flex md:ml-10 space-x-8">
              <Link
                href="/coaches"
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
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <Link
                href={user ? "/coaches/create" : "/login"}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md border border-gray-300 hover:border-red-600"
              >
                Register as Coach
              </Link>
            )}
            {loading ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="relative group">
                <button
                  type="button"
                  ref={buttonRef}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  onClick={handleDropdownToggle}
                >
                  <FaUser />
                  <span>Profile</span>
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl z-50"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
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