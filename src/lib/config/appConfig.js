// Application configuration
export const APP_CONFIG = {
  // App metadata
  name: 'Portfos Console',
  version: '1.0.0',
  description: 'Self Help Portal Dashboard',

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Cache configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    cleanupInterval: 60 * 1000 // 1 minute
  },

  // Performance configuration
  performance: {
    enableMonitoring: process.env.NODE_ENV === 'development',
    logRenderCounts: process.env.NODE_ENV === 'development',
    enableProfiling: process.env.NODE_ENV === 'development'
  },

  // UI configuration
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    animationDuration: 300,
    notificationDuration: 5000,
    debounceDelay: 300
  },

  // Feature flags
  features: {
    enableNotifications: true,
    enableCaching: true,
    enableErrorBoundaries: true,
    enablePerformanceMonitoring: true,
    enableAnalytics: false
  },

  // Table configurations
  tables: {
    users: {
      defaultSort: { key: 'userId', direction: 'asc' },
      pageSize: 10,
      searchFields: ['userId', 'name', 'email'],
      filterOptions: {
        status: [
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ],
        journeyCount: [
          { value: 'all', label: 'All' },
          { value: '0', label: 'No Journeys' },
          { value: '1-3', label: '1-3 Journeys' },
          { value: '4+', label: '4+ Journeys' }
        ],
        lastRefresh: [
          { value: 'all', label: 'All Time' },
          { value: '1h', label: 'Last Hour' },
          { value: '24h', label: 'Last 24 Hours' },
          { value: '7d', label: 'Last 7 Days' },
          { value: '30d', label: 'Last 30 Days' }
        ],
        accountType: [
          { value: 'all', label: 'All Types' },
          { value: 'mutual_funds', label: 'Mutual Funds' },
          { value: 'equities', label: 'Equities' },
          { value: 'deposit', label: 'Deposit' }
        ]
      },
      sortOptions: [
        { key: 'userId', label: 'User ID' },
        { key: 'name', label: 'Name' },
        { key: 'journeyCount', label: 'Journey Count' },
        { key: 'lastRefresh', label: 'Last Refresh' },
        { key: 'accountsCount', label: 'Accounts Count' },
        { key: 'status', label: 'Status' }
      ]
    },
    journeys: {
      defaultSort: { key: 'startTime', direction: 'desc' },
      pageSize: 10,
      searchFields: ['journeyId', 'status', 'accounts'],
      filterOptions: {
        status: [
          { value: 'all', label: 'All Status' },
          { value: 'completed', label: 'Completed' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'failed', label: 'Failed' },
          { value: 'pending', label: 'Pending' }
        ],
        accountType: [
          { value: 'all', label: 'All Types' },
          { value: 'mutual_funds', label: 'Mutual Funds' },
          { value: 'equities', label: 'Equities' },
          { value: 'deposit', label: 'Deposit' }
        ],
        duration: [
          { value: 'all', label: 'All Durations' },
          { value: '0-1m', label: '0-1 Minute' },
          { value: '1-5m', label: '1-5 Minutes' },
          { value: '5-15m', label: '5-15 Minutes' },
          { value: '15m+', label: '15+ Minutes' }
        ],
        startTime: [
          { value: 'all', label: 'All Time' },
          { value: '1h', label: 'Last Hour' },
          { value: '24h', label: 'Last 24 Hours' },
          { value: '7d', label: 'Last 7 Days' },
          { value: '30d', label: 'Last 30 Days' }
        ]
      },
      sortOptions: [
        { key: 'journeyId', label: 'Journey ID' },
        { key: 'journeyStatus', label: 'Status' },
        { key: 'startTime', label: 'Start Time' },
        { key: 'duration', label: 'Duration' },
        { key: 'accountsCount', label: 'Accounts Count' },
        { key: 'endTime', label: 'End Time' }
      ]
    }
  },

  // Dashboard configuration
  dashboard: {
    refreshInterval: 30 * 1000, // 30 seconds
    chartAnimationDuration: 1000,
    maxDataPoints: 50
  },

  // Error handling
  errors: {
    showUserFriendlyMessages: true,
    logToConsole: process.env.NODE_ENV === 'development',
    retryOnError: true,
    maxRetries: 3
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'development':
      return {
        ...APP_CONFIG,
        performance: {
          ...APP_CONFIG.performance,
          enableMonitoring: true,
          logRenderCounts: true
        },
        features: {
          ...APP_CONFIG.features,
          enablePerformanceMonitoring: true
        }
      };

    case 'production':
      return {
        ...APP_CONFIG,
        performance: {
          ...APP_CONFIG.performance,
          enableMonitoring: false,
          logRenderCounts: false
        },
        features: {
          ...APP_CONFIG.features,
          enablePerformanceMonitoring: false
        }
      };

    default:
      return APP_CONFIG;
  }
};

// Configuration utilities
export const getConfig = path => {
  const keys = path.split('.');
  let value = APP_CONFIG;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};

export const setConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = APP_CONFIG;

  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
};

// Feature flag utilities
export const isFeatureEnabled = featureName => {
  return APP_CONFIG.features[featureName] === true;
};

export const getTableConfig = tableName => {
  return APP_CONFIG.tables[tableName] || APP_CONFIG.tables.users;
};
