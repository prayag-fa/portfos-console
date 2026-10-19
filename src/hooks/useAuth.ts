import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import type { LoginCredentials, LoginResponse, UserSession } from '../types/auth';

const persistSession = (res: LoginResponse) => {
  sessionStorage.setItem('accessToken', res.accessToken);
  sessionStorage.setItem('refreshToken', res.refreshToken);
  sessionStorage.setItem('workspace', res.tenant);
  sessionStorage.setItem('username', res.username);
  sessionStorage.setItem('role', res.role);
};

export const getSession = (): UserSession | null => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) return null;
  return {
    accessToken,
    refreshToken: sessionStorage.getItem('refreshToken') ?? '',
    workspace: sessionStorage.getItem('workspace') ?? '',
    username: sessionStorage.getItem('username') ?? '',
    role: sessionStorage.getItem('role') ?? '',
  };
};

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (res) => {
      persistSession(res);
      navigate('/', { replace: true });
    },
  });

  const logout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return { loginMutation, logout, session: getSession() };
};
