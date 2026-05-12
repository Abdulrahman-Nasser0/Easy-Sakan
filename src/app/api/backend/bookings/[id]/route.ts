import { NextRequest } from "next/server";
import { proxyToBackend } from "../../proxy";

/**
 * GET /api/backend/bookings/[id]
 * - Get booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  return proxyToBackend(`/api/bookings/${id}`, {
    method: "GET",
    requireAuth: true,
  });
}
