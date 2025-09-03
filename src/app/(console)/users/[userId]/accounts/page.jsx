'use client';

import Link from 'next/link';

import { ArrowLeft, FileUser, User, Users } from 'lucide-react';

import RefreshSummary from '@/components/refresh/RefreshSummary';
import TimelineStep from '@/components/timeline/TimelineStep';
import { useAccountRefreshDetails } from '@/hooks/useAccountRefreshDetails';
import { useAnalysisTrigger } from '@/hooks/useAnalysisTrigger';
import { useDataFetchTrigger } from '@/hooks/useDataFetchTrigger';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { refreshStepActions } from '@/lib/config/timelineActions';

export default function AccountsPage({ params }) {
  const { userId } = params;

  // Fetch refresh details from API
  const { refreshDetails, loading, error, refetch } = useAccountRefreshDetails(userId);

  // Data fetch trigger hook - must be called before any conditional returns
  const { isTriggering, handleTriggerDataFetch } = useDataFetchTrigger(
    userId,
    'accounts',
    () => refetch() // Pass refetch function to trigger data refetch
  );

  // Analysis trigger hook - must be called before any conditional returns
  const { isTriggering: isAnalysisTriggering, handleTriggerAnalysis } = useAnalysisTrigger(
    userId,
    'accounts',
    () => refetch() // Pass refetch function to trigger data refetch
  );

  // Set page metadata
  usePageMetadata('User Accounts', [
    { label: 'Users', href: '/users', icon: <Users className='size-3' /> },
    { label: 'User Details', href: `/users/${userId}`, icon: <User className='size-3' /> },
    {
      label: 'User Accounts',
      href: `/users/${userId}/accounts`,
      icon: <FileUser className='size-3' />,
      isLast: true
    }
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className='mx-auto max-w-7xl p-6'>
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Loading...</h2>
          <p className='mb-6 text-gray-600'>Fetching account refresh details...</p>
        </div>
      </div>
    );
  }

  // Show no data state when API returns null/undefined
  if (!refreshDetails) {
    return (
      <div className='mx-auto max-w-7xl p-6'>
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-900'>No Data Available</h2>
          <p className='mb-6 text-gray-600'>No refresh data available for this user.</p>
          <Link
            href={`/users/${userId}`}
            className='inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <ArrowLeft className='mr-2 size-4' />
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='mx-auto max-w-7xl p-6'>
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Error</h2>
          <p className='mb-6 text-gray-600'>Failed to load refresh details: {error}</p>
          <Link
            href={`/users/${userId}`}
            className='inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <ArrowLeft className='mr-2 size-4' />
            Back to User
          </Link>
        </div>
      </div>
    );
  }

  // Map API data to UI format
  const mapApiDataToUI = apiData => {
    const { accountDetails = [], requestDetails = {} } = apiData;

    // Map accounts
    const accounts = accountDetails.map(account => {
      const fromDate = new Date(account.fromTimestamp).toLocaleDateString();
      const toDate = new Date(account.toTimestamp).toLocaleDateString();

      return {
        id: account.fnrkAccountId,
        type: account.fiType,
        maskedNumber: account.maskedAccNo,
        vintage: `${fromDate} - ${toDate}`,
        fipId: account.fipId,
        createdOn: account.createdOn,
        updatedOn: account.updatedOn
      };
    });

    // Map refresh summary
    const refreshSummary = {
      status: requestDetails.status?.toLowerCase() || 'unknown',
      refreshTime: requestDetails.updatedOn,
      duration: '--', // Not available in API
      accounts: accounts
    };

    // Map timeline steps - create proper timeline structure with stepActions
    const timeline = refreshStepActions.map((stepAction, index) => {
      // For the first step (Account Details Fetch), show account data
      if (index === 0) {
        return {
          status: requestDetails.status?.toLowerCase() || 'unknown',
          timestamp: requestDetails.updatedOn,
          duration: '--', // Not available in API
          accounts: (requestDetails.rawDataFetches || []).map(fetch => ({
            id: fetch.fnrkAccountId,
            status: fetch.status?.toLowerCase() || 'unknown',
            timestamp: fetch.dataToTimestamp
          }))
        };
      }
      // For the second step (Analysis), show a completion step
      else {
        return {
          status: requestDetails.status?.toLowerCase() || 'unknown',
          timestamp: requestDetails.updatedOn,
          duration: '--', // Not available in API
          accounts: []
        };
      }
    });

    return {
      refreshSummary,
      accounts,
      timeline
    };
  };

  const mappedData = mapApiDataToUI(refreshDetails);

  return (
    <div className='space-y-4'>
      {/* Loading Overlay */}
      {(isTriggering || isAnalysisTriggering) && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300'>
          <div className='rounded-lg bg-white p-6 shadow-xl'>
            <div className='flex items-center space-x-3'>
              <div className='animate-spin rounded-full border-2 border-blue-600 border-t-transparent h-6 w-6' />
              <span className='text-sm font-medium text-gray-700'>
                {isTriggering ? 'Refreshing data...' : 'Triggering analysis...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Summary */}
      <div
        className={
          isTriggering || isAnalysisTriggering
            ? 'opacity-50 transition-opacity duration-300'
            : 'transition-opacity duration-300'
        }
      >
        <RefreshSummary refreshData={mappedData.refreshSummary} />
      </div>

      {/* Accounts Overview */}
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300'>
        <h2 className='mb-3 text-base font-semibold text-gray-900'>Accounts Overview</h2>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {mappedData.accounts.map(account => (
            <div
              key={account.id}
              className='rounded-md border border-gray-200 p-3 transition-shadow duration-200 hover:shadow-sm'
            >
              <div className='mb-1 flex items-center gap-1'>
                <span className='text-xs font-medium text-gray-900'>{account.fipId}</span>
                <span className='text-xs text-gray-500'>({account.type})</span>
              </div>
              <div className='mb-1 text-xs text-gray-600'>{account.maskedNumber}</div>
              <div className='text-xs text-gray-500 mt-3'>Vintage: {account.vintage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Timeline */}
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300'>
        <h2 className='mb-4 text-base font-semibold text-gray-900'>Last Refresh Timeline</h2>
        <div className='space-y-4'>
          {mappedData.timeline.length > 0 ? (
            mappedData.timeline.map((step, index) => {
              // Create step action with proper handlers
              const stepActionWithHandlers = {
                ...refreshStepActions[index],
                stepLevelActions: refreshStepActions[index]?.stepLevelActions?.map(action => ({
                  ...action,
                  onClick:
                    action.title === 'Re-trigger Data Fetch'
                      ? handleTriggerDataFetch
                      : action.title === 'Re-trigger Data Analysis'
                        ? handleTriggerAnalysis
                        : action.onClick
                })),
                accountLevelActions: refreshStepActions[index]?.accountLevelActions?.map(
                  action => ({
                    ...action,
                    onClick:
                      action.title === 'Re-trigger Data Fetch'
                        ? handleTriggerDataFetch
                        : action.title === 'Re-trigger Data Analysis'
                          ? handleTriggerAnalysis
                          : action.onClick
                  })
                )
              };

              return (
                <TimelineStep
                  key={index}
                  step={step}
                  index={index}
                  totalSteps={refreshStepActions.length}
                  accounts={mappedData.accounts}
                  name={refreshStepActions[index]?.name || 'Data Refresh'}
                  stepAction={stepActionWithHandlers}
                  isTriggering={isTriggering || isAnalysisTriggering}
                />
              );
            })
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>No timeline data available for this refresh.</p>
              <p className='text-sm mt-1'>
                The refresh completed successfully but detailed timeline information is not
                available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
