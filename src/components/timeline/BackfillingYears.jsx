'use client';

import { useState } from 'react';

import { ChevronRight, X } from 'lucide-react';

import Tooltip from '@/components/ui/Tooltip';
import { stepActions } from '@/lib/config/timelineActions';
import { getRelativeTime, getTooltipText } from '@/lib/utils/formatters';

import ActionButton from '../ui/ActionButton';

export default function BackfillingYears({ yearlyData, index }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Group years by status
  const groupedYears = yearlyData.reduce((acc, yearData) => {
    const status = yearData.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(yearData);
    return acc;
  }, {});

  const getStatusConfig = status => {
    switch (status) {
      case 'success':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✓'
        };
      case 'in_progress':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '✗'
        };
      case 'skipped':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⏭'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '?'
        };
    }
  };

  const handleStatusClick = status => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStatus(null);
  };

  // Get years for selected status
  const selectedYears = selectedStatus ? groupedYears[selectedStatus] || [] : [];

  return (
    <>
      <div className='border-t border-gray-200 pt-2'>
        <div className='mb-1 text-xs font-medium text-gray-600'>
          Years ({yearlyData.length} total)
        </div>

        {/* Status Badges */}
        <div className='flex flex-wrap gap-1'>
          {Object.entries(groupedYears).map(([status, years]) => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm ${config.color}`}
                title={`${years.length} years ${status}`}
              >
                <span className='font-bold'>{years.length}</span>
                <ChevronRight size={10} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 max-h-[80vh] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl'>
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-gray-200 p-3'>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${getStatusConfig(selectedStatus).color}`}
                >
                  {getStatusConfig(selectedStatus).icon} {selectedStatus} ({selectedYears.length})
                </span>
              </div>
              <button
                onClick={closeModal}
                className='inline-flex items-center rounded-lg p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600'
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className='max-h-[60vh] overflow-y-auto p-3'>
              <div className='space-y-2'>
                {selectedYears.map(yearData => (
                  <div
                    key={yearData.year}
                    className='flex flex-col gap-4 rounded-md border border-gray-200 bg-gray-50 p-2 transition-colors duration-200 hover:bg-gray-100'
                  >
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-3'>
                          <span className='font-medium text-gray-900'>{yearData.year}</span>
                          <span
                            className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                              yearData.status === 'success'
                                ? 'bg-green-100 text-green-600'
                                : yearData.status === 'in_progress'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : yearData.status === 'failed'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {yearData.status}
                          </span>
                        </div>
                        {stepActions[index].yearLevelTime && (
                          <Tooltip content={getTooltipText(yearData.timestamp)}>
                            <span className='cursor-help text-xs text-gray-500'>
                              {getRelativeTime(yearData.timestamp)}
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      {stepActions[index].yearLevelTime && (
                        <div className='text-xs text-gray-600'>
                          <span className='font-medium'>Duration:</span> {yearData.duration || '--'}
                        </div>
                      )}
                    </div>
                    {stepActions[index].yearLevelActions &&
                      stepActions[index].yearLevelActions.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {stepActions[index].yearLevelActions.map((action, idx) => (
                            <ActionButton
                              key={idx}
                              icon={action.icon}
                              onClick={action.onClick}
                              title={action.title}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
