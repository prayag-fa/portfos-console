'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { errorLogger } from '@/lib/utils/errorHandling';
import { clearTokens, setTokens } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // envs
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const WORKSPACE = process.env.NEXT_PUBLIC_WORKSPACE;

  console.log('API_BASE_URL: ', API_BASE_URL);
  console.log('WORKSPACE: ', WORKSPACE);

  const login = async (username, password) => {
    console.log('Logging in user:', username, ' ', password);

    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/${process.env.NEXT_PUBLIC_WORKSPACE}/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientUserId: username,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data?.errorMsg };
      }

      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });

      setUser({
        fnrkUserId: data.fnrkUserId
      });

      return { success: true };
    } catch (error) {
      errorLogger.log(error, { context: 'AuthProvider.login' });
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Restore session on reload if tokens exist else logout
  useEffect(() => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (accessToken) {
        setUser({ isAuthenticated: true });
      } else {
        logout();
      }
    } catch (error) {
      errorLogger.log(error, { context: 'AuthProvider.restoreSession' });
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const requireAuth = callback => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return callback ? callback() : true;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    requireAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
