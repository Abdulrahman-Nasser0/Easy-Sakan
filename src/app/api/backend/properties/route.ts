import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "../proxy";

/**
 * GET /api/backend/properties
 * Proxy: GET /api/properties (public, no auth needed)
 * Filters: ?page=1&pageSize=10&search=...&location=...&minPrice=...&maxPrice=...&gender=...&sortBy=...&sortOrder=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Build query string from client params
  const endpoint = `/api/properties?${searchParams.toString()}`;

  return proxyToBackend(endpoint, { method: "GET" });
}
