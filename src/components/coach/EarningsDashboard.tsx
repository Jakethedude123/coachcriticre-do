"use client";

import { useState, useEffect } from 'react';
import { CoachListing } from '@/lib/firebase/models/coach';
import { FaDollarSign, FaChartLine, FaUsers, FaShoppingCart } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface EarningsSummary {
  totalEarnings: number;
  periodEarnings: number;
  totalSales: number;
  activeSubscribers: number;
}

interface SalesData {
  date: string;
  amount: number;
  sales: number;
}

interface EarningsDashboardProps {
  stripeAccountId: string;
  listings: CoachListing[];
}

export default function EarningsDashboard({ stripeAccountId, listings }: EarningsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    periodEarnings: 0,
    totalSales: 0,
    activeSubscribers: 0
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [packageStats, setPackageStats] = useState<{ name: string; sales: number; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarningsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/coach/earnings?timeRange=${timeRange}&accountId=${stripeAccountId}`);
        if (!response.ok) throw new Error('Failed to fetch earnings data');
        
        const data = await response.json();
        setSummary(data.summary);
        setSalesData(data.salesData);
        setPackageStats(data.packageStats);
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError('Failed to load earnings data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningsData();
  }, [timeRange, stripeAccountId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Earnings Dashboard</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalEarnings)}</p>
            </div>
            <FaDollarSign className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">{timeRange} Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.periodEarnings)}</p>
            </div>
            <FaChartLine className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{summary.totalSales}</p>
            </div>
            <FaShoppingCart className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Subscribers</p>
              <p className="text-2xl font-bold">{summary.activeSubscribers}</p>
            </div>
            <FaUsers className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#7c3aed"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Package Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Package Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
              <YAxis yAxisId="right" orientation="right" stroke="#7c3aed" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Sales'
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Revenue"
                fill="#2563eb"
              />
              <Bar
                yAxisId="right"
                dataKey="sales"
                name="Sales"
                fill="#7c3aed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 