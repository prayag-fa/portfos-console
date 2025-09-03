'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ChevronRight, RefreshCw, Users } from 'lucide-react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { useDataManager } from '@/hooks/useDataManager';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useUsers } from '@/hooks/useUsers';
import { useAppContext } from '@/lib/context/AppContext';
import { triggerDataFetch } from '@/lib/services/userService';
import { PATHS } from '@/lib/utils/constants';
import { getRelativeTime } from '@/lib/utils/formatters';

export default function ConsoleUsersPage() {
  const router = useRouter();
  const [refreshingUserId, setRefreshingUserId] = useState(null);
  const { actions } = useAppContext();

  // Set page metadata
  usePageMetadata('Users', [
    { label: 'Users', href: '/users', icon: <Users className='size-3' />, isLast: true }
  ]);

  // Fetch users from API
  const {
    users: apiUsers,
    loading,
    error,
    refetch,
    page,
    size,
    totalElements,
    totalPages,
    setPage,
    setSize
  } = useUsers();

  // Process API users for filtering
  const usersArray = useMemo(() => {
    return apiUsers.slice(0, 1000).map(user => ({
      ...user,
      // Map API fields to expected format
      accountsLinked: parseInt(user.totalAccounts) || 0,
      journeyCount: parseInt(user.totalJourneys) || 0,
      lastJourneyTime: user.lastJourneyDate ? new Date(user.lastJourneyDate) : null
    }));
  }, [apiUsers]);

  const {
    data: filteredUsers,
    searchTerm,
    filters,
    sortConfig,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onClearFilters,
    config
  } = useDataManager('users', usersArray);

  const handleViewJourney = userId => {
    router.push(PATHS.userJourneys(userId));
  };

  const handleViewRefreshDetails = userId => {
    // Add a small delay to show the transition
    setTimeout(() => {
      router.push(PATHS.accounts(userId));
    }, 100);
  };

  const handleRefresh = async userId => {
    setRefreshingUserId(userId);
    try {
      await triggerDataFetch(userId);
      actions.setNotification({
        type: 'success',
        message: 'Data fetch triggered successfully',
        duration: 3000
      });
    } catch (error) {
      actions.setNotification({
        type: 'error',
        message: `Failed to trigger data fetch: ${error.message || 'Unknown error'}`,
        duration: 5000
      });
    } finally {
      setRefreshingUserId(null);
    }
  };

  const getStatusIndicator = status => {
    switch (status) {
      case 'success':
      case 'completed':
        return <div className='size-2 rounded-full bg-green-500' title='Success' />;
      case 'failed':
        return <div className='size-2 rounded-full bg-red-500' title='Failed' />;
      case 'in_progress':
        return <div className='size-2 rounded-full bg-yellow-500' title='In Progress' />;
      default:
        return <div className='size-2 rounded-full bg-gray-400' title='Unknown' />;
    }
  };

  const columns = [
    {
      key: 'clientUserId',
      header: 'User ID',
      headerClassName: 'w-80',
      render: value => <div className='text-sm font-medium text-gray-900'>{value}</div>
    },

    {
      key: 'accountsLinked',
      header: 'Accounts',
      render: (value, user) => (
        <div className='flex flex-col gap-1'>
          <button
            onClick={() => handleViewRefreshDetails(user.fnrkUserId)}
            className='flex items-center gap-1 rounded transition-all duration-150 ease-out hover:text-blue-600 hover:scale-[1.02] active:scale-[0.98]'
            title='View Accounts'
          >
            <span className='text-sm font-medium'>{value || 0} accounts</span>
            <ChevronRight className='size-4 text-blue-600' />
          </button>
          {user.lastRefresh && (
            <div className='mt-0.5 flex items-center gap-1 text-xs text-gray-500'>
              Last Refresh: {getRelativeTime(user.lastRefresh.time)}{' '}
              {getStatusIndicator(user.lastRefresh?.status)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'journeyCount',
      header: 'Journeys',
      render: (value, user) => (
        <div className='flex flex-col gap-1'>
          <button
            onClick={() => handleViewJourney(user.fnrkUserId)}
            className='flex items-center gap-1 rounded transition-all duration-200 ease-out hover:text-blue-600'
            title='View Journeys'
          >
            <span className='text-sm font-medium'>{value || 0} journeys</span>
            <ChevronRight className='size-4 text-blue-600' />
          </button>
          {user.lastJourneyTime && (
            <div className='mt-0.5 flex items-center gap-1 text-xs text-gray-500'>
              Last Journey: {getRelativeTime(user.lastJourneyTime)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'refreshTime',
      header: '',
      render: (_, user) => (
        <Button
          icon={RefreshCw}
          onClick={() => handleRefresh(user.fnrkUserId)}
          title='Refresh Data for User'
          loading={refreshingUserId === user.fnrkUserId}
        >
          Refresh Data
        </Button>
      )
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className='flex items-center justify-center h-64'>
          <div className='flex items-center space-x-3'>
            <div className='animate-spin rounded-full border-2 border-blue-600 border-t-transparent h-6 w-6' />
            <span className='text-lg font-medium text-gray-700'>Loading users...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className='flex items-center justify-center h-64'>
          <div className='flex flex-col items-center space-y-3'>
            <div className='flex size-16 items-center justify-center rounded-full bg-red-100'>
              <svg
                className='size-8 text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div className='text-center'>
              <p className='text-lg font-medium text-red-900'>Error loading users</p>
              <p className='text-sm text-red-500'>{error}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        filterOptions={config.filterOptions}
        sortOptions={config.sortOptions}
        sortConfig={sortConfig}
        onSortChange={onSortChange}
        isLoading={loading}
        pagination={{
          page,
          size,
          totalElements,
          totalPages,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setSize(nextSize);
            refetch(nextPage, nextSize);
          }
        }}
      />
    </ProtectedRoute>
  );
}
