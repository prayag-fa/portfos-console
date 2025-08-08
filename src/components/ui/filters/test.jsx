
export default function FilterDropdown({
  filterKey,
  filterValue,
  options,
  isActive,
  onFilterChange,
  onToggle,
}) {
  const selectedOption = options.find(option => option.value === filterValue);

  return (
    <div className="relative">
            <button
        onClick={() => onToggle(`filter-${filterKey}`)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[150px]"
      >
              <span className="text-sm font-medium text-gray-700">
                {selectedOption ? selectedOption.label : filterKey}
            </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isActive ? 'rotate-180' : ''
              }`} />
            </button>

            {isActive && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange(filterKey, option.value);
                        onToggle(`filter-${filterKey}`);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                      {filterValue === option.value && <Check className="w-3.5 h-3.5" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
  );
}
