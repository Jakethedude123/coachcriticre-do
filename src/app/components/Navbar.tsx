'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Metallic sphere background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-600 shadow-lg" 
                     style={{
                       background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 40%, #b0b0b0 60%, #808080 100%)',
                     }}
                />
                {/* Inner shadow for 3D effect */}
                <div className="absolute inset-0 rounded-full opacity-50"
                     style={{
                       background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)',
                     }}
                />
                {/* Text container */}
                <div className="relative z-10 flex items-center justify-center transform -rotate-12">
                  {/* CC text with 3D effect */}
                  <div className="text-2xl font-black tracking-tighter"
                       style={{
                         background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                       }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>C</span>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>C</span>
                  </div>
                </div>
                {/* Outer ring with gradient */}
                <div className="absolute inset-0 rounded-full border-2"
                     style={{
                       borderImage: 'linear-gradient(135deg, #2563eb 0%, #dc2626 100%) 1',
                     }}></div>
              </div>
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
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <FaUser />
                  <span>Profile</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl hidden group-hover:block z-50">
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