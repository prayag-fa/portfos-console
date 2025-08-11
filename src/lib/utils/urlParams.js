"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

// Parse URL search params into an object
export const parseSearchParams = (searchParams) => {
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

// Convert object to URL search params
export const createSearchParams = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, value);
    }
  });
  return searchParams;
};

// Hook to manage URL parameters
export const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = useMemo(() => {
    return parseSearchParams(searchParams);
  }, [searchParams]);

  const updateParams = useCallback((newParams, replace = false) => {
    const updatedParams = { ...currentParams, ...newParams };
    const searchParamsString = createSearchParams(updatedParams).toString();
    const newUrl = searchParamsString ? `?${searchParamsString}` : window.location.pathname;
    
    if (replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  }, [currentParams, router]);

  const clearParams = useCallback((paramKeys = []) => {
    const updatedParams = { ...currentParams };
    paramKeys.forEach(key => {
      delete updatedParams[key];
    });
    const searchParamsString = createSearchParams(updatedParams).toString();
    const newUrl = searchParamsString ? `?${searchParamsString}` : window.location.pathname;
    router.replace(newUrl);
  }, [currentParams, router]);

  const getParam = useCallback((key, defaultValue = "") => {
    return currentParams[key] || defaultValue;
  }, [currentParams]);

  const setParam = useCallback((key, value, replace = false) => {
    updateParams({ [key]: value }, replace);
  }, [updateParams]);

  return {
    currentParams,
    updateParams,
    clearParams,
    getParam,
    setParam
  };
};

// Hook for table filters with URL persistence
export const useTableFilters = (defaultFilters = {}) => {
  const { currentParams, updateParams, clearParams, getParam } = useUrlParams();

  const filters = useMemo(() => {
    const urlFilters = {};
    Object.keys(defaultFilters).forEach(key => {
      const value = getParam(key, defaultFilters[key]);
      if (value && value !== "all") {
        urlFilters[key] = value;
      }
    });
    return urlFilters;
  }, [currentParams, defaultFilters, getParam]);

  const searchTerm = useMemo(() => {
    return getParam("search", "");
  }, [getParam]);

  const sortConfig = useMemo(() => {
    const sortKey = getParam("sort", "");
    const sortDirection = getParam("direction", "");
    if (sortKey && sortDirection) {
      return { key: sortKey, direction: sortDirection };
    }
    return null;
  }, [getParam]);

  const updateFilters = useCallback((newFilters) => {
    updateParams(newFilters);
  }, [updateParams]);

  const updateSearch = useCallback((term) => {
    updateParams({ search: term });
  }, [updateParams]);

  const updateSort = useCallback((config) => {
    if (config) {
      updateParams({ sort: config.key, direction: config.direction });
    } else {
      clearParams(["sort", "direction"]);
    }
  }, [updateParams, clearParams]);

  const clearAllFilters = useCallback(() => {
    const keysToClear = Object.keys(defaultFilters).concat(["search", "sort", "direction"]);
    clearParams(keysToClear);
  }, [clearParams, defaultFilters]);

  return {
    filters,
    searchTerm,
    sortConfig,
    updateFilters,
    updateSearch,
    updateSort,
    clearAllFilters
  };
};
