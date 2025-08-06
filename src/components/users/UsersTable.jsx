import React from "react";
import { Clock, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from "lucide-react";
import { formatDateTime, getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import { useTheme } from "@/lib/context/ThemeContext";

export default function UsersTable({ 
  users, 
  onRefresh, 
  onViewRefreshDetails, 
  onViewJourney 
}) {
  const getStatusIndicator = (status) => {
    switch (status) {
      case "success":
      case "completed":
        return <div className="w-2 h-2 bg-green-500 rounded-full" title="Success" />;
      case "failed":
        return <div className="w-2 h-2 bg-red-500 rounded-full" title="Failed" />;
      case "in_progress":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" title="In Progress" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" title="Unknown" />;
    }
  };

  const getTrendIcon = (status) => {
    switch (status) {
      case "success":
      case "completed":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "failed":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      case "in_progress":
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Journeys
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accounts Linked
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Refresh
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.clientUserId.charAt(0)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.clientUserId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewJourney(user.clientUserId)}
                        className="inline-flex items-center text-xs font-medium group-hover:text-blue-600 group-hover:underline"
                      >
                        <span className="inline-flex items-center text-xs font-medium group-hover:text-blue-600 group-hover:underline">
                          {user.journeyCount} journeys
                        </span>
                      </button>
                      <button
                        onClick={() => onViewJourney(user.clientUserId)}
                        className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors duration-150"
                        title="View Journeys"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      <span 
                        title={getTooltipText(user.lastJourneyTime)}
                        className="cursor-help"
                      >
                        {getRelativeTime(user.lastJourneyTime)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
                    {user.accountsLinked} accounts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onViewRefreshDetails(user.clientUserId)}
                      className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-1 w-16 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(user.lastRefresh?.status)}
                        <span 
                          className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-200 cursor-help"
                          title={user.lastRefresh?.time ? getTooltipText(user.lastRefresh.time) : "No refresh data"}
                        >
                          {user.lastRefresh?.time ? getRelativeTime(user.lastRefresh.time) : "Never"}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => onRefresh(user.clientUserId)}
                      className="inline-flex items-center p-1.5 rounded text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                      title="Refresh Now"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 