'use client';

import { RefreshCw } from 'lucide-react';

const ActionButton = ({ icon, onClick, title, disabled = false, loading = false }) => {
  const Icon = icon;
  return (
    <button
      className={`inline-flex items-center justify-center rounded border border-gray-200 p-2 text-xs font-medium transition-all duration-150 ease-out min-w-[32px] min-h-[32px] ${
        disabled || loading
          ? 'cursor-not-allowed bg-gray-100 text-gray-400'
          : 'text-gray-700 hover:bg-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onClick}
      title={title}
      disabled={disabled || loading}
    >
      <div className='relative'>
        <Icon size={16} className={loading ? 'opacity-0' : 'opacity-100'} />
        {loading && <RefreshCw size={16} className='animate-spin absolute inset-0' />}
      </div>
    </button>
  );
};

export default ActionButton;
