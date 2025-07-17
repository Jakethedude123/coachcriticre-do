import React from 'react';
import { FaUsers, FaChartLine, FaEnvelope, FaStar, FaCheck } from 'react-icons/fa';

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const features = [
    {
      icon: FaUsers,
      title: 'See Who Viewed You',
      description: 'View names, goals, and enhancement status of recent visitors'
    },
    {
      icon: FaEnvelope,
      title: 'Message Directly',
      description: 'Reach out to interested athletes and start conversations'
    },
    {
      icon: FaChartLine,
      title: 'Full Analytics',
      description: 'Track inquiry rates, tag performance, and engagement metrics'
    },
    {
      icon: FaStar,
      title: 'Priority Placement',
      description: 'Get featured placement in search results and recommendations'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#181d23] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button 
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors" 
            onClick={onClose}
          >
            ×
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4">
              <FaUsers className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Turn Interest Into Clients
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Pro coaches can see who viewed their profile, including names, goals, and enhancement status — and reach out directly to connect with interested athletes.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-[#232b36]">
                  <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-[#4FC3F7]/20 rounded-lg">
                    <Icon className="text-blue-600 dark:text-[#4FC3F7] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1a1f2e] dark:to-[#232b36] rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-[#4FC3F7]">3x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">More Inquiries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-[#4FC3F7]">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-[#4FC3F7]">2.5x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">More Clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 pb-8">
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2">
            <FaCheck className="text-sm" />
            <span>Upgrade to Pro and Start Connecting</span>
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
} 