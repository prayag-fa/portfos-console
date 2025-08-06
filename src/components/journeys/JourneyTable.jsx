import React from "react";
import Link from "next/link";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import { BarChart3, ArrowRight } from "lucide-react";

export default function JourneyTable({ 
  journeys, 
  userId
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Journey ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accounts
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {journeys.map((journey) => (
              <tr
                key={journey.id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {journey.id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="text-sm text-gray-600 cursor-help"
                    title={getTooltipText(journey.journeyStartTime)}
                  >
                    {getRelativeTime(journey.journeyStartTime)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={journey.journeyStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
                    {journey.accountsCount} accounts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/users/${userId}/journey/${journey.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                    title="View Timeline"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 