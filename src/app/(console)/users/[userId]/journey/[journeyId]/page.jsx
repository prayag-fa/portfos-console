'use client';
import React from 'react';

import Link from 'next/link';

import { ArrowLeft, BarChart3, User, Users } from 'lucide-react';

import AccountsOverview from '@/components/journeys/AccountsOverview';
import JourneySummary from '@/components/journeys/JourneySummary';
import TimelineStep from '@/components/timeline/TimelineStep';
import WebhookModal from '@/components/ui/WebhookModal';
import { useAnalysisTrigger } from '@/hooks/useAnalysisTrigger';
import { useDataFetchTrigger } from '@/hooks/useDataFetchTrigger';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { stepActions } from '@/lib/config/timelineActions';
import { getWebhookData } from '@/lib/services/webhookService';

export default function JourneyTimelinePage({ params }) {
  const { userId, journeyId } = params;

  const [webhookModal, setWebhookModal] = React.useState({
    show: false,
    step: null,
    accountId: null
  });

  // Set page metadata
  usePageMetadata('Journey Timeline', [
    { label: 'Users', href: '/users', icon: <Users className='size-3' /> },
    { label: 'User Details', href: `/users/${userId}`, icon: <User className='size-3' /> },
    {
      label: 'Journey Timeline',
      href: `/users/${userId}/journey/${journeyId}`,
      icon: <BarChart3 className='size-3' />,
      isLast: true
    }
  ]);

  // Fetch journey details from API
  const { journeyDetails, loading, error, refetch } = useJourneyDetails(userId, journeyId);

  // Process API data for display
  const journey = React.useMemo(() => {
    if (!journeyDetails) return null;

    const timeline = journeyDetails.journeyTimeline;
    const accounts =
      timeline?.rawDataFetches?.map(fetch => {
        // Calculate vintage from timestamps if available
        let vintage = 'N/A';
        if (fetch.dataFromTimestamp && fetch.dataToTimestamp) {
          const fromDate = new Date(fetch.dataFromTimestamp).toLocaleDateString();
          const toDate = new Date(fetch.dataToTimestamp).toLocaleDateString();
          vintage = `${fromDate} - ${toDate}`;
        }

        return {
          id: fetch.fnrkAccountId,
          type: fetch.fiType,
          maskedNumber: fetch.maskedAccNo,
          fipId: fetch.fipId,
          accType: fetch.accType,
          status: fetch.status?.toLowerCase() || 'unknown',
          vintage: vintage,
          createdOn: fetch.createdOn,
          updatedOn: fetch.updatedOn
        };
      }) || [];

    return {
      id: timeline?.portfosRequestId,
      journeyStartTime: journeyDetails.createdOn,
      journeyDuration: journeyDetails.updatedOn
        ? `${Math.round((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000 / 60)}m ${Math.round(((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000) % 60)}s`
        : 'In Progress',
      journeyStatus: timeline?.status?.toLowerCase() || 'unknown',
      accounts: accounts,
      timeline: [
        {
          status: timeline?.status?.toLowerCase() || 'unknown',
          timestamp: timeline?.updatedOn || timeline?.createdOn,
          duration: journeyDetails.updatedOn
            ? `${Math.round((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000 / 60)}m ${Math.round(((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000) % 60)}s`
            : 'In Progress',
          accounts:
            timeline?.rawDataFetches?.map(fetch => ({
              id: fetch.fnrkAccountId,
              status: fetch.status?.toLowerCase() || 'unknown',
              timestamp: timeline.updatedOn || timeline.createdOn
            })) || []
        },
        {
          status:
            timeline?.analyzedFlows?.[0]?.status?.toLowerCase() ||
            timeline?.status?.toLowerCase() ||
            'unknown',
          timestamp: timeline?.updatedOn || timeline?.createdOn,
          duration: journeyDetails.updatedOn
            ? `${Math.round((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000 / 60)}m ${Math.round(((journeyDetails.updatedOn - journeyDetails.createdOn) / 1000) % 60)}s`
            : 'In Progress',
          accounts: [],
          flowName: timeline?.analyzedFlows?.[0]?.flowName || 'Analysis',
          fluxRequestId: timeline?.analyzedFlows?.[0]?.fluxRequestId
        }
      ]
    };
  }, [journeyDetails]);

  // Data fetch trigger hook - must be after journey data is processed
  const { isTriggering, handleTriggerDataFetch } = useDataFetchTrigger(
    userId,
    'journey',
    () => refetch() // Pass refetch function to trigger data refetch
  );

  // Analysis trigger hook - must be after journey data is processed
  const { isTriggering: isAnalysisTriggering, handleTriggerAnalysis } = useAnalysisTrigger(
    userId,
    'journey',
    () => refetch() // Pass refetch function to trigger data refetch
  );

  // Show loading state
  if (loading) {
    return (
      <div className='mx-auto max-w-7xl'>
        <div className='py-12 text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Loading Journey...</h1>
          <p className='mb-6 text-gray-600'>Please wait while we fetch the journey details.</p>
        </div>
      </div>
    );
  }

  // Show not found state when API returns null/undefined
  if (!journeyDetails) {
    return (
      <div className='mx-auto max-w-7xl'>
        <div className='py-12 text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Journey Not Found</h1>
          <p className='mb-6 text-gray-600'>The requested journey could not be found.</p>
          <Link
            href={`/users/${userId}`}
            className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <ArrowLeft className='mr-2 size-4' />
            Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='mx-auto max-w-7xl'>
        <div className='py-12 text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Error Loading Journey</h1>
          <p className='mb-6 text-gray-600'>Failed to load journey details: {error}</p>
          <Link
            href={`/users/${userId}`}
            className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <ArrowLeft className='mr-2 size-4' />
            Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  const closeWebhookModal = () => {
    setWebhookModal({ show: false, step: null, accountId: null });
  };

  const _openWebhookModal = (step, accountId = null) => {
    setWebhookModal({ show: true, step, accountId });
  };

  const handleRetriggerWebhook = (accountId, _year = null) => {
    // TODO: Implement webhook retrigger API call
  };

  const _handleRetriggerDataFetch = (accountId, _year = null) => {
    // TODO: Implement data fetch retrigger API call
  };

  return (
    <div className='space-y-4'>
      <JourneySummary journey={journey} />
      <AccountsOverview accounts={journey.accounts} />

      {/* Timeline */}
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        <h3 className='mb-4 text-base font-semibold text-gray-900'>Journey Timeline</h3>
        <div className='relative'>
          {journey.timeline.map((step, index) => {
            // Create step action with proper handlers
            const baseStepAction = index === 0 ? stepActions[1] : stepActions[3];
            const stepActionWithHandlers = {
              ...baseStepAction,
              stepLevelActions: baseStepAction.stepLevelActions?.map(action => ({
                ...action,
                onClick:
                  action.title === 'Re-trigger Data Fetch'
                    ? handleTriggerDataFetch
                    : action.title === 'Re-trigger Data Analysis'
                      ? handleTriggerAnalysis
                      : action.onClick
              })),
              accountLevelActions: baseStepAction.accountLevelActions?.map(action => ({
                ...action,
                onClick:
                  action.title === 'Re-trigger Data Fetch'
                    ? handleTriggerDataFetch
                    : action.title === 'Re-trigger Data Analysis'
                      ? handleTriggerAnalysis
                      : action.onClick
              }))
            };

            return (
              <TimelineStep
                key={index}
                step={step}
                index={index}
                totalSteps={journey.timeline.length}
                accounts={journey.accounts}
                name={index === 0 ? 'Account Details Fetch' : 'Analysis'}
                stepAction={stepActionWithHandlers}
                isTriggering={isTriggering || isAnalysisTriggering}
              />
            );
          })}
        </div>
      </div>

      <WebhookModal
        isOpen={webhookModal.show}
        onClose={closeWebhookModal}
        step={webhookModal.step}
        accountId={webhookModal.accountId}
        webhookData={
          webhookModal.step
            ? getWebhookData(webhookModal.step, webhookModal.accountId, userId)
            : null
        }
        onRetrigger={handleRetriggerWebhook}
      />
    </div>
  );
}
