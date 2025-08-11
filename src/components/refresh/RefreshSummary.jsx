"use client";

import React from "react";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import { Clock, Activity, RefreshCw } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function RefreshSummary({ refreshData }) {
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Summary</h3>
        <StatusBadge status={refreshData.status} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Last Refresh Time</p>
            <span 
              className="text-xs text-gray-600 cursor-help"
              title={getTooltipText(refreshData.refreshTime)}
            >
              {getRelativeTime(refreshData.refreshTime)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Last Refresh Duration</p>
            <span className="text-xs text-gray-600">{refreshData.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <RefreshCw className="w-4 h-4" style={{ color: colors.primary[600] }} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Total Accounts</p>
            <span className="text-xs text-gray-600">{refreshData.accounts.length} accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
} 