import { API_ENDPOINTS } from '@/lib/utils/constants';

class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users API
  async getUsers() {
    return this.request(API_ENDPOINTS.users);
  }

  async getUserById(userId) {
    return this.request(`${API_ENDPOINTS.users}/${userId}`);
  }

  // Journeys API
  async getJourneys(userId) {
    return this.request(`${API_ENDPOINTS.journeys}?userId=${userId}`);
  }

  async getJourneyById(journeyId) {
    return this.request(`${API_ENDPOINTS.journeys}/${journeyId}`);
  }

  // Refresh API
  async getRefreshDetails(userId) {
    return this.request(`${API_ENDPOINTS.refresh}/${userId}`);
  }

  async triggerRefresh(userId) {
    return this.request(`${API_ENDPOINTS.refresh}/${userId}`, {
      method: 'POST'
    });
  }
}

export const apiService = new ApiService();

// Auth
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('refreshToken');
};

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};
