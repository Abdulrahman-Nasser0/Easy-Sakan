import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "./types";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  token: string;
  emailConfirmed: boolean;
  refreshTokenExpiration: string;
  profileImage: string | null;
  isVerified: boolean;
  expiresAt: Date;
};

export interface SessionData {
  userId: number;
  email: string;
  name: string;
  token: string;
  role: UserRole;
  emailConfirmed: boolean;
  refreshTokenExpiration: string;
  profileImage: string | null;
  isVerified: boolean;
}

const SESSION_COOKIE_NAME = 'easy_sakan_session';
const REFRESH_TOKEN_COOKIE_NAME = 'easy_sakan_refresh';

export async function createSession(
  userId: number,
  email: string,
  name: string,
  token: string,
  role: UserRole,
  isVerified: boolean,
  refreshTokenExpiration: string,
  profileImage: string | null = null
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({
    userId,
    email,
    name,
    token,
    role,
    emailConfirmed: isVerified,
    refreshTokenExpiration,
    profileImage,
    isVerified,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  if (process.env.NODE_ENV === "development") {
    console.log("🔐 Session created for user:", email, "role:", role, "expires:", expiresAt.toISOString());
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);

  if (process.env.NODE_ENV === "development") {
    console.log("🔓 Session deleted successfully");
  }
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    return JSON.parse(sessionCookie) as SessionData;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionData | null> {
  try {
    if (!session || session.trim() === "") {
      return null;
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Session verified for:", payload.email);
    }
    
    return payload as unknown as SessionData;
  } catch (error) {
    if (session && session.trim() !== "") {
      console.warn("⚠️ Session verification failed:", error instanceof Error ? error.message : "Unknown error");
    }
    return null;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

export async function hasRole(...roles: UserRole[]): Promise<boolean> {
  const session = await getSession();
  return session ? roles.includes(session.role) : false;
}

export async function isVerified(): Promise<boolean> {
  const session = await getSession();
  return session?.isVerified ?? false;
}