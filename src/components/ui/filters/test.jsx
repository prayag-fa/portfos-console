import { ChevronDown, Check } from 'lucide-react';

export default function FilterDropdown({
  filterKey,
  filterValue,
  options,
  isActive,
  onFilterChange,
  onToggle
}) {
  const selectedOption = options.find(option => option.value === filterValue);

  return (
    <div className='relative'>
      <button
        onClick={() => onToggle(`filter-${filterKey}`)}
        className='flex min-w-[150px] items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors duration-200 hover:bg-gray-50'
      >
        <span className='text-sm font-medium text-gray-700'>
          {selectedOption ? selectedOption.label : filterKey}
        </span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
        />
      </button>

      {isActive && (
        <div className='absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg'>
          <div className='py-1'>
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onFilterChange(filterKey, option.value);
                  onToggle(`filter-${filterKey}`);
                }}
                className='flex w-full items-center justify-between px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50'
              >
                {filterValue === option.value && <Check className='size-3.5' />}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
