import { useState, useEffect } from 'react';
import { Coach } from '@/lib/firebase/models/coach';
import { FaEye, FaSearch, FaMousePointer, FaChartLine, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Props {
  coach: Coach;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsDashboard({ coach }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<keyof Coach['analytics']>('profileViews');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const getTimeRangeData = () => {
    const now = new Date();
    const ranges = {
      '7d': now.setDate(now.getDate() - 7),
      '30d': now.setDate(now.getDate() - 30),
      '90d': now.setDate(now.getDate() - 90),
      'all': 0
    };

    const startTime = ranges[timeRange as TimeRange];
    return coach.analytics.history.filter(
      (item) => new Date(item.date).getTime() > startTime
    );
  };

  const metrics = [
    { key: 'profileViews', label: 'Profile Views', icon: FaEye, value: coach.analytics.profileViews },
    { key: 'searchAppearances', label: 'Search Appearances', icon: FaSearch, value: coach.analytics.searchAppearances },
    { key: 'profileClicks', label: 'Profile Clicks', icon: FaMousePointer, value: coach.analytics.profileClicks },
    { key: 'messagesSent', label: 'Messages Sent', icon: FaBell, value: coach.analytics.messagesSent },
    { key: 'inquiriesReceived', label: 'Inquiries Received', icon: FaExclamationTriangle, value: coach.analytics.inquiriesReceived },
    { key: 'clientsGained', label: 'Clients Gained', icon: FaChartLine, value: coach.analytics.clientsGained }
  ];

  const chartData = getTimeRangeData().reduce((acc: any[], item) => {
    const existingEntry = acc.find(entry => entry.date === new Date(item.date).toLocaleDateString());
    
    if (existingEntry) {
      if (item.metric === 'profileViews') existingEntry.views = item.value;
      if (item.metric === 'searchAppearances') existingEntry.appearances = item.value;
      if (item.metric === 'profileClicks') existingEntry.clicks = item.value;
    } else {
      const newEntry = {
        date: new Date(item.date).toLocaleDateString(),
        views: item.metric === 'profileViews' ? item.value : 0,
        appearances: item.metric === 'searchAppearances' ? item.value : 0,
        clicks: item.metric === 'profileClicks' ? item.value : 0
      };
      acc.push(newEntry);
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-white dark:bg-[#181d23] rounded-lg shadow-sm p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map(({ key, label, icon: Icon, value }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as keyof Coach['analytics'])}
              className={`p-4 rounded-lg border ${
                selectedMetric === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">{label}</div>
              <div className="text-2xl font-bold mt-1">
                {value}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trend</h3>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'week' | 'month' | 'year')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === range
                    ? 'bg-gray-900 dark:bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="appearances"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#ffc658"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-right">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
} 