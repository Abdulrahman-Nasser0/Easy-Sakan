export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export type SignUpState = {
  errors?: {
    role?: string[];
    fullName?: string[];
    email?: string[];
    phone?: string[];
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

export type UserRole = 'Student' | 'Landlord' | 'Admin';
export type VerificationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    fullName: string;
    phone: string;
    isVerified: boolean;
    profileImage: string | null;
  };
}

export interface AuthStatusResponse {
  userId: number;
  email: string;
  role: UserRole;
  isVerified: boolean;
  fullName: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: UserRole;
  fullName: string;
  isVerified: boolean;
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  profileImage: string | null;
  university?: string;
  createdAt: string;
  stats?: {
    totalBookings: number;
    activeBookings: number;
    reviewsGiven: number;
  };
}