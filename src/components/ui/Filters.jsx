"use client";

import React from "react";
import { hasActiveFilters } from "@/utils/filterUtils";
import SearchInput from "./filters/SearchInput";
import Dropdown from "./filters/Dropdown";
import ActiveFilters from "./filters/ActiveFilters";
import { ArrowUpDown } from "lucide-react";

export default function Filters({ 
  searchTerm = "",
  onSearchChange,
  filters = {}, 
  onFilterChange,
  filterOptions = {},
  sortOptions = [],
  sortConfig = null,
  onSortChange,
  onClearFilters
}) {

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const handleSortChange = (newSortConfig) => {
    if (onSortChange) {
      onSortChange(newSortConfig);
    }
  };

  const activeFilters = hasActiveFilters(filters, searchTerm);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
      <div className="flex flex-wrap gap-3">
        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />

        {Object.entries(filterOptions).map(([key, options]) => (
          <Dropdown
            key={key}
            value={filters[key]}
            options={options}
            onOptionSelect={(option) => handleFilterChange(key, option.value)}
            placeholder={key}
            data-filter-button
          />
        ))}

        {sortOptions.length > 0 && (
          <Dropdown
            options={sortOptions}
            onOptionSelect={(option) => handleSortChange({ field: option.value, direction: option.direction })}
            isSelected={(option) => sortConfig?.field === option.value && sortConfig?.direction === option.direction}
            icon={<ArrowUpDown className="h-4 w-4" />}
            placeholder="Sort"
            data-filter-button
          />
        )}

        {activeFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            data-clear-filters
          >
            Clear All
          </button>
        )}
      </div>

      {activeFilters && (
        <ActiveFilters
          filters={filters}
          filterOptions={filterOptions}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  );
} 