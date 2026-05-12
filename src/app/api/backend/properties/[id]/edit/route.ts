import { NextRequest } from "next/server";
import { proxyToBackend } from "../../../proxy";

/**
 * PUT /api/backend/properties/[id]/edit
 * Proxy: PUT /api/properties/:id (auth required)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return proxyToBackend(`/api/properties/${params.id}`, {
    method: "PUT",
    body,
    requireAuth: true,
  });
}

/**
 * DELETE /api/backend/properties/[id]/delete
 * Proxy: DELETE /api/properties/:id (auth required)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(`/api/properties/${params.id}`, {
    method: "DELETE",
    requireAuth: true,
  });
}

/**
 * PUT /api/backend/properties/[id]/availability
 * Proxy: PUT /api/properties/:id/availability (auth required)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return proxyToBackend(`/api/properties/${params.id}/availability`, {
    method: "PUT",
    body,
    requireAuth: true,
  });
}
