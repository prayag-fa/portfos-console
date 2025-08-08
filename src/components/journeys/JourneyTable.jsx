"use client";

import React from "react";
import Link from "next/link";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { ArrowRight } from "lucide-react";

export default function JourneyTable({ journeys, userId }) {
  const columns = [
    {
      key: "id",
      header: "Journey ID",
      headerClassName: "w-80",
      className: "text-sm font-medium text-gray-900"
    },
    {
      key: "journeyStartTime",
      header: "Start Time",
      render: (value, journey) => (
        <div className="flex-col flex gap-1">
          <span className="text-sm text-gray-900">
            {getRelativeTime(value)}
          </span>
          <span className="text-xs text-gray-400" title={getTooltipText(journey.startTime)}>
            Duration: {journey.duration}
          </span>
        </div>
      )
    },
    {
      key: "journeyStatus",
      header: "Status",
      render: (value) => <StatusBadge status={value} size="sm" />
    },
    {
      key: "accountsCount",
      header: "Accounts",
      render: (value, journey) => (
        <div>
          <div className="text-sm text-gray-900">{value || 0}</div>
          {journey.accounts && journey.accounts.length > 0 && (
            <div className="text-xs text-gray-500">
              {journey.accounts.map(acc => acc.type).join(', ')}
            </div>
          )}
        </div>
      )
    },
    {
      key: "actions",
      header: "",
      render: (_, journey) => (
        <Link
          href={`/users/${userId}/journey/${journey.id}`}
          className="inline-flex items-center p-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
        >
          <ArrowRight className="w-3 h-3" />
        </Link>
      )
    }
  ];

  return (
    <DataTable
      data={journeys}
      columns={columns}
    />
  );
} 