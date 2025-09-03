'use client';

import { Activity, Clock, RefreshCw } from 'lucide-react';

import StatusBadge from '@/components/ui/StatusBadge';
import { getRelativeTime, getTooltipText } from '@/lib/utils/formatters';
export default function RefreshSummary({ refreshData }) {
  return (
    <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-900'>Summary</h3>
        <StatusBadge status={refreshData.status} />
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
        <div className='flex items-center gap-2 rounded-md bg-gray-50 p-3'>
          <div className='flex size-8 items-center justify-center rounded-md bg-blue-100'>
            <Clock className='size-4 text-blue-600' />
          </div>
          <div>
            <p className='text-xs font-medium text-gray-900'>Last Refresh Time</p>
            <span
              className='cursor-help text-xs text-gray-600'
              title={getTooltipText(refreshData.refreshTime)}
            >
              {getRelativeTime(refreshData.refreshTime)}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 rounded-md bg-gray-50 p-3'>
          <div className='flex size-8 items-center justify-center rounded-md bg-green-100'>
            <Activity className='size-4 text-green-600' />
          </div>
          <div>
            <p className='text-xs font-medium text-gray-900'>Last Refresh Duration</p>
            <span className='text-xs text-gray-600'>{refreshData.duration}</span>
          </div>
        </div>

        <div className='flex items-center gap-2 rounded-md bg-gray-50 p-3'>
          <div className='flex size-8 items-center justify-center rounded-md bg-blue-100'>
            <RefreshCw className='text-primary-700 size-4' />
          </div>
          <div>
            <p className='text-xs font-medium text-gray-900'>Total Accounts</p>
            <span className='text-xs text-gray-600'>{refreshData.accounts.length} accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
