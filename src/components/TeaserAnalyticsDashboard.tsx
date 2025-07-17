import { useState } from 'react';
import { FaEye, FaSearch, FaMousePointer, FaChartLine, FaBell, FaExclamationTriangle, FaLock, FaUsers, FaChartBar, FaArrowUp } from 'react-icons/fa';

const sections = [
  {
    key: 'profileViews',
    label: 'Who Viewed Your Profile',
    value: '7 users viewed your profile this week',
    subValue: '3 new visitors today',
    tooltip: 'See who\'s checking out your coaching profile — and message them directly.',
    prominent: true,
    icon: FaUsers,
  },
  {
    key: 'inquiryRate',
    label: 'Inquiry Rate',
    value: '12% conversion rate',
    subValue: 'Locked - Upgrade to see details',
    tooltip: 'Track how many athletes reach out after viewing your profile and optimize your messaging.',
    icon: FaChartLine,
  },
  {
    key: 'tagPerformance',
    label: 'Tag Performance',
    value: 'Bodybuilding • Powerlifting',
    subValue: 'Locked - See which tags drive most interest',
    tooltip: 'See which specialties and credentials attract the most attention and optimize your profile.',
    icon: FaChartBar,
  },
  {
    key: 'searchAppearances',
    label: 'Search Appearances',
    value: '24 times this week',
    subValue: 'Locked - See search terms',
    tooltip: 'See how often you appear in athlete searches and which keywords bring you visibility.',
    icon: FaSearch,
  },
  {
    key: 'profileClicks',
    label: 'Profile Clicks',
    value: '15 clicks from search',
    subValue: 'Locked - See click-through rate',
    tooltip: 'See how many athletes click through to your profile and optimize your search presence.',
    icon: FaMousePointer,
  },
  {
    key: 'engagement',
    label: 'Profile Engagement',
    value: '2.3 min avg. time on profile',
    subValue: 'Locked - See engagement details',
    tooltip: 'Track how long athletes spend on your profile and what content keeps them engaged.',
    icon: FaEye,
  },
];

export default function TeaserAnalyticsDashboard({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f1419] dark:to-[#1a1f2e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your profile performance and connect with interested athletes</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const isProfileViews = section.key === 'profileViews';
            
            return (
              <div
                key={section.key}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  section.prominent 
                    ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1a1f2e] dark:to-[#232b36] border-2 border-blue-200 dark:border-[#4FC3F7]/30' 
                    : 'bg-white/80 dark:bg-[#181d23]/80 border border-gray-200 dark:border-gray-700'
                } rounded-2xl p-6 shadow-lg hover:shadow-xl backdrop-blur-sm`}
                onMouseEnter={() => setHovered(section.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={onUpgradeClick}
              >
                {/* Lock Overlay - more intense blur for non-profile views */}
                <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
                  isProfileViews 
                    ? 'bg-white/40 dark:bg-[#181d23]/40 backdrop-blur-[0.5px]' 
                    : 'bg-white/80 dark:bg-[#181d23]/80 backdrop-blur-[3px]'
                }`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${section.prominent ? 'bg-blue-100 dark:bg-[#4FC3F7]/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Icon className={`text-xl ${section.prominent ? 'text-blue-600 dark:text-[#4FC3F7]' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${section.prominent ? 'text-blue-900 dark:text-[#4FC3F7] text-lg' : 'text-gray-900 dark:text-white'}`}>
                          {section.label}
                        </h3>
                      </div>
                    </div>
                    <FaLock className="text-gray-400 dark:text-gray-500 text-lg" />
                  </div>

                  {/* Values with different blur levels */}
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold text-gray-900 dark:text-white select-none ${
                      isProfileViews ? '' : 'blur-[4px]'
                    }`}>
                      {section.value}
                    </div>
                    <div className={`text-sm text-gray-500 dark:text-gray-400 select-none ${
                      isProfileViews ? '' : 'blur-[3px]'
                    }`}>
                      {section.subValue}
                    </div>
                  </div>

                  {/* Profile Pictures for Profile Views (blurry like LinkedIn Premium) */}
                  {isProfileViews && (
                    <div className="mt-4 flex -space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div className="absolute inset-0 w-8 h-8 rounded-full bg-white/60 dark:bg-[#181d23]/60 backdrop-blur-[2px]" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        +2
                      </div>
                    </div>
                  )}

                  {/* Hover Tooltip */}
                  {hovered === section.key && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white dark:bg-[#232b36] text-gray-900 dark:text-gray-100 text-sm rounded-xl shadow-2xl p-4 z-[100] border border-blue-200 dark:border-[#4FC3F7]">
                      <div className="flex items-start space-x-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-[#4FC3F7]/20 mt-0.5">
                          <FaArrowUp className="text-blue-600 dark:text-[#4FC3F7] text-xs" />
                        </div>
                        <p>{section.tooltip}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upgrade Hint */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Upgrade to Pro
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer" onClick={onUpgradeClick}>
            <span>Unlock Full Analytics</span>
            <FaArrowUp className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
} 