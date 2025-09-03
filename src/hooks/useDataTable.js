'use client';

import { useState, useCallback, useMemo } from 'react';

export const useDataTable = (initialData = [], options = {}) => {
  const {
    initialFilters = {},
    initialSortConfig = null,
    initialSearchTerm = '',
    filterOptions = {},
    sortOptions = []
  } = options;

  // State management
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter handlers
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setSortConfig(null);
  }, []);

  // Sort handlers
  const handleSortChange = useCallback(newSortConfig => {
    setSortConfig(newSortConfig);
  }, []);

  // Search handlers
  const handleSearchChange = useCallback(term => {
    setSearchTerm(term);
  }, []);

  // Data update handlers
  const updateData = useCallback(newData => {
    setData(newData);
  }, []);

  const setLoading = useCallback(loading => {
    setIsLoading(loading);
  }, []);

  const setErrorState = useCallback(errorState => {
    setError(errorState);
  }, []);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      Object.values(filters).some(value => value && value !== '' && value !== 'all') || searchTerm
    );
  }, [filters, searchTerm]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value && value !== '' && value !== 'all') {
        count++;
      }
    });
    if (searchTerm) count++;
    return count;
  }, [filters, searchTerm]);

  return {
    // Data
    data,
    updateData,

    // Filters
    filters,
    handleFilterChange,
    handleClearFilters,
    hasActiveFilters,
    activeFiltersCount,

    // Search
    searchTerm,
    handleSearchChange,

    // Sort
    sortConfig,
    handleSortChange,

    // Loading & Error
    isLoading,
    setLoading,
    error,
    setErrorState,

    // Options
    filterOptions,
    sortOptions
  };
};
