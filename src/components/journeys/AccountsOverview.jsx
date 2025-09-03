'use client';

export default function AccountsOverview({ accounts }) {
  if (!accounts || accounts.length === 0) return null;

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <h2 className='mb-3 text-base font-semibold text-gray-900'>Accounts Overview</h2>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
        {accounts.map(account => (
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
  );
}
