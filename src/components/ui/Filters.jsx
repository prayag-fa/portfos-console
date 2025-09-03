'use client';

import { ArrowUpDown } from 'lucide-react';

import { hasActiveFilters } from '@/utils/filterUtils';

import ActiveFilters from './filters/ActiveFilters';
import Dropdown from './filters/Dropdown';
import SearchInput from './filters/SearchInput';

export default function Filters({
  searchTerm = '',
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

  const handleSortChange = newSortConfig => {
    if (onSortChange) {
      onSortChange(newSortConfig);
    }
  };

  const activeFilters = hasActiveFilters(filters, searchTerm);

  return (
    <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-wrap gap-3'>
        <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

        {Object.entries(filterOptions).map(([key, options]) => (
          <Dropdown
            key={key}
            value={filters[key]}
            options={options}
            onOptionSelect={option => handleFilterChange(key, option.value)}
            placeholder={key}
            data-filter-button
          />
        ))}

        {sortOptions.length > 0 && (
          <Dropdown
            options={sortOptions}
            onOptionSelect={option =>
              handleSortChange({ field: option.value, direction: option.direction })
            }
            isSelected={option =>
              sortConfig?.field === option.value && sortConfig?.direction === option.direction
            }
            icon={<ArrowUpDown className='size-4' />}
            placeholder='Sort'
            data-filter-button
          />
        )}

        {activeFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className='rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
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
