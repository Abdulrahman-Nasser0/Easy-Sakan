import { NextRequest } from "next/server";

/**
 * POST /api/backend/properties/[id]/images
 * Proxy: POST /api/properties/:id/images (auth required, FormData)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData();

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/properties/${params.id}/images`;
  const { getSession } = await import("@/lib/session");
  const session = await getSession();

  if (!session?.token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error(`[API Proxy] Error uploading images:`, error);
    return Response.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
