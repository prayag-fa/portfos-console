"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const PageContext = createContext();

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};

export const PageProvider = ({ children }) => {
  const [pageMetadata, setPageMetadata] = useState({
    title: "Dashboard",
    breadcrumbs: []
  });

  const setPageTitle = useCallback((title) => {
    setPageMetadata(prev => ({ ...prev, title }));
  }, []);

  const setBreadcrumbs = useCallback((breadcrumbs) => {
    setPageMetadata(prev => ({ ...prev, breadcrumbs }));
  }, []);

  const updatePageMetadata = useCallback((metadata) => {
    setPageMetadata(metadata);
  }, []);

  const clearPageMetadata = useCallback(() => {
    setPageMetadata({
      title: "Dashboard",
      breadcrumbs: []
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    pageMetadata,
    setPageTitle,
    setBreadcrumbs,
    updatePageMetadata,
    clearPageMetadata
  }), [pageMetadata, setPageTitle, setBreadcrumbs, updatePageMetadata, clearPageMetadata]);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};
