'use client';

import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

import BackfillingYears from '@/components/timeline/BackfillingYears';
import StatusBadge from '@/components/ui/StatusBadge';
import Tooltip from '@/components/ui/Tooltip';
import { getRelativeTime, getTooltipText } from '@/lib/utils/formatters';

import ActionButton from '../ui/ActionButton';

export default function TimelineStep({
  step,
  index,
  totalSteps,
  accounts,
  name,
  stepAction,
  isTriggering = false
}) {
  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className='size-5 text-green-500' />;
      case 'failed':
        return <XCircle className='size-5 text-red-500' />;
      case 'in_progress':
        return <AlertTriangle className='size-5 text-yellow-500' />;
      default:
        return <Clock className='size-5 text-gray-500' />;
    }
  };

  return (
    <div className='mb-6 flex items-start last:mb-0'>
      <div className='mr-4 flex flex-col items-center'>
        <div className='border-3 flex size-10 items-center justify-center rounded-full border-white bg-white shadow-md'>
          {getStatusIcon(step.status)}
        </div>
        {index < totalSteps - 1 && <div className='mt-3 h-12 w-0.5 bg-gray-300' />}
      </div>

      <div className='flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-900'>{name}</span>
              <StatusBadge status={step.status} />
            </div>
            {stepAction && stepAction.stepLevelTime && (
              <Tooltip content={getTooltipText(step.timestamp)}>
                <span className='cursor-help text-xs text-gray-500'>
                  {getRelativeTime(step.timestamp)}
                </span>
              </Tooltip>
            )}
          </div>
          {stepAction && stepAction.stepLevelTime && (
            <div className='flex items-center justify-between'>
              <div className='text-xs text-gray-600'>
                <span className='font-medium'>Duration:</span> {step.duration || '--'}
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-4'>
          {stepAction && stepAction.stepLevelActions && stepAction.stepLevelActions.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {stepAction.stepLevelActions.map((action, idx) => (
                <ActionButton
                  key={idx}
                  icon={action.icon}
                  onClick={action.onClick}
                  title={action.title}
                  disabled={isTriggering}
                  loading={
                    isTriggering &&
                    (action.title === 'Re-trigger Data Fetch' ||
                      action.title === 'Re-trigger Data Analysis')
                  }
                />
              ))}
            </div>
          )}
          {step.accounts && step.accounts.length > 0 && (
            <div className='border-t border-gray-200 pt-3'>
              <h5 className='mb-2 text-xs font-medium text-gray-700'>Account-wise Actions</h5>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
                {step.accounts.map((account, idx) => {
                  const _account = accounts.find(acc => acc.id === account.id);
                  const accountType = account.type || _account?.type || 'UNKNOWN';

                  // Skip rendering if account type is not supported for Data Back Filling
                  if (
                    !['MUTUAL_FUNDS', 'EQUITIES'].includes(accountType) &&
                    name === 'Data Back Filling'
                  ) {
                    return null;
                  }
                  return (
                    <div
                      key={idx}
                      className='flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-2'
                    >
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='flex items-center gap-1'>
                            <div className='flex items-center gap-1'>
                              {_account?.fipId && (
                                <span className='text-xs font-medium text-gray-900'>
                                  {_account?.fipId}
                                </span>
                              )}
                              <span className='text-xs text-gray-500'>({accountType})</span>
                            </div>
                            <Tooltip content={`Status: ${account.status}`}>
                              <div
                                className={`size-2 rounded-full ${
                                  account.status === 'success'
                                    ? 'bg-green-500'
                                    : account.status === 'partial'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                              />
                            </Tooltip>
                          </div>

                          <div className='flex items-center gap-1'>
                            {stepAction && stepAction.accountLevelTime && (
                              <Tooltip content={getTooltipText(account.timestamp)}>
                                <span className='cursor-help text-xs text-gray-500'>
                                  {getRelativeTime(account.timestamp)}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className='mb-1 text-xs text-gray-600'>{account.maskedNumber}</div>

                        {stepAction && stepAction.accountLevelTime && (
                          <div className='text-xs text-gray-600'>
                            <span className='font-medium'>Duration:</span>{' '}
                            {account.duration || '--'}
                          </div>
                        )}
                      </div>
                      {stepAction &&
                        stepAction.accountLevelActions &&
                        stepAction.accountLevelActions.length > 0 && (
                          <div className='flex flex-wrap gap-2'>
                            {stepAction.accountLevelActions.map((action, idx) => (
                              <ActionButton
                                key={idx}
                                icon={action.icon}
                                onClick={action.onClick}
                                title={action.title}
                                disabled={isTriggering}
                                loading={isTriggering && action.title === 'Re-trigger Data Fetch'}
                              />
                            ))}
                          </div>
                        )}

                      {name === 'Data Back Filling' && account.yearlyData && (
                        <BackfillingYears
                          yearlyData={account.yearlyData}
                          accountId={account.id}
                          index={index}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
