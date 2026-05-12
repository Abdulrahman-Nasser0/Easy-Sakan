/**
 * API Proxy helper: Safely calls backend from Next API routes.
 * Attaches auth token from session cookie automatically.
 * All requests go to backend via NEXT_PUBLIC_API_URL.
 */

import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export interface ApiProxyOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean; // if true, redirect to login if no session
}

export async function proxyToBackend(
  endpoint: string,
  options: ApiProxyOptions = {}
) {
  const { method = "GET", body, requireAuth = false } = options;

  const session = await getSession();

  if (requireAuth && !session?.token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[API Proxy] Error calling ${endpoint}:`, error);
    return NextResponse.json(
      { error: "Failed to reach backend" },
      { status: 500 }
    );
  }
}
