'use client';

import React, { useState } from 'react';
import { FaBug, FaTimes, FaPaperPlane } from 'react-icons/fa';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bugReport: BugReport) => void;
}

interface BugReport {
  title: string;
  description: string;
  steps: string;
  expectedBehavior: string;
  actualBehavior: string;
  browser: string;
  url: string;
  userAgent: string;
}

export default function BugReportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bugReport, setBugReport] = useState<BugReport>({
    title: '',
    description: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    browser: '',
    url: '',
    userAgent: navigator.userAgent,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current browser info
      const browserInfo = {
        ...bugReport,
        browser: getBrowserInfo(),
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Send bug report to your backend or external service
      const response = await fetch('/api/bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(browserInfo),
      });

      if (response.ok) {
        alert('Bug report submitted successfully! Thank you for your feedback.');
        setIsModalOpen(false);
        setBugReport({
          title: '',
          description: '',
          steps: '',
          expectedBehavior: '',
          actualBehavior: '',
          browser: '',
          url: '',
          userAgent: navigator.userAgent,
        });
      } else {
        throw new Error('Failed to submit bug report');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      alert('Failed to submit bug report. Please try again or contact support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  return (
    <>
      {/* Sticky Bug Report Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50 group"
        title="Report a Bug"
      >
        <FaBug size={20} />
        <span className="absolute right-full mr-3 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Report Bug
        </span>
      </button>

      {/* Bug Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBug className="text-red-600" />
                Report a Bug
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Bug Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={bugReport.title}
                  onChange={(e) => setBugReport({ ...bugReport, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief description of the bug"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={bugReport.description}
                  onChange={(e) => setBugReport({ ...bugReport, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please describe the bug in detail..."
                />
              </div>

              <div>
                <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                  Steps to Reproduce *
                </label>
                <textarea
                  id="steps"
                  required
                  rows={3}
                  value={bugReport.steps}
                  onChange={(e) => setBugReport({ ...bugReport, steps: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Behavior
                  </label>
                  <textarea
                    id="expectedBehavior"
                    rows={2}
                    value={bugReport.expectedBehavior}
                    onChange={(e) => setBugReport({ ...bugReport, expectedBehavior: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="What should happen?"
                  />
                </div>

                <div>
                  <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Behavior
                  </label>
                  <textarea
                    id="actualBehavior"
                    rows={2}
                    value={bugReport.actualBehavior}
                    onChange={(e) => setBugReport({ ...bugReport, actualBehavior: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="What actually happens?"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">System Information (Auto-detected)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Browser: {getBrowserInfo()}</div>
                  <div>URL: {window.location.href}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 