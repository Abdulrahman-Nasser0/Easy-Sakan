import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/dashboard", "/profile", '/settings'];
const publicRoutes = ["/login", "/signup", "/", "/forgot-password", "/verify-email"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users from auth pages
  if (isPublicRoute && session?.userId && (path === "/" || path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/verify-email")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

//Run Proxy on all routes except for these paths (for performance)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

/*
    ✅ Proxy RUNS on:
    - /
    - /login
    - /signup  
    - /dashboard

    ❌ Proxy SKIPS:
    - /api/users
    - /_next/static/css/app.css
    - /_next/image/photo.jpg
    - /logo.png
*/

/*

User Flow:

 UNAUTHENTICATED USERS:
┌─────────────────────────┐
│ / (Home)                │ ← Browse properties, see features
│ ├─ Sign In → /login     │ 
│ └─ Sign Up → /signup    │
└─────────────────────────┘

 AUTHENTICATED USERS:
┌─────────────────────────┐
│ /dashboard              │ ← Overview, bookings, reservations
│ ├─ /shop                │ ← Browse properties
│ └─ /profile             │ ← Settings, logout
└─────────────────────────┘
*/