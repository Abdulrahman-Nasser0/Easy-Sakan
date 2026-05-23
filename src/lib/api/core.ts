"use server";
import { ApiResponse } from '../types';
import { getSession, createSession } from '../session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ==========================================
// GENERIC API CALL FUNCTION
// ==========================================

export async function apiCall<T>(
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

// Helper for file uploads (multipart/form-data)
export async function uploadFile<T>(
  endpoint: string,
  token: string,
  file: File,
  fieldName: string
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await response.text();
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        isSuccess: false,
        message: "Failed to upload file",
        messageAr: "فشل في رفع الملف",
        data: null as T,
        errors: [`Invalid response: ${responseText.substring(0, 100)}`],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }
    return data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
      messageAr: "فشل في رفع الملف",
      data: null as T,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function uploadFiles<T>(
  endpoint: string,
  token: string,
  files: File[],
  fieldName: string,
  extraFields?: Record<string, string>
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await response.text();
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        isSuccess: false,
        message: "Failed to upload files",
        messageAr: "فشل في رفع الملفات",
        data: null as T,
        errors: [`Invalid response: ${responseText.substring(0, 100)}`],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }
    return data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to upload files",
      messageAr: "فشل في رفع الملفات",
      data: null as T,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

// Circular reference handled inline
import { refreshTokenApi } from './auth';
