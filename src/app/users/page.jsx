"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/lib/data/mockData";
import { useDataManager } from "@/hooks/useDataManager";
import { getTableConfig } from "@/lib/config/appConfig";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import DataTable from "@/components/ui/DataTable";
import PageContainer from "@/components/layout/PageContainer";
import { ChevronRight, RefreshCw } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const tableConfig = getTableConfig('users');
  
  // Process mockUsers array for filtering
  const usersArray = useMemo(() => {
    return mockUsers.map(user => ({
      ...user,
      // Ensure all required fields exist
      status: user.status || 'active',
      journeyCount: user.journeyCount || 0,
      accountsCount: user.accountsCount || 0,
      lastRefresh: user.lastRefresh || null
    }));
  }, []);

  const {
    data: filteredUsers,
    searchTerm,
    filters,
    sortConfig,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onClearFilters,
    config
  } = useDataManager('users', usersArray);

  const handleViewJourney = (userId) => {
    router.push(`/users/${userId}`);
  };

  const handleRefresh = async (userId) => {
    console.log(`Refreshing user ${userId}`);
  };

  const handleViewRefreshDetails = (userId) => {
    router.push(`/users/${userId}/refresh`);
  };

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

  const columns = [
    {
      key: "clientUserId",
      header: "User ID",
      headerClassName: "w-80",
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">
          {value}
        </div>
      )
    },
    {
      key: "journeyCount",
      header: "Journeys",
      render: (value, user) => (
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewJourney(user.clientUserId)}
              className="hover:text-blue-600 rounded transition-colors duration-150 flex items-center gap-1"
              title="View Journeys"
            >
              <span className="text-sm font-medium">{value || 0} journeys</span>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          {user.lastJourneyTime && (
            <div className="text-xs flex items-center gap-1 text-gray-500 mt-0.5">
              Last Journey: {getRelativeTime(user.lastJourneyTime)}
            </div>
          )}
        </div>
      )
    },
    {
      key: "accountsLinked",
      header: "Accounts",
      render: (value) => (
        <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-lg">
          {value || 0} accounts
        </span>
      )
    },
    {
      key: "lastRefresh",
      header: "Last Refresh",
      render: (value, user) => (
        <div className="flex items-center gap-2">
          {getStatusIndicator(value?.status)}
          <div className="flex items-center gap-1.5">
            <button 
              className="text-sm flex gap-1 items-center hover:text-blue-600 transition-colors duration-150 cursor-pointer group"
              onClick={() => handleViewRefreshDetails(user.clientUserId)}
              title={`View refresh details - ${value?.time ? getTooltipText(value.time) : "Never refreshed"}`}
            >
              {value?.time ? getRelativeTime(value.time) : "Never"}
            <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <button
            onClick={() => handleRefresh(user.id)}
            className="flex items-center gap-1 p-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
            title="Refresh Now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <DataTable
        data={filteredUsers}
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