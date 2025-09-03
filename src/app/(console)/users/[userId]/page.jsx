'use client';

import { useMemo } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { ChevronRight, User, Users } from 'lucide-react';

import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { useDataManager } from '@/hooks/useDataManager';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useUserJourneys } from '@/hooks/useUserJourneys';
import { PATHS } from '@/lib/utils/constants';
import { getRelativeTime, getTooltipText } from '@/lib/utils/formatters';

export default function UserJourneysPage() {
  const params = useParams();
  const userId = params.userId;
  const router = useRouter();

  // Set page metadata
  usePageMetadata('User Details', [
    { label: 'Users', href: '/users', icon: <Users className='size-3' /> },
    {
      label: 'User Details',
      href: `/users/${userId}`,
      icon: <User className='size-3' />,
      isLast: true
    }
  ]);

  // Fetch journeys from API
  const { journeys: apiJourneys, loading, error, refetch } = useUserJourneys(userId);

  // Process API journeys for display
  const userJourneys = useMemo(() => {
    return apiJourneys.map(journey => ({
      id: journey.portfosRequestId,
      journeyStatus: journey.status?.toLowerCase() || 'unknown',
      startTime: journey.createdOn,
      endTime: journey.updatedOn,
      duration: journey.updatedOn
        ? `${Math.round((journey.updatedOn - journey.createdOn) / 1000 / 60)}m ${Math.round(((journey.updatedOn - journey.createdOn) / 1000) % 60)}s`
        : 'In Progress',
      accountsCount: parseInt(journey.totalAccountsInThisJourney) || 0
    }));
  }, [apiJourneys]);

  const {
    data: filteredJourneys,
    searchTerm,
    filters,
    sortConfig,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onClearFilters,
    config
  } = useDataManager('journeys', userJourneys);

  const handleViewJourney = journeyId => {
    router.push(PATHS.journeyTimeline(userId, journeyId));
  };

  const columns = [
    {
      key: 'id',
      header: 'Journey ID',
      headerClassName: 'w-80',
      className: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'startTime',
      header: 'Start Time',
      render: (value, journey) => (
        <div className='flex flex-col gap-1'>
          <span className='text-sm text-gray-900'>{getRelativeTime(value)}</span>
          <span className='text-xs text-gray-400' title={getTooltipText(journey.startTime)}>
            Duration: {journey.duration}
          </span>
        </div>
      )
    },
    {
      key: 'journeyStatus',
      header: 'Status',
      render: value => <StatusBadge status={value} size='sm' />
    },
    {
      key: 'accountsCount',
      header: 'Accounts',
      render: (value, journey) => (
        <div>
          <div className='text-sm text-gray-900'>{value || 0}</div>
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (_, journey) => (
        <Button
          icon={ChevronRight}
          onClick={() => handleViewJourney(journey.id)}
          title='View Journey'
        />
      )
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading journeys...</div>
        </div>
      </PageContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageContainer>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg text-red-600'>Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DataTable
        data={filteredJourneys}
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
      />
    </PageContainer>
  );
}
