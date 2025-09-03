'use client';

import { useEffect, useState } from 'react';

import {
  BarChart3,
  ChartNoAxesCombined,
  Clock,
  Database,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';

import ActivityChart from '@/components/charts/ActivityChart';
import JourneyMetricsChart from '@/components/charts/JourneyMetricsChart';
import RefreshChart from '@/components/charts/RefreshChart';
import KPICard from '@/components/dashboard/KPICard';
import TrendCard from '@/components/dashboard/TrendCard';
import PageContainer from '@/components/layout/PageContainer';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import {
  calculateDashboardMetrics,
  generateActivityData,
  generateJourneyMetricsData,
  generateRefreshData
} from '@/lib/utils/dashboardData';

// Skeleton components for loading state
const KPISkeleton = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
    <div className='flex items-center justify-between'>
      <div className='h-8 w-24 animate-pulse rounded bg-gray-200' />
      <div className='h-8 w-8 animate-pulse rounded bg-gray-200' />
    </div>
    <div className='mt-2 h-6 w-16 animate-pulse rounded bg-gray-200' />
    <div className='mt-1 h-4 w-32 animate-pulse rounded bg-gray-200' />
  </div>
);

const ChartSkeleton = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
    <div className='h-4 w-32 animate-pulse rounded bg-gray-200 mb-4' />
    <div className='h-32 w-full animate-pulse rounded bg-gray-200' />
  </div>
);

const TrendSkeleton = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
    <div className='flex items-center gap-3'>
      <div className='h-8 w-8 animate-pulse rounded bg-gray-200' />
      <div className='flex-1'>
        <div className='h-4 w-24 animate-pulse rounded bg-gray-200 mb-2' />
        <div className='h-6 w-16 animate-pulse rounded bg-gray-200' />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Set page metadata
  usePageMetadata('Dashboard', [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <ChartNoAxesCombined className='size-3' />,
      isLast: true
    }
  ]);

  useEffect(() => {
    // Simulate data loading to prevent flash
    const timer = setTimeout(() => {
      const metrics = calculateDashboardMetrics();
      const activityData = generateActivityData();
      const refreshData = generateRefreshData();
      const journeyMetricsData = generateJourneyMetricsData();

      setDashboardData({
        metrics,
        activityData,
        refreshData,
        journeyMetricsData
      });
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton loading
  if (isLoading || !dashboardData) {
    return (
      <PageContainer className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <KPISkeleton key={idx} />
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <ChartSkeleton key={idx} />
          ))}
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='h-6 w-32 animate-pulse rounded bg-gray-200 mb-4' />
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, idx) => (
              <TrendSkeleton key={idx} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  const { metrics, activityData, refreshData, journeyMetricsData } = dashboardData;

  // Define KPI metrics
  const kpiMetrics = [
    {
      name: 'Total Users',
      value: metrics.totalUsers,
      change: '+2',
      changeType: 'positive',
      icon: Users,
      description: 'Active users in the system'
    },
    {
      name: 'Total Journeys',
      value: metrics.totalJourneys,
      change: '+17',
      changeType: 'positive',
      icon: BarChart3,
      description: 'Total journeys in the system'
    },
    {
      name: 'Total Accounts',
      value: metrics.totalAccounts,
      change: '+3',
      changeType: 'positive',
      icon: Database,
      description: 'Linked financial accounts'
    }
  ];

  // Define trend data
  const trends = [
    {
      name: 'Journey Completions',
      value: metrics.completedJourneys,
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      name: 'Failed Journeys',
      value: metrics.failedJourneys,
      change: '-8%',
      changeType: 'negative',
      icon: TrendingDown
    },
    {
      name: 'In Progress',
      value: metrics.inProgressJourneys,
      change: '+3%',
      changeType: 'positive',
      icon: Clock
    }
  ];

  return (
    <PageContainer className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {kpiMetrics.map((metric, idx) => (
          <KPICard key={idx} metric={metric} />
        ))}
      </div>

      {/* Charts Section - All 3 in one row */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* Activity Chart */}
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <ActivityChart data={activityData} title='Activity Overview' />
        </div>

        {/* Refresh Success Rate Chart */}
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <RefreshChart data={refreshData} title='Refresh Success Rate' />
        </div>

        {/* Journey Metrics Chart */}
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <JourneyMetricsChart data={journeyMetricsData} title='Journey Metrics' />
        </div>
      </div>

      {/* Trends Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Journey Trends</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {trends.map((trend, idx) => (
            <TrendCard key={idx} trend={trend} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
