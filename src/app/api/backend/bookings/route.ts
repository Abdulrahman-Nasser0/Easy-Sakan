import { NextRequest } from "next/server";
import { proxyToBackend } from "../proxy";

/**
 * GET /api/backend/bookings
 * - Returns bookings for authenticated user (student or landlord)
 * - Student: gets their own bookings
 * - Landlord: gets bookings on their properties
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";
  const status = searchParams.get("status");
  
  let endpoint = `/api/bookings?page=${page}&pageSize=${pageSize}`;
  
  if (status) {
    endpoint += `&status=${status}`;
  }
  
  return proxyToBackend(endpoint, { 
    method: "GET",
    requireAuth: true 
  });
}

/**
 * POST /api/backend/bookings
 * - Create a new booking (student only)
 * - Request body: { propertyId, checkInDate, checkOutDate }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return proxyToBackend("/api/bookings", {
    method: "POST",
    body: JSON.stringify(body),
    requireAuth: true,
  });
}
