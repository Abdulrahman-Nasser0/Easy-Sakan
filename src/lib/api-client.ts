/**
 * Client-side API wrapper for calling Next.js proxy routes.
 * This replaces the direct backend calls and keeps the client/server boundary clean.
 *
 * All functions here call /api/backend/* routes which handle auth safely.
 */

import { ApiResponse } from "./types";

/**
 * Generic fetch wrapper for client-side API calls
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `/api/backend${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        isSuccess: false,
        message: data.message || `HTTP ${response.status}`,
        data: null as T,
        errors: data.errors || [],
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Network error",
      data: null as T,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

// ==========================================
// PROPERTIES
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
    if (filters.search) params.append("search", filters.search);
    if (filters.location) params.append("location", filters.location);
    if (filters.university) params.append("university", filters.university);
    if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.rentalType) params.append("rentalType", filters.rentalType);
    if (filters.amenities) params.append("amenities", filters.amenities);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.includeSoldOut) params.append("includeSoldOut", "true");
    if (filters.minRating) params.append("minRating", filters.minRating.toString());
  }

  return apiCall<any>(`/properties?${params.toString()}`, { method: "GET" });
}

export async function getPropertyById(propertyId: number) {
  return apiCall<any>(`/properties/${propertyId}`, { method: "GET" });
}

export async function createProperty(propertyData: any) {
  return apiCall<any>("/properties/my-listings", {
    method: "POST",
    body: JSON.stringify(propertyData),
  });
}

export async function updateProperty(
  propertyId: number,
  propertyData: any
) {
  return apiCall<any>(`/properties/${propertyId}/edit`, {
    method: "PUT",
    body: JSON.stringify(propertyData),
  });
}

export async function deleteProperty(propertyId: number) {
  return apiCall<any>(`/properties/${propertyId}/edit`, {
    method: "DELETE",
  });
}

export async function togglePropertyAvailability(
  propertyId: number,
  isAvailable: boolean
) {
  return apiCall<any>(`/properties/${propertyId}/edit`, {
    method: "PATCH",
    body: JSON.stringify({ isAvailable }),
  });
}

export async function uploadPropertyImages(
  propertyId: number,
  images: File[],
  primaryIndex?: number
) {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });
  if (primaryIndex !== undefined) {
    formData.append("primaryIndex", primaryIndex.toString());
  }

  try {
    const response = await fetch(`/api/backend/properties/${propertyId}/images`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to upload images",
      data: null,
      errors: [error instanceof Error ? error.message : "Unknown error"],
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function deletePropertyImage(
  propertyId: number,
  imageId: number
) {
  return apiCall<any>(`/properties/${propertyId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function getMyListings(
  page: number = 1,
  pageSize: number = 10,
  status?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (status) params.append("status", status);

  return apiCall<any>(`/properties/my-listings?${params.toString()}`, {
    method: "GET",
  });
}
