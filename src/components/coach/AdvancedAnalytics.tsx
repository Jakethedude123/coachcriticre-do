"use client";

import { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaClock, FaSearch, FaArrowRight } from 'react-icons/fa';
import { Coach } from '@/lib/firebase/models/coach';

interface AdvancedAnalyticsProps {
  coach: Coach;
}

interface AnalyticsData {
  trafficSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  bounceRate: number;
  averageTimeOnProfile: number;
  clickThroughRate: number;
  topSearchQueries: {
    query: string;
    count: number;
  }[];
}

export default function AdvancedAnalytics({ coach }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    trafficSources: [],
    bounceRate: 0,
    averageTimeOnProfile: 0,
    clickThroughRate: 0,
    topSearchQueries: [],
  });

  useEffect(() => {
    // Fetch analytics data based on time range
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/coaches/${coach.userId}/analytics?timeRange=${timeRange}`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [coach.userId, timeRange]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaUsers className="mr-2 text-blue-500" />
          Traffic Sources
        </h3>
        <div className="space-y-4">
          {analyticsData.trafficSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{source.source}</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <span className="text-gray-600">{source.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bounce Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-500" />
            Bounce Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {analyticsData.bounceRate}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Users who leave without interaction
          </p>
        </div>

        {/* Average Time on Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaClock className="mr-2 text-blue-500" />
            Avg. Time on Profile
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {analyticsData.averageTimeOnProfile}m
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Average visit duration
          </p>
        </div>

        {/* Click Through Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaArrowRight className="mr-2 text-blue-500" />
            Click Through Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {analyticsData.clickThroughRate}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Profile engagement rate
          </p>
        </div>
      </div>

      {/* Top Search Queries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaSearch className="mr-2 text-blue-500" />
          Top Search Queries
        </h3>
        <div className="space-y-4">
          {analyticsData.topSearchQueries.map((query, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{query.query}</span>
              <span className="text-gray-900 font-medium">{query.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 