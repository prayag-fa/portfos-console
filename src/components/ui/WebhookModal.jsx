'use client';

import { X, Webhook, RotateCcw, Clock } from 'lucide-react';

import { getStatusTextColor, getRelativeTime, getTooltipText } from '@/lib/utils/formatters';

export default function WebhookModal({
  isOpen,
  onClose,
  step,
  accountId,
  webhookData,
  onRetrigger
}) {
  if (!isOpen || !step) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-gray-200 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-lg bg-blue-100'>
              <Webhook className='size-5 text-blue-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Webhook Details</h3>
              <p className='mt-1 text-sm text-gray-600'>
                {step.name}
                {accountId && ` - ${accountId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600'
            aria-label='Close modal'
          >
            <X size={20} />
          </button>
        </div>

        <div className='max-h-[calc(90vh-140px)] overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Webhook Status */}
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex items-center gap-4'>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusTextColor(step.status)}`}
                >
                  Status: {step.status}
                </span>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Clock className='size-4' />
                  <span className='cursor-help' title={getTooltipText(step.timestamp)}>
                    {getRelativeTime(step.timestamp)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRetrigger(step.id, accountId)}
                className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                <RotateCcw size={16} className='mr-2' />
                Retrigger Webhook
              </button>
            </div>

            {/* Webhook URL and Method */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Webhook URL</label>
                <div className='break-all rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800'>
                  {webhookData.url}
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Method</label>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800'>
                  {webhookData.method}
                </div>
              </div>
            </div>

            {/* Request Headers */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Request Headers
              </label>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <pre className='overflow-x-auto text-xs text-gray-800'>
                  {JSON.stringify(webhookData.headers, null, 2)}
                </pre>
              </div>
            </div>

            {/* Request Body */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Request Body</label>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <pre className='overflow-x-auto text-xs text-gray-800'>
                  {JSON.stringify(webhookData.request, null, 2)}
                </pre>
              </div>
            </div>

            {/* Response */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-700'>Response</label>
                <span
                  className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                    webhookData.response.status >= 200 && webhookData.response.status < 300
                      ? 'bg-green-100 text-green-600'
                      : webhookData.response.status >= 400
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {webhookData.response.status}
                </span>
              </div>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <div className='mb-3'>
                  <div className='mb-1 text-xs font-medium text-gray-600'>Headers:</div>
                  <pre className='overflow-x-auto text-xs text-gray-800'>
                    {JSON.stringify(webhookData.response.headers, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className='mb-1 text-xs font-medium text-gray-600'>Body:</div>
                  <pre className='overflow-x-auto text-xs text-gray-800'>
                    {JSON.stringify(webhookData.response.body, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className='text-xs text-gray-500'>
              Response received at:{' '}
              <span className='cursor-help' title={getTooltipText(webhookData.response.timestamp)}>
                {getRelativeTime(webhookData.response.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
