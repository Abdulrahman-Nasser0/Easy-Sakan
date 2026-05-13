"use server";
import { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, AuthStatusResponse, RegisterResponse } from './types'
import { getSession, createSession } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ==========================================
// GENERIC API CALL FUNCTION
// ==========================================

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

    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
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

    if (error instanceof Response && error.status === 401 && options.headers) {
      const headers = { ...options.headers } as Record<string, string>;
      const session = await getSession();
      if (session?.refreshToken) {
        const refreshResponse = await refreshTokenApi(session.refreshToken);
        if (refreshResponse.isSuccess && refreshResponse.data?.token) {
          await createSession(
            session.userId,
            session.email,
            session.name,
            refreshResponse.data.token,
            session.role,
            session.emailConfirmed,
            session.refreshToken,
            refreshResponse.data.tokenExpiresAt || session.tokenExpiresAt,
            session.profileImage
          );
          headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return apiCall<T>(endpoint, { ...options, headers });
        } else {
          console.error("❌ Token refresh failed");
        }
      }
    }

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
// SECTION 1: AUTHENTICATION API
// ==========================================

export async function loginApi(credentials: LoginRequest) {
  return apiCall<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "text/plain" },
    body: JSON.stringify(credentials),
  });
}

export async function registerApi(userData: RegisterRequest) {
  return apiCall<RegisterResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "text/plain" },
    body: JSON.stringify(userData),
  });
}

export async function logoutApi(token: string, refreshToken: string) {
  return apiCall<boolean>("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
}

export async function authStatusApi(token: string) {
  return apiCall<AuthStatusResponse | null>("/api/auth/status", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function confirmEmailApi(email: string, code: string) {
  return apiCall<null>("/api/auth/confirm-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerificationApi(email: string, verificationType: number) {
  return apiCall<null>("/api/auth/resend-verification-code", {
    method: "POST",
    body: JSON.stringify({ email, verificationType }),
  });
}

export async function forgotPasswordApi(email: string) {
  return apiCall<null>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string) {
  return apiCall<null>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export async function refreshTokenApi(refreshToken: string) {
  return apiCall<LoginResponse>("/api/auth/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}

export async function changePasswordApi(currentPassword: string, newPassword: string, token: string) {
  return apiCall<null>("/api/auth/change-password", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function uploadVerificationDocuments(token: string, fileType: string, file: File) {
  const formData = new FormData();
  formData.append('fileType', fileType);
  formData.append('file', file);

  const url = `${API_URL}/api/auth/upload-verification`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await response.text();
    let data: ApiResponse<any>;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        isSuccess: false,
        message: "Failed to upload verification document",
        messageAr: "فشل في رفع وثيقة التحقق",
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
      message: error instanceof Error ? error.message : "Failed to upload verification document",
      messageAr: "فشل في رفع وثيقة التحقق",
      data: null,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function getVerificationStatus(token: string) {
  return apiCall<any>("/api/auth/verification-status", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 2: PROFILE API
// ==========================================

export async function getProfile(token: string) {
  return apiCall<any>("/api/profile", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(token: string, profileData: any) {
  return apiCall<any>("/api/profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
}

export async function uploadProfileAvatar(token: string, image: File) {
  const formData = new FormData();
  formData.append('image', image);

  const url = `${API_URL}/api/profile/avatar`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await response.text();
    let data: ApiResponse<any>;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        isSuccess: false,
        message: "Failed to upload profile image",
        messageAr: "فشل في رفع صورة الملف الشخصي",
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
      message: error instanceof Error ? error.message : "Failed to upload profile image",
      messageAr: "فشل في رفع صورة الملف الشخصي",
      data: null,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function deleteProfile(token: string, password: string, reason: string) {
  return apiCall<any>("/api/profile", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ password, reason }),
  });
}

// ==========================================
// SECTION 3: PROPERTIES API
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

  return apiCall<any>(`/api/properties?${params.toString()}`, { method: "GET" });
}

export async function getPropertyById(propertyId: number) {
  return apiCall<any>(`/api/properties/${propertyId}`, { method: "GET" });
}

export async function createProperty(token: string, propertyData: any) {
  return apiCall<any>("/api/properties", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(propertyData),
  });
}

export async function updateProperty(token: string, propertyId: number, propertyData: any) {
  return apiCall<any>(`/api/properties/${propertyId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(propertyData),
  });
}

export async function deleteProperty(token: string, propertyId: number) {
  return apiCall<any>(`/api/properties/${propertyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadPropertyImages(token: string, propertyId: number, images: File[], primaryIndex?: number) {
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
      headers: { Authorization: `Bearer ${token}` },
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

export async function deletePropertyImage(token: string, propertyId: number, imageId: number) {
  return apiCall<any>(`/api/properties/${propertyId}/images/${imageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMyListings(token: string, page: number = 1, pageSize: number = 10, status?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (status) params.append('status', status);

  return apiCall<any>(`/api/properties/my-listings?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function togglePropertyAvailability(token: string, propertyId: number, isAvailable: boolean) {
  return apiCall<any>(`/api/properties/${propertyId}/availability`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ isAvailable }),
  });
}

export async function getRecommendedProperties(token: string, page: number = 1, pageSize: number = 10, basedOn: string = "views") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    basedOn,
  });

  return apiCall<any>(`/api/properties/recommended?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 4: BOOKINGS API
// ==========================================

export async function getMyBookings(token: string, page: number = 1, pageSize: number = 10, status?: string) {
  let endpoint = `/api/bookings/my-bookings?page=${page}&pageSize=${pageSize}`;
  if (status) endpoint += `&status=${status}`;

  return apiCall<any>(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getBookingById(token: string, bookingId: number) {
  return apiCall<any>(`/api/bookings/${bookingId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getBookingHistory(token: string, bookingId: number) {
  return apiCall<any>(`/api/bookings/${bookingId}/history`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createBooking(token: string, bookingData: { propertyId: number; checkInDate: string; checkOutDate: string }) {
  return apiCall<any>("/api/bookings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
}

export async function cancelBookingRequest(token: string, bookingId: number, reason?: string) {
  return apiCall<any>(`/api/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
}

export async function getLandlordBookingRequests(token: string, propertyId?: number, status?: string, page: number = 1, pageSize: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (propertyId) params.append('propertyId', propertyId.toString());
  if (status) params.append('status', status);

  return apiCall<any>(`/api/bookings/landlord-requests?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 5: REVIEWS API
// ==========================================

export async function createReview(token: string, reviewData: { propertyId: number; bookingId: number; rating: number; comment?: string }) {
  return apiCall<any>("/api/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
}

export async function getPropertyReviews(propertyId: number, page: number = 1, pageSize: number = 10, sortBy: string = "createdAt", sortOrder: string = "desc") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortOrder,
  });

  return apiCall<any>(`/api/reviews/property/${propertyId}?${params.toString()}`, { method: "GET" });
}

// ==========================================
// SECTION 6: NOTIFICATIONS API
// ==========================================

export async function getNotifications(token: string, page: number = 1, pageSize: number = 20, isRead?: boolean, type?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (isRead !== undefined) params.append('isRead', isRead.toString());
  if (type) params.append('type', type);

  return apiCall<any>(`/api/notifications?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getUnreadNotificationCount(token: string) {
  return apiCall<any>("/api/notifications/unread-count", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markNotificationAsRead(token: string, notificationId: number) {
  return apiCall<any>(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markAllNotificationsAsRead(token: string) {
  return apiCall<any>("/api/notifications/read-all", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteNotification(token: string, notificationId: number) {
  return apiCall<any>(`/api/notifications/${notificationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearReadNotifications(token: string) {
  return apiCall<any>("/api/notifications/clear-read", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 7: ADMIN - USERS API
// ==========================================

export async function adminGetDashboardStats(token: string) {
  return apiCall<any>("/api/admin/dashboard/stats", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetUsers(token: string, page: number = 1, limit: number = 20) {
  return apiCall<any>("/api/admin/users", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetUserDetails(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminApproveUser(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
}

export async function adminRejectUser(token: string, userId: number, reason: string) {
  return apiCall<any>(`/api/admin/users/${userId}/reject`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  });
}

export async function adminDeactivateUser(token: string, userId: number, reason: string) {
  return apiCall<any>(`/api/admin/users/${userId}/deactivate`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  });
}

export async function adminReactivateUser(token: string, userId: number) {
  return apiCall<any>(`/api/admin/users/${userId}/reactivate`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
}

// ==========================================
// SECTION 8: ADMIN - PROPERTIES API
// ==========================================

export async function adminGetProperties(token: string, page: number = 1, pageSize: number = 20, filters?: any) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (filters?.status) params.append("status", filters.status);
  if (filters?.landlordId) params.append("landlordId", filters.landlordId.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.listingMode) params.append("listingMode", filters.listingMode);
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  return apiCall<any>(`/api/admin/properties?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminApproveProperty(token: string, propertyId: number) {
  return apiCall<any>(`/api/admin/properties/${propertyId}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function adminRejectProperty(token: string, propertyId: number, reason: string) {
  const requestBody = {
    status: "REJECTED",
    rejectionReason: reason || "Rejected by admin",
  };
  return apiCall<any>(`/api/admin/properties/${propertyId}/reject`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
}

export async function adminDeleteProperty(token: string, propertyId: number, reason: string, cancelActiveBookings: boolean = true) {
  return apiCall<any>(`/api/admin/properties/${propertyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ reason, cancelActiveBookings }),
  });
}

// ==========================================
// SECTION 9: ADMIN - BOOKINGS API
// ==========================================

export async function adminGetBookings(token: string) {
  return apiCall<any>("/api/admin/bookings", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetBookingDetail(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminConfirmPayment(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/confirm-payment`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminCancelBooking(token: string, bookingId: number, reason: string) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  });
}

export async function adminCompleteBooking(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/complete`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminHandleDispute(token: string, bookingId: number, resolution: string) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/dispute`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ resolution }),
  });
}

export async function adminRefundBooking(token: string, bookingId: number, amount: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/refund`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
}

export async function adminDismissDispute(token: string, bookingId: number) {
  return apiCall<any>(`/api/admin/bookings/${bookingId}/dismiss-dispute`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 10: ADMIN - REVIEWS API
// ==========================================

export async function adminDeleteReview(token: string, reviewId: number) {
  return apiCall<any>(`/api/admin/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ==========================================
// SECTION 11: ADMIN - AUDIT LOG & FRAUD
// ==========================================

export async function adminGetAuditLog(token: string) {
  return apiCall<any>("/api/admin/audit-log", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetFraudDetection(token: string) {
  return apiCall<any>("/api/admin/fraud-detection", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminResolveFraudAlert(token: string, alertId: number, resolution: string) {
  return apiCall<any>(`/api/admin/fraud-detection/${alertId}/resolve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ resolution }),
  });
}

// ==========================================
// SECTION 12: ADMIN - REPORTS API
// ==========================================

export async function adminGetReports(token: string, page: number = 1, pageSize: number = 20, type?: string, status?: string, userId?: number) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (userId) params.append('userId', userId.toString());

  return apiCall<any>(`/api/admin/reports?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateReportStatus(token: string, reportId: number, updateData: { status: string; assignedTo?: number; adminNotes?: string }) {
  return apiCall<any>(`/api/admin/reports/${reportId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
}

// ==========================================
// SECTION 13: SYSTEM API
// ==========================================

export async function getHealthCheck() {
  return apiCall<any>("/api/health", { method: "GET" });
}

export async function getSystemConfig() {
  return apiCall<any>("/api/system/config", { method: "GET" });
}

export async function reportProblem(token: string, reportData: { type: string; subject: string; description: string; relatedBookingId?: number; relatedPropertyId?: number; screenshots?: string[]; deviceInfo?: any }) {
  return apiCall<any>("/api/system/report", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });
}

// ==========================================
// SECTION 14: ML & ANALYTICS API
// ==========================================

export async function predictPrice(token: string, priceData: { location: string; bedrooms: number; bathrooms: number; areaSqm: number; listingMode: string; amenities?: string[] }) {
  return apiCall<any>("/api/ml/predict-price", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(priceData),
  });
}

export async function logUserInteraction(token: string, propertyId: number, interactionType: string) {
  return apiCall<any>("/api/analytics/interaction", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, interactionType }),
  });
}
