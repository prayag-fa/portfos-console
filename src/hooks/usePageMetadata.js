'use client';

import { useEffect, useMemo } from 'react';

import { usePageContext } from '@/lib/context/PageContext';

export const usePageMetadata = (title, breadcrumbs = []) => {
  const { setPageTitle, setBreadcrumbs, clearPageMetadata } = usePageContext();

  // Memoize breadcrumbs to prevent unnecessary re-renders
  const memoizedBreadcrumbs = useMemo(
    () => breadcrumbs,
    [breadcrumbs.length, ...breadcrumbs.map(crumb => crumb.label + crumb.href)]
  );

  useEffect(() => {
    // Set page title
    if (title) {
      setPageTitle(title);
    }

    // Set breadcrumbs
    if (memoizedBreadcrumbs && memoizedBreadcrumbs.length > 0) {
      setBreadcrumbs(memoizedBreadcrumbs);
    }

    // Cleanup function to clear metadata when component unmounts
    return () => {
      clearPageMetadata();
    };
  }, [title, memoizedBreadcrumbs, setPageTitle, setBreadcrumbs, clearPageMetadata]);

  return { setPageTitle, setBreadcrumbs, clearPageMetadata };
};
