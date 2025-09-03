import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAppContext } from '@/lib/context/AppContext';
import { triggerDataFetch } from '@/lib/services/userService';

export const useDataFetchTrigger = (fnrkUserId, currentPage = null, refetchFunction = null) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const router = useRouter();
  const { actions } = useAppContext();

  // Use useRef to track if we're already processing to prevent double calls
  const processingRef = useRef(false);

  const handleTriggerDataFetch = async () => {
    // Prevent double calls using ref
    if (isTriggering || processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsTriggering(true);

    try {
      await triggerDataFetch(fnrkUserId);

      // Show success toast
      const message =
        currentPage === 'journey'
          ? 'Data fetch triggered successfully. Redirecting to accounts page...'
          : currentPage === 'accounts'
            ? 'Data fetch triggered successfully. Refreshing page...'
            : 'Data fetch triggered successfully. Redirecting...';

      actions.setNotification({
        type: 'success',
        message: message,
        duration: 3000
      });

      // Handle navigation based on current page with delay to show toast
      if (currentPage === 'journey') {
        // If on journey page, redirect to accounts page after showing toast
        setTimeout(() => {
          router.push(`/users/${fnrkUserId}/accounts`);
        }, 1500); // Show toast for 1.5 seconds before redirecting
      } else if (currentPage === 'accounts') {
        // If on accounts page, trigger a refetch of the data instead of page refresh
        setTimeout(() => {
          if (refetchFunction && typeof refetchFunction === 'function') {
            refetchFunction();
          }
        }, 1500);
      } else {
        // Default: redirect to accounts page after showing toast
        setTimeout(() => {
          router.push(`/users/${fnrkUserId}/accounts`);
        }, 1500);
      }
    } catch (error) {
      // Show error toast
      actions.setNotification({
        type: 'error',
        message: `Failed to trigger data fetch: ${error.message || 'Unknown error'}`,
        duration: 5000
      });
    } finally {
      setIsTriggering(false);
      processingRef.current = false;
    }
  };

  return {
    isTriggering,
    handleTriggerDataFetch
  };
};
