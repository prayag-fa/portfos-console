"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { mockJourneys } from "@/lib/data/mockData";
import JourneyTable from "@/components/journeys/JourneyTable";
import ModernFilters from "@/components/ui/ModernFilters";

export default function UserJourneysPage() {
  const params = useParams();
  const userId = params.userId;
  
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all"
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: "journeyStartTime",
    direction: "desc"
  });

  const filterOptions = {
    status: [
      { value: "all", label: "All Status" },
      { value: "completed", label: "Completed" },
      { value: "in_progress", label: "In Progress" },
      { value: "failed", label: "Failed" }
    ],
    dateRange: [
      { value: "all", label: "All Time" },
      { value: "today", label: "Today" },
      { value: "week", label: "This Week" },
      { value: "month", label: "This Month" }
    ]
  };

  const sortOptions = [
    { key: "journeyStartTime", label: "Start Time" },
    { key: "status", label: "Status" },
    { key: "accountsCount", label: "Accounts" }
  ];

  const userJourneys = mockJourneys[userId] || mockJourneys["default"] || [];

  const filteredAndSortedJourneys = useMemo(() => {
    let filtered = userJourneys.filter(journey => {
      const matchesSearch = !filters.search || 
        journey.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === "all" || 
        journey.status === filters.status;
      
      const matchesDateRange = filters.dateRange === "all" || 
        (() => {
          const journeyDate = new Date(journey.journeyStartTime);
          const now = new Date();
          
          switch (filters.dateRange) {
            case "today":
              return journeyDate.toDateString() === now.toDateString();
            case "week":
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return journeyDate >= weekAgo;
            case "month":
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return journeyDate >= monthAgo;
      default:
              return true;
          }
        })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort the filtered journeys
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "journeyStartTime") {
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
  }, [userJourneys, filters, sortConfig]);

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

      <JourneyTable
        journeys={filteredAndSortedJourneys}
        userId={userId}
      />
    </div>
  );
} 