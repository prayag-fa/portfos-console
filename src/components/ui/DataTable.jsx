"use client";

import React from "react";
import Filters from "./Filters";

export default function DataTable({
  // Table data and configuration
  data = [],
  columns = [],
  
  // Filter configuration
  searchTerm = "",
  onSearchChange,
  filters = {},
  onFilterChange,
  onClearFilters,
  filterOptions = {},
  sortOptions = [],
  sortConfig = null,
  onSortChange,
  
  // Table styling
  className = "",
  tableClassName = "",
  
  // Custom renderers
  renderRow,
  renderEmpty,
  
  // Loading and error states
  isLoading = false,
  error = null,
  
  // Pagination (optional)
  pagination = null,
  onPageChange,
  
  // Additional props
  ...props
}) {
  const renderDefaultRow = (item, index) => {
    return (
      <tr key={item.id || index} className="hover:bg-gray-50 transition-colors duration-150">
        {columns.map((column) => (
          <td key={column.key} className={`px-4 py-3 whitespace-nowrap ${column.className || ""}`}>
            {column.render ? column.render(item[column.key], item, index) : item[column.key]}
          </td>
        ))}
      </tr>
    );
  };

  const renderDefaultEmpty = () => (
    <tr>
      <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">No data found</p>
            <p className="text-xs text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        </div>
      </td>
    </tr>
  );

  const renderLoading = () => (
    <tr>
      <td colSpan={columns.length} className="px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </td>
    </tr>
  );

  const renderError = () => (
    <tr>
      <td colSpan={columns.length} className="px-4 py-8 text-center text-red-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-900">Error loading data</p>
            <p className="text-xs text-red-500">{error?.message || "Something went wrong"}</p>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Filters Section */}
      {(filterOptions && Object.keys(filterOptions).length > 0) || sortOptions?.length > 0 ? (
        <Filters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          sortConfig={sortConfig}
          onSortChange={onSortChange}
        />
      ) : null}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className={`w-full ${tableClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ""}`}
                >
                  {column.header || column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? renderLoading() : 
             error ? renderError() :
             data.length === 0 ? (renderEmpty || renderDefaultEmpty)() :
             data.map((item, index) => 
               renderRow ? renderRow(item, index) : renderDefaultRow(item, index)
             )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {pagination && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {/* Add pagination component here if needed */}
        </div>
      )}
    </div>
  );
}
