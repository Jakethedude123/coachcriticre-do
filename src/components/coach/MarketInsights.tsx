"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaChartBar, FaArrowTrendUp, FaUsers, FaDollarSign } from 'react-icons/fa6';
import { Coach } from '@/lib/firebase/models/coach';

interface MarketInsightsProps {
  coach: Coach;
}

interface MarketData {
  topCategories: {
    name: string;
    growth: number;
    demand: number;
  }[];
  priceTrends: {
    category: string;
    averagePrice: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  demandMetrics: {
    category: string;
    demandScore: number;
    competitionLevel: 'low' | 'medium' | 'high';
  }[];
  regionalInsights: {
    region: string;
    demand: number;
    averagePrice: number;
  }[];
}

export default function MarketInsights({ coach }: MarketInsightsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [marketData, setMarketData] = useState<MarketData>({
    topCategories: [],
    priceTrends: [],
    demandMetrics: [],
    regionalInsights: [],
  });

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch(`/api/coaches/${coach.userId}/market-insights?timeRange=${timeRange}`);
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market insights:', error);
    }
  }, [coach.userId, timeRange]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['week', 'month', 'quarter'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaChartBar className="mr-2 text-blue-500" />
          Top Categories This {timeRange}
        </h3>
        <div className="space-y-4">
          {marketData.topCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{category.name}</span>
                <span className={`ml-2 text-sm ${category.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {category.growth >= 0 ? '+' : ''}{category.growth}%
                </span>
              </div>
              <div className="flex items-center">
                <FaArrowTrendUp className="text-gray-400 mr-2" />
                <span className="text-gray-600">Demand: {category.demand}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaDollarSign className="mr-2 text-blue-500" />
          Price Trends
        </h3>
        <div className="space-y-4">
          {marketData.priceTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{trend.category}</span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">${trend.averagePrice}/hr</span>
                <span className={`text-sm ${
                  trend.trend === 'up' ? 'text-green-500' :
                  trend.trend === 'down' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaUsers className="mr-2 text-blue-500" />
          Demand & Competition
        </h3>
        <div className="space-y-4">
          {marketData.demandMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{metric.category}</span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Demand: {metric.demandScore}/10</span>
                <span className={`text-sm ${getCompetitionColor(metric.competitionLevel)}`}>
                  {metric.competitionLevel.charAt(0).toUpperCase() + metric.competitionLevel.slice(1)} Competition
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.regionalInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{insight.region}</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Demand Score: {insight.demand}/10
                </p>
                <p className="text-sm text-gray-600">
                  Avg. Price: ${insight.averagePrice}/hr
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 