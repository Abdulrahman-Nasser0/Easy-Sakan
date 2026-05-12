import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "../../proxy";

/**
 * GET /api/backend/properties/[id]
 * Proxy: GET /api/properties/:id (public)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const endpoint = `/api/properties/${params.id}`;
  return proxyToBackend(endpoint, { method: "GET" });
}
