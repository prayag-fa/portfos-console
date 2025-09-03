import { useEffect, useState } from 'react';

import { fetchJourneyDetails } from '@/lib/services/userService';

export const useJourneyDetails = (fnrkUserId, journeyId) => {
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJourneyDetails = async () => {
    if (!fnrkUserId || !journeyId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchJourneyDetails(fnrkUserId, journeyId);
      setJourneyDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch journey details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneyDetails();
  }, [fnrkUserId, journeyId]);

  return {
    journeyDetails,
    loading,
    error,
    refetch: loadJourneyDetails
  };
};
