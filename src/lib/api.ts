"use server";
import { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, AuthStatusResponse, RegisterResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {  

  const url = `${API_URL}${endpoint}`;
  
  try {
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    
    const responseText = await response.text();

    // Check if response is empty
    if (!responseText || responseText.trim() === '') {
      return {
        isSuccess: false,
        message: `Our servers are temporarily unavailable. Please try again in a few moments.`,
        messageAr: "الخادم أرجع استجابة فارغة",
        data: null as T,
        errors: [`HTTP ${response.status}: Empty response body`],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }

    // Try to parse JSON
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Invalid JSON:', responseText);
      return {
        isSuccess: false,
        message: "We're experiencing technical difficulties. Please try again later.",
        messageAr: "استجابة JSON غير صالحة من الخادم",
        data: null as T,
        errors: [`Invalid JSON: ${responseText.substring(0, 100)}...`],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }
    

    return data;
    
  } catch (error) {
    console.error("❌ API call failed:", error);
    console.error('🔗 Failed URL:', url);

    // Refresh token 
    if (error instanceof Response && error.status === 401 && options.headers) {
      const headers = { ...options.headers } as Record<string, string>;
      const session = await getSession();
      if (session?.refreshTokenExpiration) {
        const refreshResponse = await refreshTokenApi(session.refreshTokenExpiration);
        if (refreshResponse.isSuccess && refreshResponse.data?.token) {
          await createSession(
            session.userId,
            session.email,
            session.name,
            refreshResponse.data.token,
            session.role,
            session.emailConfirmed,
            refreshResponse.data.tokenExpiresAt,
            session.profileImage
          );
          // Retry the original request with the new token
          headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return apiCall<T>(endpoint, { ...options, headers });
        } else {
          console.error("❌ Token refresh failed");
        }
      }
    }

    // Return error in backend format
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Unable to connect to our servers. Please check your internet connection and try again.",
      messageAr: "حدث خطأ في الشبكة",
      data: null as T,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

// ==========================================
// AUTH API CALLS
// ==========================================

// Login API call
export async function loginApi(credentials: LoginRequest) {
  

  return apiCall<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain",
    },
    body: JSON.stringify(credentials),
  });
}

// Register API call
export async function registerApi(userData: RegisterRequest) {
  return apiCall<RegisterResponse>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain",
    },
    body: JSON.stringify(userData),
  });
}

// Logout API call
export async function logoutApi(token: string) {
  return apiCall<boolean>("/api/Auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Auth Status
export async function authStatusApi(token: string) {
  return apiCall<AuthStatusResponse | null>("/api/Auth/status", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Confirm Email
export async function confirmEmailApi(email: string, code: string) {
  return apiCall<null>("/api/auth/confirm-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

// Resend Verification Code
export async function resendVerificationApi(email: string, verificationType: number) {
  return apiCall<null>("/api/auth/resend-verification-code", {
    method: "POST",
    body: JSON.stringify({ email, verificationType }),
  });
}

// Forgot Password
export async function forgotPasswordApi(email: string) {
  return apiCall<null>("/api/Auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Reset Password
export async function resetPasswordApi(
  email: string,
  code: string,
  newPassword: string,
  confirmPassword: string
) {
  return apiCall<null>("/api/Auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword, confirmPassword }),
  });
}

// Refresh Token
export async function refreshTokenApi(refreshToken: string) {
  return apiCall<LoginResponse>("/api/Auth/refresh-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
}

// Change Password
export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  token: string
) {
  return apiCall<null>("/api/Auth/change-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
}

// ==========================================
// ADMIN API CALLS
// ==========================================

export async function adminGetDashboardStats(token: string) {
  return apiCall<any>("/api/admin/dashboard/stats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetUsers(token: string, page: number = 1, limit: number = 20) {
  return apiCall<any>("/api/admin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetUserDetails(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminApproveUser(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}

export async function adminRejectUser(token: string, userId: number, reason: string) {
  return apiCall<any>(`/api/admin/users/${userId}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
}

export async function adminDeactivateUser(token: string, userId: number, reason: string) {
  return apiCall<any>(`/api/admin/users/${userId}/deactivate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
}

export async function adminReactivateUser(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}/reactivate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetProperties(token: string) {
  return apiCall<any>("/api/admin/properties", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminApproveProperty(token: string, propertyId: number) {
  return apiCall<any>(`/api/admin/properties/${propertyId}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminRejectProperty(token: string, propertyId: number, reason: string) {
  return apiCall<any>(`/api/admin/properties/${propertyId}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
}

export async function adminDeleteProperty(token: string, propertyId: number) {
  return apiCall<any>(`/api/admin/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetBookings(token: string) {
  return apiCall<any>("/api/admin/bookings", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetBookingDetail(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminConfirmPayment(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/confirm-payment`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminCancelBooking(token: string, bookingId: number, reason: string) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
}

export async function adminCompleteBooking(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/complete`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminHandleDispute(token: string, bookingId: number, resolution: string) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/dispute`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resolution }),
  });
}

export async function adminRefundBooking(token: string, bookingId: number, amount: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/refund`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
}

export async function adminDismissDispute(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/dismiss-dispute`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminDeleteReview(token: string, reviewId: number) {
  return apiCall<any>(`/api/admin/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetAuditLog(token: string) {
  return apiCall<any>("/api/admin/audit-log", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminGetFraudDetection(token: string) {
  return apiCall<any>("/api/admin/fraud-detection", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function adminResolveFraudAlert(token: string, alertId: number, resolution: string) {
  return apiCall<any>(`/api/admin/fraud-detection/${alertId}/resolve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resolution }),
  });
}

// ==========================================
// PROPERTIES API CALLS
// ==========================================

export async function getAllProperties(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    location?: string;
    university?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    rentalType?: string;
    amenities?: string;
    sortBy?: string;
    sortOrder?: string;
    includeSoldOut?: boolean;
    minRating?: number;
  }
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters) {
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.university) params.append('university', filters.university);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.rentalType) params.append('rentalType', filters.rentalType);
    if (filters.amenities) params.append('amenities', filters.amenities);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.includeSoldOut) params.append('includeSoldOut', 'true');
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
  }

  return apiCall<any>(`/api/properties?${params.toString()}`, {
    method: "GET",
  });
}

export async function getPropertyById(propertyId: number) {
  return apiCall<any>(`/api/properties/${propertyId}`, {
    method: "GET",
  });
}

export async function createProperty(token: string, propertyData: any) {
  return apiCall<any>("/api/properties", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  });
}

export async function uploadPropertyImages(
  token: string,
  propertyId: number,
  images: File[],
  primaryIndex?: number
) {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('images', image);
  });
  if (primaryIndex !== undefined) {
    formData.append('primaryIndex', primaryIndex.toString());
  }

  const url = `${API_URL}/api/properties/${propertyId}/images`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    let data: ApiResponse<any>;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        isSuccess: false,
        message: "Failed to upload images",
        messageAr: "فشل في رفع الصور",
        data: null,
        errors: [`Invalid response: ${responseText.substring(0, 100)}`],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }
    return data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to upload images",
      messageAr: "فشل في رفع الصور",
      data: null,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function deletePropertyImage(
  token: string,
  propertyId: number,
  imageId: number
) {
  return apiCall<any>(`/api/properties/${propertyId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProperty(
  token: string,
  propertyId: number,
  propertyData: any
) {
  return apiCall<any>(`/api/properties/${propertyId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  });
}

export async function deleteProperty(token: string, propertyId: number) {
  return apiCall<any>(`/api/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMyListings(
  token: string,
  page: number = 1,
  pageSize: number = 10,
  status?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (status) params.append('status', status);

  return apiCall<any>(`/api/properties/my-listings?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function togglePropertyAvailability(
  token: string,
  propertyId: number,
  isAvailable: boolean
) {
  return apiCall<any>(`/api/properties/${propertyId}/availability`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isAvailable }),
  });
}

import { getSession, createSession } from "./session";