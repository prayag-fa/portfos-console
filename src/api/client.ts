import axios from 'axios';

export const apiClient = axios.create({
  // Dev goes through the Vite proxy to avoid CORS
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 3500,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": '1'
  },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  const workspace = sessionStorage.getItem('workspace');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (workspace) {
    config.headers['x-workspace-id'] = workspace;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginRequest = error?.config?.url?.includes('/console/login');
    if (status === 401 && !isLoginRequest) {
      sessionStorage.clear();
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);
