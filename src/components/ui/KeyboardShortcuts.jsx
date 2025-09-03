'use client';

import { Keyboard, X } from 'lucide-react';

import { KEYBOARD_SHORTCUTS } from '@/lib/utils/keyboardNavigation';

export default function KeyboardShortcuts({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          onClick={onClose}
        />

        {/* Modal */}
        <div className='my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
          {/* Header */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='rounded-lg bg-blue-50 p-2 text-blue-600'>
                <Keyboard className='size-5' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>Keyboard Shortcuts</h3>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 transition-colors duration-200 hover:text-gray-600'
            >
              <X className='size-5' />
            </button>
          </div>

          {/* Content */}
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-3'>
              {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
                <div
                  key={key}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                >
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{shortcut.description}</p>
                  </div>
                  <kbd className='rounded border border-gray-300 bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800'>
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className='mt-6 border-t border-gray-200 pt-4'>
            <p className='text-center text-xs text-gray-500'>
              Press{' '}
              <kbd className='rounded border border-gray-300 bg-gray-200 px-1 py-0.5 text-xs font-semibold text-gray-800'>
                ?
              </kbd>{' '}
              to show this help anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
