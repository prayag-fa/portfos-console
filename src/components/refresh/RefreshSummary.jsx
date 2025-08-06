import React from "react";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import { Clock, Activity, RefreshCw } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function RefreshSummary({ refreshData }) {
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Refresh Summary</h3>
        <StatusBadge status={refreshData.status} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Refresh Time</p>
            <span 
              className="text-sm text-gray-600 cursor-help"
              title={getTooltipText(refreshData.refreshTime)}
            >
              {getRelativeTime(refreshData.refreshTime)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Duration</p>
            <span className="text-sm text-gray-600">{refreshData.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5" style={{ color: colors.primary[600] }} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Accounts</p>
            <span className="text-sm text-gray-600">{refreshData.accountsCount} accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
} 