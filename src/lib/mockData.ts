/**
 * Backend Configuration - Simple Toggle
 * Set NO_BACKEND_MODE = true to use mock data and disable all API calls
 * Set NO_BACKEND_MODE = false to use real backend API
 */

export const NO_BACKEND_MODE = true ; // ← Change to true to enable mock mode

import { LoginResponse, AuthStatusResponse } from "./types";

export const mockLoginResponse: LoginResponse = {
  message: "Login successful",
  isAuthenticated: true,
  username: "testuser",
  email: "test@example.com",
  token: "mock_jwt_token_xyz123",
  refreshTokenExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  emailConfirmed: true,
  roles: ["User"],
};

export const mockAuthStatus: AuthStatusResponse = {
  isAuthenticated: true,
  username: "testuser",
  userId: "mock_user_123",
  email: "test@example.com",
  roles: ["User"],
  tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockRegisterResponse: LoginResponse = {
  message: "Account created successfully",
  isAuthenticated: true,
  username: "newuser",
  email: "newuser@example.com",
  token: "mock_jwt_token_new_456",
  refreshTokenExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  emailConfirmed: false,
  roles: ["User"],
};
