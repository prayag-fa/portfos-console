'use client';

import { Search, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

export default function FilterInput({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  icon = 'search',
  options = [],
  className = ''
}) {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search className='size-5 text-gray-400' />;
      case 'calendar':
        return <CalendarIcon className='size-5 text-gray-400' />;
      case 'dropdown':
        return <ChevronDown className='size-5 text-gray-400' />;
      default:
        return <Search className='size-5 text-gray-400' />;
    }
  };

  if (type === 'select') {
    return (
      <div className={`relative ${className}`}>
        <label className='mb-2 block text-sm font-medium text-gray-700'>{label}</label>
        <div className='relative'>
          <select
            className='w-full appearance-none rounded-lg border border-gray-300 bg-white p-3 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={value}
            onChange={onChange}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
            {getIcon()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <label className='mb-2 block text-sm font-medium text-gray-700'>{label}</label>
      <div className='relative'>
        <input
          type={type}
          placeholder={placeholder}
          className='w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={value}
          onChange={onChange}
        />
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          {getIcon()}
        </div>
      </div>
    </div>
  );
}
