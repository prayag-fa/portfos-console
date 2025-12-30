import axios from 'axios';
import { getRefreshToken, setTokens } from './apiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const WORKSPACE = process.env.NEXT_PUBLIC_WORKSPACE;

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const response = await axios.post(
    `${API_BASE_URL}/v1/${WORKSPACE}/token/refresh`,
    {
      refresh_token: refreshToken
    },
    {
      headers: { 'Content-Type': 'application/json' },
      bypassInterceptor: true
    }
  );

  const { access_token, refresh_token } = response.data;

  setTokens({
    accessToken: access_token,
    refreshToken: refresh_token
  });

  return access_token;
};
