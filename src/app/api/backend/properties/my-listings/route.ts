import { NextRequest } from "next/server";
import { proxyToBackend } from "../../proxy";

/**
 * GET /api/backend/properties/my-listings
 * Proxy: GET /api/properties/my-listings (auth required)
 * Filters: ?page=1&pageSize=10&status=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const endpoint = `/api/properties/my-listings?${searchParams.toString()}`;
  return proxyToBackend(endpoint, { method: "GET", requireAuth: true });
}

/**
 * POST /api/backend/properties/create
 * Proxy: POST /api/properties (auth required)
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend("/api/properties", {
    method: "POST",
    body,
    requireAuth: true,
  });
}
