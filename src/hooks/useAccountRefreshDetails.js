import { useEffect, useState } from 'react';

import { fetchUserRefreshDetails } from '@/lib/services/userService';

export const useAccountRefreshDetails = fnrkUserId => {
  const [refreshDetails, setRefreshDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRefreshDetails = async () => {
    if (!fnrkUserId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserRefreshDetails(fnrkUserId);
      setRefreshDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch refresh details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefreshDetails();
  }, [fnrkUserId]);

  return {
    refreshDetails,
    loading,
    error,
    refetch: loadRefreshDetails
  };
};
