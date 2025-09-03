'use client';

const TrendCard = ({ trend }) => {
  return (
    <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
      <div className='flex items-center gap-3'>
        <trend.icon
          size={20}
          className={trend.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}
        />
        <span className='font-medium text-gray-700'>{trend.name}</span>
      </div>
      <div className='text-right'>
        <div className='text-lg font-semibold text-gray-900'>{trend.value}</div>
        <div
          className={`text-sm font-medium ${
            trend.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend.change}
        </div>
      </div>
    </div>
  );
};

export default TrendCard;
