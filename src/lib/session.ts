import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const encodedKey = new TextEncoder().encode(secretKey);


type SessionPayload = {
  userId: string;        // from username
  email: string;         // from email
  name: string;          // display name 
  roles: string[];       // user roles array
  token: string;         // JWT token
  emailConfirmed: boolean;     // email verification status
  refreshTokenExpiration: string; // refresh token expiry
  expiresAt: Date;       // session expiry
};

const SESSION_COOKIE_NAME = 'easy_sakan_session';
const REFRESH_TOKEN_COOKIE_NAME = 'easy_sakan_refresh';

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

export async function createSession(userId: string, email: string, name: string, token: string, roles: string[], emailConfirmed: boolean, refreshTokenExpiration: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, email, name, token, expiresAt, roles, emailConfirmed, refreshTokenExpiration });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  if (process.env.NODE_ENV === "development") {
    console.log("🔐 Session created for user:", email, "expires:", expiresAt.toISOString());
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

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
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
    
    return payload as unknown as SessionPayload;
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