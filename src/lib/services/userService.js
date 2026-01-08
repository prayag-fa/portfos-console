import axios from 'axios';
import {
  clearRequestQueue,
  clearTokens,
  getAccessToken,
  isTokenRefreshing,
  onRefreshed,
  setTokenRefreshing,
  subscribeTokenRefresh
} from './apiService';

import { refreshAccessToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * REQUEST INTERCEPTOR
 * Pause requests if refresh is in progress
 */
apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  const pauseRequestsOnRefreshToken = config.pauseRequestsOnRefreshToken ?? true;
  const bypassInterceptor = config.bypassInterceptor ?? false;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If refresh is happening & request should pause
  if (!bypassInterceptor && pauseRequestsOnRefreshToken && isTokenRefreshing()) {
    return new Promise(resolve => {
      subscribeTokenRefresh(newToken => {
        config.headers.Authorization = `Bearer ${newToken}`;
        resolve(config);
      });
    });
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Handle 401 + refresh token
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const bypassInterceptor = originalRequest?.bypassInterceptor ?? false;
    const pauseRequestsOnRefreshToken = originalRequest?.pauseRequestsOnRefreshToken ?? true;

    if (error.response?.status !== 401 || bypassInterceptor) {
      return Promise.reject(error);
    }

    // If refresh already happening → queue request
    if (pauseRequestsOnRefreshToken && isTokenRefreshing()) {
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    try {
      setTokenRefreshing(true);

      const newAccessToken = await refreshAccessToken();

      onRefreshed(newAccessToken);
      setTokenRefreshing(false);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      setTokenRefreshing(false);
      clearRequestQueue();
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

const WORKSPACE = process.env.NEXT_PUBLIC_WORKSPACE;

export const fetchUsers = async ({ page = 0, size = 20 } = {}) => {
  try {
    const response = await apiClient.get(`/v1/${WORKSPACE}/u/console/users`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserRefreshDetails = async fnrkUserId => {
  try {
    const response = await apiClient.get(`/users/${fnrkUserId}/refreshDetails`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user refresh details:', error);
    throw error;
  }
};

export const fetchUserJourneys = async fnrkUserId => {
  try {
    const response = await apiClient.get(`/users/${fnrkUserId}/journeys`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user journeys:', error);
    throw error;
  }
};

export const fetchJourneyDetails = async (fnrkUserId, journeyId) => {
  try {
    const response = await apiClient.get(`/users/${fnrkUserId}/journeys/${journeyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching journey details:', error);
    throw error;
  }
};

export const triggerDataFetch = async fnrkUserId => {
  try {
    const response = await apiClient.post(`/users/data/${fnrkUserId}/refresh`, {});
    return response.data;
  } catch (error) {
    console.error('Error triggering data fetch:', error);
    throw error;
  }
};

export const triggerAnalysis = async fnrkUserId => {
  try {
    const response = await apiClient.post(`/users/data/${fnrkUserId}/analyze`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
