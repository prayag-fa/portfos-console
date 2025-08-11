import { mockUsers, mockJourneys } from "@/lib/data/mockData";

// Calculate metrics from actual data
export const calculateDashboardMetrics = () => {
  const totalUsers = mockUsers.length;
  const totalJourneys = Object.values(mockJourneys).flat().length;
  const totalAccounts = mockUsers.reduce((sum, user) => sum + user.accountsLinked, 0);
  
  // Calculate journey success rate
  const allJourneys = Object.values(mockJourneys).flat();
  const completedJourneys = allJourneys.filter(j => j.journeyStatus === 'completed').length;
  const failedJourneys = allJourneys.filter(j => j.journeyStatus === 'failed').length;
  const inProgressJourneys = allJourneys.filter(j => j.journeyStatus === 'in_progress').length;

  return {
    totalUsers,
    totalJourneys,
    totalAccounts,
    completedJourneys,
    failedJourneys,
    inProgressJourneys
  };
};

// Generate data for the three charts
export const generateActivityData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    newUsers: ((index * 7 + 1) % 3) + 1,
    newJourneys: ((index * 11 + 2) % 5) + 2,
    newAccounts: ((index * 13 + 3) % 8) + 3
  }));
};

export const generateRefreshData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    successRate: ((index * 17 + 80) % 20) + 80 // 80-100%
  }));
};

export const generateJourneyMetricsData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    avgTime: ((index * 19 + 5) % 10) + 5, // 5-15 minutes
    successRate: ((index * 23 + 75) % 20) + 75 // 75-95%
  }));
}; 