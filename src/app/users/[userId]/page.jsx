"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockJourneys } from "@/lib/data/mockData";
import { useDataManager } from "@/hooks/useDataManager";
import { getTableConfig } from "@/lib/config/appConfig";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import PageContainer from "@/components/layout/PageContainer";

export default function UserJourneysPage() {
  const params = useParams();
  const userId = params.userId;
  const tableConfig = getTableConfig('journeys');

  // Get journeys for this user
  const userJourneys = useMemo(() => {
    const journeys = mockJourneys[userId] || mockJourneys["default"] || [];
    return journeys.map(journey => ({
      ...journey,
      // Ensure all required fields exist
      journeyStatus: journey.journeyStatus || journey.status || 'completed',
      startTime: journey.startTime || journey.createdAt,
      endTime: journey.endTime || journey.updatedAt,
      duration: journey.duration || '2m 30s',
      accountsCount: journey.accounts ? journey.accounts.length : 0
    }));
  }, [userId]);

  const {
    data: filteredJourneys,
    searchTerm,
    filters,
    sortConfig,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onClearFilters,
    config
  } = useDataManager('journeys', userJourneys);

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
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )
    }
  ];

  return (
    <PageContainer>
      <DataTable
        data={filteredJourneys}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        filterOptions={config.filterOptions}
        sortOptions={config.sortOptions}
        sortConfig={sortConfig}
        onSortChange={onSortChange}
      />
    </PageContainer>
  );
} 