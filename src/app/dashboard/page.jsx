"use client";

import React from "react";
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Database
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { calculateDashboardMetrics, generateActivityData, generateRefreshData, generateJourneyMetricsData } from "@/lib/utils/dashboardData";
import ActivityChart from "@/components/charts/ActivityChart";
import RefreshChart from "@/components/charts/RefreshChart";
import JourneyMetricsChart from "@/components/charts/JourneyMetricsChart";
import KPICard from "@/components/dashboard/KPICard";
import TrendCard from "@/components/dashboard/TrendCard";
import PageContainer from "@/components/layout/PageContainer";

export default function Dashboard() {
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  // Get calculated metrics
  const {
    totalUsers,
    totalJourneys,
    totalAccounts,
    completedJourneys,
    failedJourneys,
    inProgressJourneys
  } = calculateDashboardMetrics();

  // Generate chart data
  const activityData = generateActivityData();
  const refreshData = generateRefreshData();
  const journeyMetricsData = generateJourneyMetricsData();

  // Define KPI metrics
  const metrics = [
    {
      name: "Total Users",
      value: totalUsers,
      change: "+2",
      changeType: "positive",
      icon: Users,
      description: "Active users in the system"
    },
    {
      name: "Total Journeys",
      value: totalJourneys,
      change: "+17",
      changeType: "positive",
      icon: BarChart3,
      description: "Total journeys in the system"
    },
    {
      name: "Total Accounts",
      value: totalAccounts,
      change: "+3",
      changeType: "positive",
      icon: Database,
      description: "Linked financial accounts"
    }
  ];

  // Define trend data
  const trends = [
    {
      name: "Journey Completions",
      value: completedJourneys,
      change: "+12%",
      changeType: "positive",
      icon: TrendingUp
    },
    {
      name: "Failed Journeys",
      value: failedJourneys,
      change: "-8%",
      changeType: "negative",
      icon: TrendingDown
    },
    {
      name: "In Progress",
      value: inProgressJourneys,
      change: "+3%",
      changeType: "positive",
      icon: Clock
    }
  ];

  return (
    <PageContainer className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <KPICard key={idx} metric={metric} colors={colors} />
        ))}
      </div>

      {/* Charts Section - All 3 in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <ActivityChart data={activityData} title="Activity Overview" />
        </div>

        {/* Refresh Success Rate Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <RefreshChart data={refreshData} title="Refresh Success Rate" />
        </div>

        {/* Journey Metrics Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <JourneyMetricsChart data={journeyMetricsData} title="Journey Metrics" />
        </div>
      </div>

      {/* Trends Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trends.map((trend, idx) => (
            <TrendCard key={idx} trend={trend} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}