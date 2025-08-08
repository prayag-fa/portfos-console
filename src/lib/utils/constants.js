// Chart configurations
export const CHART_CONFIG = {
  width: 400,
  height: 200,
  padding: 40,
  gridLines: 5
};

// Status configurations
export const STATUS_CONFIG = {
  completed: {
    color: "#10B981",
    textColor: "#065F46",
    bgColor: "#D1FAE5"
  },
  failed: {
    color: "#EF4444",
    textColor: "#7F1D1D",
    bgColor: "#FEE2E2"
  },
  in_progress: {
    color: "#F59E0B",
    textColor: "#92400E",
    bgColor: "#FEF3C7"
  },
  success: {
    color: "#10B981",
    textColor: "#065F46",
    bgColor: "#D1FAE5"
  }
};

// Table configurations
export const TABLE_CONFIG = {
  pageSize: 10,
  sortDirections: {
    asc: "asc",
    desc: "desc"
  }
};

// Navigation paths
export const PATHS = {
  dashboard: "/dashboard",
  users: "/users",
  userJourneys: (userId) => `/users/${userId}`,
  journeyTimeline: (userId, journeyId) => `/users/${userId}/journey/${journeyId}`,
  refreshDetails: (userId) => `/users/${userId}/refresh`
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  users: "/api/users",
  journeys: "/api/journeys",
  refresh: "/api/refresh"
}; 