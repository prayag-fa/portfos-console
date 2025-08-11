"use client";

import { useState, useMemo, useCallback } from "react";

export const useTableData = (data, options = {}) => {
  const {
    initialFilters = {},
    initialSortConfig = null,
    initialSearchTerm = "",
    filterOptions = {},
    sortOptions = []
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  // Helper function to parse duration strings
  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0;
    
    const match = duration.match(/(\d+)m\s*(\d+)s?/);
    if (match) {
      const minutes = parseInt(match[1]) || 0;
      const seconds = parseInt(match[2]) || 0;
      return minutes + (seconds / 60);
    }
    
    // Try to parse just minutes
    const minutesMatch = duration.match(/(\d+)m/);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]) || 0;
    }
    
    // Try to parse just seconds
    const secondsMatch = duration.match(/(\d+)s/);
    if (secondsMatch) {
      return (parseInt(secondsMatch[1]) || 0) / 60;
    }
    
    return 0;
  };

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        // Search across multiple fields
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          
          switch (key) {
            case 'journeyCount':
              const count = parseInt(itemValue) || 0;
              switch (value) {
                case '0': return count === 0;
                case '1-3': return count >= 1 && count <= 3;
                case '4+': return count >= 4;
                default: return true;
              }
              
            case 'lastRefresh':
              if (!itemValue) return false;
              const refreshTime = new Date(itemValue);
              const now = new Date();
              const diffHours = (now - refreshTime) / (1000 * 60 * 60);
              
              switch (value) {
                case '1h': return diffHours <= 1;
                case '24h': return diffHours <= 24;
                case '7d': return diffHours <= 24 * 7;
                case '30d': return diffHours <= 24 * 30;
                default: return true;
              }
              
            case 'duration':
              if (!itemValue) return false;
              const duration = itemValue;
              const minutes = parseDurationToMinutes(duration);
              
              switch (value) {
                case '0-1m': return minutes <= 1;
                case '1-5m': return minutes > 1 && minutes <= 5;
                case '5-15m': return minutes > 5 && minutes <= 15;
                case '15m+': return minutes > 15;
                default: return true;
              }
              
            case 'startTime':
              if (!itemValue) return false;
              const startTime = new Date(itemValue);
              const timeDiff = (now - startTime) / (1000 * 60 * 60);
              
              switch (value) {
                case '1h': return timeDiff <= 1;
                case '24h': return timeDiff <= 24;
                case '7d': return timeDiff <= 24 * 7;
                case '30d': return timeDiff <= 24 * 30;
                default: return true;
              }
              
            case 'accountType':
              // Check if any account in the item matches the type
              if (item.accounts && Array.isArray(item.accounts)) {
                return item.accounts.some(account => 
                  account.type && account.type.toLowerCase().includes(value.replace('_', ' '))
                );
              }
              return true;
              
            default:
              // Exact match for other fields
              return String(itemValue).toLowerCase() === String(value).toLowerCase();
          }
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters]);

  // Enhanced sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Handle dates
      if (aValue && bValue && !isNaN(new Date(aValue)) && !isNaN(new Date(bValue))) {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        const comparison = aDate - bDate;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Handle duration strings (e.g., "2m 30s")
      if (typeof aValue === 'string' && typeof bValue === 'string' && 
          (aValue.includes('m') || aValue.includes('s'))) {
        const aMinutes = parseDurationToMinutes(aValue);
        const bMinutes = parseDurationToMinutes(bValue);
        const comparison = aMinutes - bMinutes;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Default string comparison
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      const comparison = aStr.localeCompare(bStr);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSortChange = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({});
    setSortConfig(null);
  }, []);

  return {
    data: sortedData,
    searchTerm,
    filters,
    sortConfig,
    onSearchChange: handleSearchChange,
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
    onClearFilters: clearFilters
  };
}; 