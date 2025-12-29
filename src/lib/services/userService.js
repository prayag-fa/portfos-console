import axios from 'axios';
import { getAccessToken } from './apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUsers = async ({ page = 0, size = 20 } = {}) => {
  try {
    const response = await apiClient.get('/users', {
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
