'use client';

import EmptyState from './EmptyState';
import Filters from './Filters';

export default function DataTable({
  // Table data and configuration
  data = [],
  columns = [],

  // Filter configuration
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  onClearFilters,
  filterOptions = {},
  sortOptions = [],
  sortConfig = null,
  onSortChange,

  // Table styling
  className = '',
  tableClassName = '',

  // Custom renderers
  renderRow,
  renderEmpty,

  // Loading and error states
  isLoading = false,
  error = null,

  // Pagination (optional)
  pagination = null,
  onPageChange: _onPageChange,

  // Additional props
  ..._props
}) {
  const renderDefaultRow = (item, index) => {
    return (
      <tr
        key={item.id || index}
        className='transition-all duration-200 ease-out hover:bg-gray-50 hover:shadow-sm'
      >
        {columns.map(column => (
          <td key={column.key} className={`whitespace-nowrap px-4 py-3 ${column.className || ''}`}>
            {column.render ? column.render(item[column.key], item, index) : item[column.key]}
          </td>
        ))}
      </tr>
    );
  };

  const renderDefaultEmpty = () => (
    <tr>
      <td colSpan={columns.length} className='px-4 py-8'>
        <EmptyState type='search' onAction={onClearFilters} />
      </td>
    </tr>
  );

  const renderLoading = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className='animate-pulse'>
        <td colSpan={columns.length} className='px-4 py-8 text-center'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='animate-spin rounded-full border-2 border-blue-600 border-t-transparent h-5 w-5' />
            <span className='text-sm text-gray-500 font-medium'>Loading...</span>
          </div>
        </td>
      </tr>
    ));
  };

  const renderError = () => (
    <tr>
      <td colSpan={columns.length} className='px-4 py-8 text-center text-red-500'>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex size-12 items-center justify-center rounded-full bg-red-100'>
            <svg
              className='size-6 text-red-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div>
            <p className='text-sm font-medium text-red-900'>Error loading data</p>
            <p className='text-xs text-red-500'>{error?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm h-full ${className}`}
    >
      {/* Filters Section */}
      {(filterOptions && Object.keys(filterOptions).length > 0) || sortOptions?.length > 0 ? (
        <Filters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          sortConfig={sortConfig}
          onSortChange={onSortChange}
        />
      ) : null}

      {/* Table Section */}
      <div className='flex-1 overflow-hidden'>
        <div className='h-full overflow-auto'>
          <table className={`w-full ${tableClassName}`}>
            <thead className='sticky top-0 z-10 bg-gray-50'>
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.headerClassName || ''}`}
                  >
                    {column.header || column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {isLoading
                ? renderLoading()
                : error
                  ? renderError()
                  : data.length === 0
                    ? (renderEmpty || renderDefaultEmpty)()
                    : data.map((item, index) =>
                        renderRow ? renderRow(item, index) : renderDefaultRow(item, index)
                      )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      {pagination && (
        <div className='sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3'>
          <div className='text-xs text-gray-600'>
            Page {pagination.page + 1} of {pagination.totalPages} • {pagination.totalElements} items
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50'
              disabled={pagination.page <= 0}
              onClick={() => pagination.onChange(Math.max(0, pagination.page - 1), pagination.size)}
            >
              Previous
            </button>
            {pagination.totalPages > 1 && (
              <div className='flex items-center gap-1'>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.page < 2) {
                    pageNum = i;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`rounded-md border px-2 py-1 text-xs ${
                        pageNum === pagination.page
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => pagination.onChange(pageNum, pagination.size)}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
            )}
            <button
              className='rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50'
              disabled={pagination.page >= pagination.totalPages - 1}
              onClick={() =>
                pagination.onChange(
                  Math.min(pagination.totalPages - 1, pagination.page + 1),
                  pagination.size
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
