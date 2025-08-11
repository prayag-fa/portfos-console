"use client";

import { useState, useMemo, useCallback } from 'react';
import { useTableData } from './useTableData';
import { useUrlParams } from '@/lib/utils/urlParams';

export const useDataManager = (dataType, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getParam, setParam, clearParams } = useUrlParams();

  // Factory for different data types
  const getConfig = useCallback((type) => {
    const configs = {
      users: {
        searchFields: ['clientUserId', 'status'],
        filterOptions: {
          status: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ],
          journeyCount: [
            { value: 'all', label: 'All' },
            { value: '0', label: 'No Journeys' },
            { value: '1-3', label: '1-3 Journeys' },
            { value: '4+', label: '4+ Journeys' }
          ],
          lastRefresh: [
            { value: 'all', label: 'All Time' },
            { value: '1h', label: 'Last Hour' },
            { value: '24h', label: 'Last 24 Hours' },
            { value: '7d', label: 'Last 7 Days' },
            { value: '30d', label: 'Last 30 Days' }
          ],
          accountType: [
            { value: 'all', label: 'All Types' },
            { value: 'mutual_funds', label: 'Mutual Funds' },
            { value: 'equities', label: 'Equities' },
            { value: 'deposit', label: 'Deposit' }
          ]
        },
        sortOptions: [
          { key: 'clientUserId', label: 'User ID' },
          { key: 'journeyCount', label: 'Journey Count' },
          { key: 'accountsLinked', label: 'Accounts Count' },
          { key: 'status', label: 'Status' }
        ]
      },
      journeys: {
        searchFields: ['journeyId', 'status', 'accounts'],
        filterOptions: {
          status: [
            { value: 'all', label: 'All Status' },
            { value: 'completed', label: 'Completed' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'failed', label: 'Failed' },
            { value: 'pending', label: 'Pending' }
          ],
          accountType: [
            { value: 'all', label: 'All Types' },
            { value: 'mutual_funds', label: 'Mutual Funds' },
            { value: 'equities', label: 'Equities' },
            { value: 'deposit', label: 'Deposit' }
          ],
          duration: [
            { value: 'all', label: 'All Durations' },
            { value: '0-1m', label: '0-1 Minute' },
            { value: '1-5m', label: '1-5 Minutes' },
            { value: '5-15m', label: '5-15 Minutes' },
            { value: '15m+', label: '15+ Minutes' }
          ],
          startTime: [
            { value: 'all', label: 'All Time' },
            { value: '1h', label: 'Last Hour' },
            { value: '24h', label: 'Last 24 Hours' },
            { value: '7d', label: 'Last 7 Days' },
            { value: '30d', label: 'Last 30 Days' }
          ]
        },
        sortOptions: [
          { key: 'journeyId', label: 'Journey ID' },
          { key: 'journeyStatus', label: 'Status' },
          { key: 'startTime', label: 'Start Time' },
          { key: 'duration', label: 'Duration' },
          { key: 'accountsCount', label: 'Accounts Count' },
          { key: 'endTime', label: 'End Time' }
        ]
      }
    };
    return configs[type] || configs.users;
  }, []);

  const config = getConfig(dataType);
  
  // Get initial values from URL params if available
  const initialFilters = {};
  Object.keys(config.filterOptions).forEach(key => {
    const urlValue = getParam(key);
    if (urlValue) {
      initialFilters[key] = urlValue;
    }
  });
  
  const initialSearchTerm = getParam('search') || "";
  const initialSortKey = getParam('sort');
  const initialSortDirection = getParam('direction');
  const initialSortConfig = initialSortKey && initialSortDirection ? 
    { key: initialSortKey, direction: initialSortDirection } : null;

  const tableData = useTableData(data, {
    initialFilters,
    initialSortConfig,
    initialSearchTerm,
    filterOptions: config.filterOptions,
    sortOptions: config.sortOptions
  });

  // Enhanced handlers that also update URL params
  const enhancedOnSearchChange = useCallback((term) => {
    tableData.onSearchChange(term);
    setParam('search', term);
  }, [tableData.onSearchChange, setParam]);

  const enhancedOnFilterChange = useCallback((key, value) => {
    tableData.onFilterChange(key, value);
    setParam(key, value);
  }, [tableData.onFilterChange, setParam]);

  const enhancedOnSortChange = useCallback((config) => {
    tableData.onSortChange(config);
    if (config) {
      setParam('sort', config.key);
      setParam('direction', config.direction);
    } else {
      // Clear sort params
      setParam('sort', '');
      setParam('direction', '');
    }
  }, [tableData.onSortChange, setParam]);

  const enhancedOnClearFilters = useCallback(() => {
    tableData.onClearFilters();
    // Clear all URL params using clearParams
    const keysToClear = Object.keys(config.filterOptions).concat(['search', 'sort', 'direction']);
    clearParams(keysToClear);
  }, [tableData.onClearFilters, clearParams, config.filterOptions]);

  const updateData = useCallback((newData) => {
    setData(newData);
    setError(null);
  }, []);

  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const refreshData = useCallback(async (refreshFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await refreshFunction();
      updateData(result);
    } catch (err) {
      setErrorState(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateData, setErrorState]);

  return {
    ...tableData,
    data,
    loading,
    error,
    updateData,
    setLoadingState,
    setErrorState,
    refreshData,
    config,
    // Enhanced handlers with URL persistence
    onSearchChange: enhancedOnSearchChange,
    onFilterChange: enhancedOnFilterChange,
    onSortChange: enhancedOnSortChange,
    onClearFilters: enhancedOnClearFilters,
    // Also expose the original handlers for backward compatibility
    searchTerm: tableData.searchTerm,
    filters: tableData.filters,
    sortConfig: tableData.sortConfig
  };
}; 