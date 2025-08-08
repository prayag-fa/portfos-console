"use client";

import React from "react";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import { Clock, Activity, Users } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function JourneySummary({ journey }) {
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Journey Summary</h3>
        <StatusBadge status={journey.journeyStatus} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Start Time</p>
            <span 
              className="text-xs text-gray-600 cursor-help"
              title={getTooltipText(journey.journeyStartTime)}
            >
              {getRelativeTime(journey.journeyStartTime)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Duration</p>
            <span className="text-xs text-gray-600">{journey.journeyDuration}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
              <Users className="w-4 h-4" style={{ color: colors.primary[600] }} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Accounts</p>
            <span className="text-xs text-gray-600">{journey.accounts.length} accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
} 