import {
  mockJourneys,
  mockJourneyTimeline,
  mockRefreshTimeline,
  mockUsers
} from '@/lib/data/mockData';

// Simple cache implementation
const cache = new Map();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const getCache = key => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TIMEOUT) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

const clearCache = () => {
  cache.clear();
};

const clearCacheKey = key => {
  cache.delete(key);
};

// User service functions
export const getUsers = async () => {
  const cacheKey = 'users';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));

  const users = Object.values(mockUsers);
  setCache(cacheKey, users);
  return users;
};

export const getUserById = async userId => {
  const cacheKey = `user-${userId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 50));

  const user = mockUsers[userId];
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  setCache(cacheKey, user);
  return user;
};

export const refreshUser = async userId => {
  // Simulate refresh operation
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Clear user cache
  clearCacheKey(`user-${userId}`);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    message: 'User data refreshed successfully'
  };
};

// Journey service functions
export const getJourneys = async userId => {
  const cacheKey = `journeys-${userId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 150));

  const journeys = mockJourneys[userId] || mockJourneys['default'] || [];
  setCache(cacheKey, journeys);
  return journeys;
};

export const getJourneyDetails = async (userId, journeyId) => {
  const cacheKey = `journey-${userId}-${journeyId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 100));

  const timeline = mockJourneyTimeline[userId] || [];
  const journey = timeline.find(j => j.journeyId === journeyId);

  if (!journey) {
    throw new Error(`Journey ${journeyId} not found for user ${userId}`);
  }

  setCache(cacheKey, journey);
  return journey;
};

export const getRefreshDetails = async userId => {
  const cacheKey = `refresh-${userId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 100));

  const refreshData = mockRefreshTimeline[userId] || {
    status: 'completed',
    refreshTime: new Date().toISOString(),
    duration: '2m 30s',
    accountsCount: 3,
    timeline: []
  };

  setCache(cacheKey, refreshData);
  return refreshData;
};

// Dashboard service functions
export const getDashboardMetrics = async () => {
  const cacheKey = 'dashboard-metrics';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 200));

  const users = Object.values(mockUsers);
  const totalJourneys = Object.values(mockJourneys).flat().length;
  const totalAccounts = users.reduce((sum, user) => sum + (user.accountsCount || 0), 0);

  const metrics = {
    totalUsers: users.length,
    activeJourneys: totalJourneys,
    totalAccounts,
    successRate: 85.5,
    avgJourneyTime: '3m 45s',
    refreshSuccessRate: 92.3,
    avgRefreshTime: '1m 20s'
  };

  setCache(cacheKey, metrics);
  return metrics;
};

export const getActivityData = async () => {
  const cacheKey = 'activity-data';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 150));

  // Generate mock activity data for the past 7 days
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    newUsers: Math.floor(Math.random() * 5) + 1,
    newJourneys: Math.floor(Math.random() * 8) + 2,
    newAccounts: Math.floor(Math.random() * 12) + 3
  }));

  setCache(cacheKey, activityData);
  return activityData;
};

// Cache management exports
export const clearAllCache = clearCache;
export const clearUserCache = userId => clearCacheKey(`user-${userId}`);
export const clearJourneyCache = userId => clearCacheKey(`journeys-${userId}`);
export const clearRefreshCache = userId => clearCacheKey(`refresh-${userId}`);

// Service object for backward compatibility (if needed)
export const dataService = {
  users: {
    getAll: getUsers,
    getById: getUserById,
    refresh: refreshUser
  },
  journeys: {
    getAll: getJourneys,
    getDetails: getJourneyDetails,
    getRefreshDetails
  },
  dashboard: {
    getMetrics: getDashboardMetrics,
    getActivityData
  },
  cache: {
    clear: clearCache,
    clearUser: clearUserCache,
    clearJourney: clearJourneyCache,
    clearRefresh: clearRefreshCache
  }
};
