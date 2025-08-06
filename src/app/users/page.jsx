"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/lib/data/mockData";
import { getRelativeTime, getTooltipText } from "@/lib/utils/formatters";
import UsersTable from "@/components/users/UsersTable";
import ModernFilters from "@/components/ui/ModernFilters";

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    journeyCount: "all"
  });
  const [sortConfig, setSortConfig] = useState({
    key: "clientUserId",
    direction: "asc"
  });

  const filterOptions = {
    status: [
      { value: "all", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ],
    journeyCount: [
      { value: "all", label: "All Journeys" },
      { value: "1", label: "1 Journey" },
      { value: "2", label: "2 Journeys" },
      { value: "3", label: "3+ Journeys" }
    ]
  };

  const sortOptions = [
    { key: "clientUserId", label: "User ID" },
    { key: "journeyCount", label: "Journey Count" },
    { key: "lastJourneyTime", label: "Last Journey" },
    { key: "accountsLinked", label: "Accounts" }
  ];

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = mockUsers.filter(user => {
      const matchesSearch = !filters.search || 
        user.clientUserId.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === "all" || 
        user.status === filters.status;
      
      const matchesJourneyCount = filters.journeyCount === "all" || 
        user.journeyCount.toString() === filters.journeyCount;

      return matchesSearch && matchesStatus && matchesJourneyCount;
    });

    // Sort the filtered users
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "lastJourneyTime") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [mockUsers, filters, sortConfig]);

  const handleRefresh = (userId) => {
    console.log(`Refreshing user: ${userId}`);
    // Implement refresh logic
  };

  const handleViewRefreshDetails = (userId) => {
    router.push(`/users/${userId}/refresh`);
  };

  const handleViewJourney = (userId) => {
    router.push(`/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      <ModernFilters
        filters={filters}
        onFiltersChange={setFilters}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />

      <UsersTable
        users={filteredAndSortedUsers}
        onRefresh={handleRefresh}
        onViewRefreshDetails={handleViewRefreshDetails}
        onViewJourney={handleViewJourney}
      />
    </div>
  );
}