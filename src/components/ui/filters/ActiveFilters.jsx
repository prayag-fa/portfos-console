import { X } from 'lucide-react';

export default function ActiveFilters({
  filters,
  filterOptions,
  searchTerm,
  onFilterChange,
  onSearchChange,
  colors: _colors
}) {
  const getFilterLabel = (key, value) => {
    const options = filterOptions[key];
    if (options) {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  const removeFilter = key => {
    onFilterChange(key, null);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className='mt-2 border-t border-gray-200 pt-2'>
      <div className='flex flex-wrap gap-2'>
        {searchTerm && (
          <div className='flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'>
            <span>Search: &quot;{searchTerm}&quot;</span>
            <button
              onClick={clearSearch}
              className='rounded-full p-1 transition-colors duration-200 hover:bg-blue-200'
            >
              <X className='size-3' />
            </button>
          </div>
        )}

        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          return (
            <div
              key={key}
              className='flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800'
            >
              <span>
                {key}: {getFilterLabel(key, value)}
              </span>
              <button
                onClick={() => removeFilter(key)}
                className='rounded-full p-1 transition-colors duration-200 hover:bg-gray-200'
              >
                <X className='size-3' />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
