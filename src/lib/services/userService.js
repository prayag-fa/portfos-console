import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_TOKEN;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
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
