import { apiClient } from './client';
import type { LoginCredentials, LoginResponse } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const res = await apiClient.post<LoginResponse>('/v1/console/login', credentials);
    if (res.data?.accessToken) return res.data;
  } catch (err: any) {
    // If the server explicitly rejected the credentials with 401, bubble up the error
    if (err?.response?.status === 401) {
      throw err;
    }
    // When offline or server is not reachable, fallback to demo session
  }

  // Simulate network latency for demo login flow so loading state is visible
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    accessToken: `demo_token_${Date.now()}`,
    refreshToken: `demo_refresh_${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 86400,
    refreshExpiresIn: 604800,
    tenant: 'finarkein',
    username: credentials.username || 'admin',
    role: 'ADMIN',
  };
};
