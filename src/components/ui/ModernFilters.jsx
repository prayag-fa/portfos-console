import React, { useState } from "react";
import { Filter, SortAsc, SortDesc, ChevronDown, X, Search } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function ModernFilters({ 
  filters, 
  onFiltersChange, 
  sortConfig, 
  onSortChange,
  filterOptions = {},
  sortOptions = []
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSortChange = (key, direction) => {
    onSortChange({ key, direction });
    setActiveDropdown(null);
  };

  const clearFilters = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach(key => {
      clearedFilters[key] = key === 'search' ? '' : 'all';
    });
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== '' && value !== 'all'
  );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? 
      <SortAsc className="w-4 h-4" /> : 
      <SortDesc className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[100] }}>
            <Filter className="w-5 h-5" style={{ color: colors.primary[600] }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
            <p className="text-sm text-gray-600">Refine your data view</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-64 transition-colors duration-200"
            style={{
              '--tw-ring-color': colors.primary[500]
            }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Filter Dropdowns */}
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="relative">
            <button
              onClick={() => toggleDropdown(`filter-${key}`)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border rounded-lg transition-colors duration-200 ${
                filters[key] && filters[key] !== 'all'
                  ? 'border-gray-300'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
              style={{
                backgroundColor: filters[key] && filters[key] !== 'all' ? colors.primary[50] : 'transparent',
                color: filters[key] && filters[key] !== 'all' ? colors.primary[700] : 'inherit',
                borderColor: filters[key] && filters[key] !== 'all' ? colors.primary[500] : 'inherit'
              }}
            >
              <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                activeDropdown === `filter-${key}` ? 'rotate-180' : ''
              }`} />
            </button>

            {activeDropdown === `filter-${key}` && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleFilterChange(key, option.value);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors duration-200 ${
                        filters[key] === option.value ? 'text-gray-700' : 'text-gray-700'
                      }`}
                      style={{
                        backgroundColor: filters[key] === option.value ? colors.primary[50] : 'transparent',
                        color: filters[key] === option.value ? colors.primary[700] : 'inherit'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className="flex items-center gap-2 px-4 py-3 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors duration-200"
          >
            <span className="font-medium">Sort by</span>
            {getSortIcon(sortConfig.key)}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              activeDropdown === 'sort' ? 'rotate-180' : ''
            }`} />
          </button>

          {activeDropdown === 'sort' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-2">
                {sortOptions.map((option) => (
                  <div key={option.key} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => handleSortChange(option.key, 'asc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors duration-200 flex items-center justify-between ${
                        sortConfig.key === option.key && sortConfig.direction === 'asc' 
                          ? 'text-gray-700' 
                          : 'text-gray-700'
                      }`}
                      style={{
                        backgroundColor: sortConfig.key === option.key && sortConfig.direction === 'asc' ? colors.primary[50] : 'transparent',
                        color: sortConfig.key === option.key && sortConfig.direction === 'asc' ? colors.primary[700] : 'inherit'
                      }}
                    >
                      <span>{option.label} (A-Z)</span>
                      <SortAsc className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSortChange(option.key, 'desc')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors duration-200 flex items-center justify-between ${
                        sortConfig.key === option.key && sortConfig.direction === 'desc' 
                          ? 'text-gray-700' 
                          : 'text-gray-700'
                      }`}
                      style={{
                        backgroundColor: sortConfig.key === option.key && sortConfig.direction === 'desc' ? colors.primary[50] : 'transparent',
                        color: sortConfig.key === option.key && sortConfig.direction === 'desc' ? colors.primary[700] : 'inherit'
                      }}
                    >
                      <span>{option.label} (Z-A)</span>
                      <SortDesc className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === '' || value === 'all') return null;
            
            const option = filterOptions[key]?.find(opt => opt.value === value);
            if (!option) return null;

            return (
              <span
                key={key}
                className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full border"
                style={{
                  backgroundColor: colors.primary[100],
                  color: colors.primary[700],
                  borderColor: colors.primary[200]
                }}
              >
                <span className="font-medium">{option.label}</span>
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="hover:opacity-75 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
} 