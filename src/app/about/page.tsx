'use client';

import Link from 'next/link';
import { FaDumbbell, FaUsers, FaSearch } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-transparent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About CoachCritic
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connecting athletes with trusted, verified coaches in bodybuilding and powerlifting. 
            We're building the most reliable platform for finding your perfect coach.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1a1f2e] dark:to-[#232b36] rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              To revolutionize how athletes find and connect with qualified coaches by providing 
              transparency, verification, and real client feedback. We believe every athlete 
              deserves access to the best coaching available.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Choose CoachCritic?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#181d23] rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-blue-600 text-3xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built by athletes, for athletes. Our community helps maintain 
                quality standards and provides valuable insights.
              </p>
            </div>

            <div className="bg-white dark:bg-[#181d23] rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-blue-600 text-3xl mb-4">
                <FaDumbbell />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Specialized Expertise
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find coaches who specialize in your specific needs - from 
                bodybuilding to powerlifting, beginners to advanced athletes.
              </p>
            </div>

            <div className="bg-white dark:bg-[#181d23] rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-blue-600 text-3xl mb-4">
                <FaSearch />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Advanced Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Powerful filtering options to find coaches that match your goals, 
                experience level, and specific needs.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Search & Filter
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use our advanced search to find coaches based on specialties, 
                credentials, location, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Review & Compare
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Read detailed profiles, client reviews, and compare coaches 
                to find your perfect match.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Connect & Start
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reach out to coaches directly through our platform and 
                begin your transformation journey.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Coach?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Start your journey to find the perfect coach for your fitness goals.
            </p>
            <Link 
              href="/coaches/search"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Search
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 