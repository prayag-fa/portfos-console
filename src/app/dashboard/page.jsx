"use client";

import React from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { 
  Users, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Activity,
  BarChart3,
  Target,
  Zap,
  Shield
} from "lucide-react";

export default function DashboardPage() {
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  const metrics = [
    {
      title: "Total Users",
      value: "1,245",
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      color: "primary"
    },
    {
      title: "Active Journeys",
      value: "23",
      change: "+8.7%",
      changeType: "positive",
      icon: Activity,
      color: "secondary"
    },
    {
      title: "Success Rate",
      value: "92.3%",
      change: "+2.1%",
      changeType: "positive",
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Avg Journey Time",
      value: "8m 32s",
      change: "-12.5%",
      changeType: "positive",
      icon: Clock,
      color: "warning"
    }
  ];

  const trends = [
    {
      title: "Journey Success Rate",
      value: "92.3%",
      changeType: "positive",
      subtitle: "Last 30 days",
      chart: "line",
      description: "Journey completion rate trending upward"
    },
    {
      title: "Data Refresh Success",
      value: "87.5%",
      changeType: "positive",
      subtitle: "Last 30 days",
      chart: "bar",
      description: "Refresh operations performing well"
    },
    {
      title: "User Growth",
      value: "15.3%",
      changeType: "positive",
      subtitle: "This month",
      chart: "line",
      description: "Steady user acquisition"
    },
    {
      title: "Failed Journeys",
      value: "37",
      changeType: "negative",
      subtitle: "This month",
      chart: "bar",
      description: "Failed journey attempts"
    }
  ];

  const accountTypeData = [
    { type: 'Mutual Funds', successRate: 95.2, accounts: 520, avgTime: "12m 45s" },
    { type: 'Deposit', successRate: 98.1, accounts: 410, avgTime: "3m 20s" },
    { type: 'Equities', successRate: 91.8, accounts: 315, avgTime: "15m 30s" }
  ];

  const recentIssues = [
    { type: 'API Timeout', count: 12, severity: 'high' },
    { type: 'Consent Denied', count: 8, severity: 'medium' },
    { type: 'Data Incomplete', count: 15, severity: 'low' },
    { type: 'Refresh Failed', count: 6, severity: 'medium' }
  ];

  const performanceMetrics = [
    { name: 'Consent Success Rate', value: '94.1%', trend: '+1.2%', icon: Shield },
    { name: 'Data Backfill Success', value: '89.2%', trend: '+3.5%', icon: RefreshCw },
    { name: 'Average Journey Time', value: '8m 32s', trend: '-12.5%', icon: Clock },
    { name: 'Active Refreshes', value: '12', trend: '+8.7%', icon: Activity }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "primary":
        return {
          backgroundColor: colors.primary[100],
          color: colors.primary[600],
          borderColor: colors.primary[200]
        };
      case "secondary":
        return {
          backgroundColor: colors.secondary[100],
          color: colors.secondary[600],
          borderColor: colors.secondary[200]
        };
      case "success":
        return {
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          borderColor: '#bbf7d0'
        };
      case "warning":
        return {
          backgroundColor: '#fef3c7',
          color: '#d97706',
          borderColor: '#fde68a'
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          borderColor: '#d1d5db'
        };
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={getColorClasses(metric.color)}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                {getChangeIcon(metric.changeType)}
                <span className={`text-sm font-medium ${
                  metric.changeType === "positive" ? "text-green-600" : 
                  metric.changeType === "negative" ? "text-red-600" : "text-gray-600"
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{trend.title}</h3>
              <div className="flex items-center gap-2">
                {getChangeIcon(trend.changeType)}
                <span className={`text-lg font-bold ${
                  trend.changeType === "positive" ? "text-green-600" : 
                  trend.changeType === "negative" ? "text-red-600" : "text-gray-600"
                }`}>
                  {trend.value}
                </span>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-1">
                  {trend.chart === "bar" && "📊"}
                  {trend.chart === "line" && "📈"}
                  {trend.chart === "donut" && "⭕"}
                </div>
                <div className="text-xs text-gray-500">Chart Visualization</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">{trend.subtitle}</div>
            <div className="text-xs text-gray-500 mt-1">{trend.description}</div>
          </div>
        ))}
      </div>

      {/* Account Types Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Types Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountTypeData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                </div>
                <span className="text-xs text-gray-500">{item.accounts} accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{item.successRate}%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{item.avgTime}</div>
                  <div className="text-xs text-gray-500">Avg Time</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics & Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <metric.icon size={20} style={{ color: colors.primary[600] }} />
                  <span className="text-gray-700 font-medium">{metric.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                  <div className="text-green-600 text-sm">{metric.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Issues</h3>
          <div className="space-y-3">
            {recentIssues.map((issue, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    issue.severity === 'high' ? 'bg-red-500' : 
                    issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-gray-700">{issue.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(issue.severity)}`}>
                  {issue.count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap style={{ color: colors.primary[600] }} size={20} />
          Actionable Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium mb-2" style={{ color: colors.primary[900] }}>Performance Opportunity</div>
            <div className="text-sm text-gray-600">Mutual Funds accounts show 15% longer processing times. Consider optimizing API calls.</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium mb-2" style={{ color: colors.primary[900] }}>Refresh Optimization</div>
            <div className="text-sm text-gray-600">Equities refresh success rate is 12% lower than average. Review refresh logic.</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium mb-2" style={{ color: colors.primary[900] }}>User Growth Trend</div>
            <div className="text-sm text-gray-600">15.3% user growth this month. Consider scaling infrastructure.</div>
          </div>
        </div>
      </div>
    </div>
  );
}