"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/lib/data/mockData";
import { useDataManager } from "@/hooks/useDataManager";
import { getRelativeTime } from "@/lib/utils/formatters";
import DataTable from "@/components/ui/DataTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { ChevronRight, RefreshCw, Users } from "lucide-react";
import { PATHS } from "@/lib/utils/constants";
import { usePageMetadata } from "@/hooks/usePageMetadata";


export default function ConsoleUsersPage() {
  const router = useRouter();
  const [refreshDialog, setRefreshDialog] = useState({ isOpen: false, userId: null });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Set page metadata
  usePageMetadata("Users", [
    { label: "Users", href: "/users", icon: <Users className="w-3 h-3" />, isLast: true }
  ]);
  
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
    router.push(PATHS.userJourneys(userId));
  };

  const handleViewRefreshDetails = (userId) => {
    router.push(PATHS.accounts(userId));
  };

  const handleRefresh = (userId) => {
    setRefreshDialog({ isOpen: true, userId });
  };

  const confirmRefresh = async () => {
    if (!refreshDialog.userId) return;
    
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Refreshing user ${refreshDialog.userId}`);
      // Here you would call the actual refresh API
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
      setRefreshDialog({ isOpen: false, userId: null });
    }
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
      key: "accountsLinked",
      header: "Accounts",
      render: (value, user) => (
        <div className="flex gap-1 flex-col">
          <button
            onClick={() => handleViewRefreshDetails(user.clientUserId)}
            className="hover:text-blue-600 rounded transition-colors duration-150 flex items-center gap-1"
            title="View Accounts"
          >
            <span className="text-sm font-medium">{value || 0} accounts</span>
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </button>
          {user.lastRefresh && (
            <div className="text-xs flex items-center gap-1 text-gray-500 mt-0.5">
              Last Refresh: {getRelativeTime(user.lastRefresh.time)} {getStatusIndicator(user.lastRefresh?.status)}
            </div>
          )}
        </div>
      )
    },
    {
      key: "journeyCount",
      header: "Journeys",
      render: (value, user) => (
          <div className="flex gap-1 flex-col">
            <button
              onClick={() => handleViewJourney(user.clientUserId)}
              className="hover:text-blue-600 rounded transition-colors duration-150 flex items-center gap-1"
              title="View Journeys"
            >
              <span className="text-sm font-medium">{value || 0} journeys</span>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
            {user.lastJourneyTime && (
              <div className="text-xs flex items-center gap-1 text-gray-500 mt-0.5">
                Last Journey: {getRelativeTime(user.lastJourneyTime)}
              </div>
            )}
        </div>
      )
    },
    {
      key: "refreshTime",
      header: "",
      render: (_, user) => (
          <div className="flex gap-1 flex-col">
            <button
              onClick={() => handleRefresh(user.clientUserId)}
              className="text-blue-600 transition-colors duration-150 max-w-8 p-2 bg-blue-50 rounded-md hover:bg-blue-100"
              title="Refresh Data for User"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
        </div>
      )
    },
  ];

  return (
    <ProtectedRoute>
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
        isLoading={isRefreshing}
      />
      
      <ConfirmationDialog
        isOpen={refreshDialog.isOpen}
        onClose={() => setRefreshDialog({ isOpen: false, userId: null })}
        onConfirm={confirmRefresh}
        title="Refresh User Data"
        message={`Are you sure you want to refresh data for user ${refreshDialog.userId}? This may take a few moments.`}
        confirmText="Refresh"
        type="warning"
        isLoading={isRefreshing}
      />
    </ProtectedRoute>
  );
}