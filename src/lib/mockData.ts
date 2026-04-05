/**
 * Backend Configuration - Simple Toggle
 * Set NO_BACKEND_MODE = true to use mock data and disable all API calls
 * Set NO_BACKEND_MODE = false to use real backend API
 */

export const NO_BACKEND_MODE = false ; // ← Change to true to enable mock mode

import { fa } from "zod/locales";
import { LoginResponse, AuthStatusResponse, RegisterResponse } from "./types";

export const mockLoginResponse: LoginResponse = {
  token: "mock_jwt_token_xyz123",
  refreshToken: "mock_refresh_token_xyz123",
  tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  user: {
    id: 101,
    email: "student@test.edu",
    role: "Student",
    fullName: "Test Student",
    phone: "+201012345678",
    isVerified: true,
    profileImage: null,
  },
};

export const mockAuthStatus: AuthStatusResponse = {
  userId: 101,
  email: "student@test.edu",
  role: "Student",
  isVerified: true,
  fullName: "Test Student",
};

export const mockRegisterResponse: RegisterResponse = {
  id: 102,
  email: "newstudent@test.edu",
  role: "Student",
  fullName: "New Student",
  isVerified: false,
  token: "mock_jwt_token_new_456",
  refreshToken: "mock_refresh_token_new_456",
  tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};
