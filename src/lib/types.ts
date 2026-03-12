export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export type SignUpState = {
  errors?: {
    userName?: string[];
    fullName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
} | undefined;

export interface UserActionsProps {
  isAuthenticated?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  message: string;
  messageAr?: string;
  data: T;
  errors?: string[];
  statusCode: number;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  message: string | null;
  isAuthenticated: boolean;
  username: string;
  email: string;
  roles: string[];
  token: string;
  emailConfirmed: boolean;
  refreshTokenExpiration: string;
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  username: string | null;
  userId: string;
  email: string;
  roles: string[];
  tokenExpiry: string | null;
}