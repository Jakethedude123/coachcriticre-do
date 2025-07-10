"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaSearch, FaUser, FaSignOutAlt, FaUserCircle, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const hasNewMessages = true; // TODO: Replace with real logic
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle clicks outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Force auth state refresh if inconsistent
  useEffect(() => {
    if (!user && document.cookie.includes('session=')) {
      window.location.reload();
    }
  }, [user]);

  const handleSearch = () => {
    if (!user && searchQuery.trim()) {
      localStorage.setItem('pendingSearch', searchQuery.trim());
      router.push('/login?message=' + encodeURIComponent('Please log in or sign up to search for coaches'));
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/coaches/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear any session cookies
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      
      // Sign out from Firebase
      await signOut();
      
      // Clear any local storage
      localStorage.clear();
      
      // Close dropdown
      setIsDropdownOpen(false);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // If error, force reload anyway
      window.location.href = '/';
    }
  };

  // If loading, show nothing to prevent flash of wrong state
  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-blue-100 hover:border-blue-300 transition-colors text-gray-700 hover:text-blue-600 bg-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>

          {/* Navigation Links (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/coaches" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Find Coaches
            </Link>
            <Link 
              href="/recent-activity" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Recent Activity
            </Link>
          </div>

          {/* Search Bar and Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar (desktop only) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search coaches..."
                className="w-64 px-4 py-2 pr-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <FaSearch />
              </button>
            </div>

            {/* Profile and Messages Icons (always visible) */}
            {user && (
              <div className="flex items-center space-x-2">
                <Link href="/profile" className="flex items-center justify-center h-10 w-10 rounded-full border border-blue-100 hover:border-blue-300 transition-colors text-gray-700 hover:text-blue-600 bg-white">
                  <FaUser className="h-5 w-5" />
                </Link>
                <Link href="/messages" className="relative flex items-center justify-center h-10 w-10 rounded-full border border-blue-100 hover:border-blue-300 transition-colors text-gray-700 hover:text-blue-600 bg-white">
                  <FaEnvelope className="h-5 w-5" />
                  {hasNewMessages && (
                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 flex flex-col space-y-4 z-50">
            <Link href="/coaches" className="text-gray-700 hover:text-blue-600 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Find Coaches
            </Link>
            <Link href="/recent-activity" className="text-gray-700 hover:text-blue-600 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Recent Activity
            </Link>
            {user ? (
              <>
                <Link href="/coaches/register" className="text-blue-600 hover:text-blue-700 text-lg" onClick={() => setMobileMenuOpen(false)}>
                  Register as Coach
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-blue-600 text-lg text-left w-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login?as=coach" className="text-blue-600 hover:text-blue-700 text-lg" onClick={() => setMobileMenuOpen(false)}>
                  Register as Coach
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 text-lg" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 