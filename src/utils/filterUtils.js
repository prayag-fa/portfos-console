export const hasActiveFilters = (filters, searchTerm) => {
  return Object.values(filters).some(value => 
    value && value !== '' && value !== 'all'
  ) || searchTerm;
};

export const getFilterDisplayName = (key) => {
  return key.replace(/([A-Z])/g, ' $1').toLowerCase();
};

export const getActiveFiltersCount = (filters, searchTerm) => {
  let count = 0;
  
  Object.values(filters).forEach(value => {
    if (value && value !== '' && value !== 'all') {
      count++;
    }
  });
  
  if (searchTerm) {
    count++;
  }
  
  return count;
}; 