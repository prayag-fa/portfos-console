"use client";

import React from "react";
import { useDataTable } from "@/hooks/useDataTable";
import DataTable from "./DataTable";

// Example usage of DataTable with filters
export default function TableExample() {
  const sampleData = [
    { id: 1, name: "John Doe", status: "active", role: "admin", createdAt: "2024-01-15" },
    { id: 2, name: "Jane Smith", status: "inactive", role: "user", createdAt: "2024-01-10" },
    { id: 3, name: "Bob Johnson", status: "active", role: "moderator", createdAt: "2024-01-20" },
  ];

  const filterOptions = {
    status: [
      { value: "all", label: "All Statuses" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ],
    role: [
      { value: "all", label: "All Roles" },
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
      { value: "moderator", label: "Moderator" }
    ]
  };

  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Created Date" }
  ];

  const {
    data,
    filters,
    searchTerm,
    sortConfig,
    handleFilterChange,
    handleSearchChange,
    handleSortChange,
    handleClearFilters,
    isLoading,
    error
  } = useDataTable(sampleData, {
    filterOptions,
    sortOptions,
    initialFilters: { status: "all", role: "all" }
  });

  const columns = [
    {
      key: "id",
      header: "ID",
      className: "text-sm font-medium text-gray-900"
    },
    {
      key: "name",
      header: "Name",
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (value) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: "createdAt",
      header: "Created",
      render: (value) => <span className="text-sm text-gray-500">{value}</span>
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">DataTable Example with Filters</h2>
      <DataTable
        data={data}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
