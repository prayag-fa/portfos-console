export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  username: string;
  tenant: string;
  role: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  workspace: string;
  username: string;
  role: string;
}
