import React from "react";
import { X } from "lucide-react";

export default function ActiveFilters({
  filters,
  filterOptions,
  searchTerm,
  onFilterChange,
  onSearchChange,
  colors
}) {
  const getFilterLabel = (key, value) => {
    const options = filterOptions[key];
    if (options) {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  const removeFilter = (key) => {
    onFilterChange(key, null);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="mt-2 pt-2 border-t border-gray-200">
      <div className="flex flex-wrap gap-2">
        {searchTerm && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <span>Search: "{searchTerm}"</span>
            <button
              onClick={clearSearch}
              className="hover:bg-blue-200 rounded-full p-1 transition-colors duration-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          return (
            <div key={key} className="flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              <span>{key}: {getFilterLabel(key, value)}</span>
              <button
                onClick={() => removeFilter(key)}
                className="hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
