"use client";
import React from "react";
import { ArrowLeft, Users, User, FileUser } from "lucide-react";
import Link from "next/link";
import { mockRefreshTimeline, refreshStepActions } from "@/lib/data/mockData";
import TimelineStep from "@/components/timeline/TimelineStep";
import RefreshSummary from "@/components/refresh/RefreshSummary";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function AccountsPage({ params }) {
  const { userId } = params;
  const refreshData = mockRefreshTimeline[userId];

  // Set page metadata
  usePageMetadata("User Accounts", [
    { label: "Users", href: "/users", icon: <Users className="w-3 h-3" /> },
    { label: "User Details", href: `/users/${userId}`, icon: <User className="w-3 h-3" /> },
    { label: "User Accounts", href: `/users/${userId}/accounts`, icon: <FileUser className="w-3 h-3" />, isLast: true }
  ]);

  if (!refreshData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refresh Not Found</h2>
          <p className="text-gray-600 mb-6">No refresh data available for this user.</p>
          <Link
            href={`/users/${userId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Summary */}
      <RefreshSummary refreshData={refreshData} />

      {/* Accounts Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Accounts Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {refreshData.accounts.map((account) => (
            <div key={account.id} className="border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-900">{account.id}</span>
                <span className="text-xs text-gray-500">({account.type})</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{account.maskedNumber}</div>
              <div className="text-xs text-gray-500">Vintage: {account.vintage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Last Refresh Timeline</h2>
        <div className="space-y-4">
          {refreshData.timeline.map((step, index) => (
            <TimelineStep
              key={refreshStepActions[index]?.name || index}
              step={step}
              index={index}
              totalSteps={refreshData.timeline.length}
              accounts={refreshData.accounts}
              name={refreshStepActions[index]?.name}
              stepAction={refreshStepActions[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 