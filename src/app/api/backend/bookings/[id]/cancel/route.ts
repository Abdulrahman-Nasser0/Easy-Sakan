import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../proxy";

/**
 * PATCH /api/backend/bookings/[id]/cancel
 * - Cancel a booking
 * - Request body: { reason?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json().catch(() => ({}));
  
  return proxyToBackend(`/api/bookings/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(body),
    requireAuth: true,
  });
}
