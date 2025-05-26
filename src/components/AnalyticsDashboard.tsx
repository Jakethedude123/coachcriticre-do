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
import { RateLimiter } from '@/lib/services/RateLimiter';

interface Props {
  coach: Coach;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

interface RateLimitStatus {
  profileViews: boolean;
  searchAppearances: boolean;
  profileClicks: boolean;
}

interface AnalyticsData {
  profileViews: number;
  searchAppearances: number;
  profileClicks: number;
}

export default function AnalyticsDashboard({ coach }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<keyof Coach['analytics']>('profileViews');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus>({
    profileViews: true,
    searchAppearances: true,
    profileClicks: true
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    profileViews: 0,
    searchAppearances: 0,
    profileClicks: 0
  });

  useEffect(() => {
    const checkRateLimits = async () => {
      const profileViews = await RateLimiter.checkRateLimit(coach.userId, 'profileViews');
      const searchAppearances = await RateLimiter.checkRateLimit(coach.userId, 'searchAppearances');
      const profileClicks = await RateLimiter.checkRateLimit(coach.userId, 'profileClicks');
      
      setRateLimitStatus({
        profileViews,
        searchAppearances,
        profileClicks
      });

      setAnalyticsData({
        profileViews: profileViews ? 1 : 0,
        searchAppearances: searchAppearances ? 1 : 0,
        profileClicks: profileClicks ? 1 : 0
      });
    };

    checkRateLimits();
  }, [coach.userId]);

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

  const data = [
    {
      name: 'Current Hour',
      'Profile Views': analyticsData.profileViews,
      'Search Appearances': analyticsData.searchAppearances,
      'Profile Clicks': analyticsData.profileClicks
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map(({ key, label, icon: Icon, value }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as keyof Coach['analytics'])}
              className={`p-4 rounded-lg border ${
                selectedMetric === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
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
          <h3 className="text-lg font-semibold text-gray-900">Trend</h3>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'week' | 'month' | 'year')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === range
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
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

      <div className="mt-4 text-sm text-gray-500 text-right">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
} 