import { useEffect, useState } from 'react';

import { fetchUserJourneys } from '@/lib/services/userService';

export const useUserJourneys = fnrkUserId => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJourneys = async () => {
    if (!fnrkUserId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserJourneys(fnrkUserId);
      setJourneys(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch user journeys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, [fnrkUserId]);

  return {
    journeys,
    loading,
    error,
    refetch: loadJourneys
  };
};
