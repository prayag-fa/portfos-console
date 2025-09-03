'use client';

const KPICard = ({ metric }) => {
  return (
    <div className='border-primary-200 rounded-lg border bg-white p-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{metric.name}</p>
          <p className='mt-1 text-2xl font-bold text-gray-900'>{metric.value}</p>
          <p className='mt-1 text-xs text-gray-500'>{metric.description}</p>
        </div>
        <div className='bg-primary-50 flex size-12 items-center justify-center rounded-lg'>
          <metric.icon size={24} className='text-primary-700' />
        </div>
      </div>
      <div className='mt-4 flex items-center'>
        <span
          className={`text-sm font-medium ${
            metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {metric.change}
        </span>
        <span className='ml-2 text-sm text-gray-500'>vs last week</span>
      </div>
    </div>
  );
};

export default KPICard;
