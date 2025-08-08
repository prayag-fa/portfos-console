import { mockUsers, mockJourneys, mockJourneyTimeline, mockRefreshTimeline } from '@/lib/data/mockData';

class DataRepository {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }
}

class UserService extends DataRepository {
  async getUsers() {
    const cacheKey = 'users';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const users = Object.values(mockUsers);
    this.setCache(cacheKey, users);
    return users;
  }

  async getUserById(userId) {
    const cacheKey = `user-${userId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 50));
    
    const user = mockUsers[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    this.setCache(cacheKey, user);
    return user;
  }

  async refreshUser(userId) {
    // Simulate refresh operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear user cache
    this.cache.delete(`user-${userId}`);
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'User data refreshed successfully'
    };
  }
}

class JourneyService extends DataRepository {
  async getJourneys(userId) {
    const cacheKey = `journeys-${userId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 150));
    
    const journeys = mockJourneys[userId] || mockJourneys["default"] || [];
    this.setCache(cacheKey, journeys);
    return journeys;
  }

  async getJourneyDetails(userId, journeyId) {
    const cacheKey = `journey-${userId}-${journeyId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 100));
    
    const timeline = mockJourneyTimeline[userId] || [];
    const journey = timeline.find(j => j.journeyId === journeyId);
    
    if (!journey) {
      throw new Error(`Journey ${journeyId} not found for user ${userId}`);
    }
    
    this.setCache(cacheKey, journey);
    return journey;
  }

  async getRefreshDetails(userId) {
    const cacheKey = `refresh-${userId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 100));
    
    const refreshData = mockRefreshTimeline[userId] || {
      status: 'completed',
      refreshTime: new Date().toISOString(),
      duration: '2m 30s',
      accountsCount: 3,
      timeline: []
    };
    
    this.setCache(cacheKey, refreshData);
    return refreshData;
  }
}

class DashboardService extends DataRepository {
  async getDashboardMetrics() {
    const cacheKey = 'dashboard-metrics';
    const cached = this.getCache(cacheKey);
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
    
    this.setCache(cacheKey, metrics);
    return metrics;
  }

  async getActivityData() {
    const cacheKey = 'activity-data';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Generate mock activity data for the past 7 days
    const activityData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      newUsers: Math.floor(Math.random() * 5) + 1,
      newJourneys: Math.floor(Math.random() * 8) + 2,
      newAccounts: Math.floor(Math.random() * 12) + 3
    }));
    
    this.setCache(cacheKey, activityData);
    return activityData;
  }
}

// Service instances
export const userService = new UserService();
export const journeyService = new JourneyService();
export const dashboardService = new DashboardService();

// Service factory for dependency injection
export class ServiceFactory {
  static getUserService() {
    return userService;
  }

  static getJourneyService() {
    return journeyService;
  }

  static getDashboardService() {
    return dashboardService;
  }
} 