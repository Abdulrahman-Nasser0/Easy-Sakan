"use server";
import { createSession, deleteSession, getSession } from "./session";
import { redirect } from "next/navigation";
import { loginApi, registerApi, logoutApi, authStatusApi } from "./api";
import { LoginRequest, RegisterRequest, LoginState, SignUpState, UserRole } from "./types";
import { loginSchema, signUpSchema } from "./validation";

// ==========================================
// LOGIN ACTION
// ==========================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(_prevState: any, formData: FormData): Promise<LoginState> {
  // 1. Validate form data
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  // 2. Call backend API
  const response = await loginApi({ email, password });

  // 3. Handle API response
  if (!response.isSuccess) {
    console.log("Login API response:", response); // Debug log
    
    return {
      errors: {
        email: [response.message || "Login failed. Please try again."],
      },
      message: response.message || "Login failed",
    };
  }

  // 4. Check if we have the required data
  if (!response.data || !response.data.token) {
    return {
      errors: {
        email: ["We encountered an issue while logging you in. Please try again."],
      },
      message: "Login failed",
    };
  }

  const { token, refreshToken, tokenExpiresAt, user } = response.data;

  // 5. Create session with user data
  await createSession(
    user.id,
    user.email,
    user.fullName,
    token,
    user.role as UserRole,
    user.isVerified,
    tokenExpiresAt,
    user.profileImage || null
  );

  // 6. Redirect based on role
  if (user.role === 'Student') {
    redirect("/dashboard");
  } else if (user.role === 'Landlord') {
    redirect("/dashboard");
  } else if (user.role === 'Admin') {
    redirect("/admin/dashboard");
  }
}

// ==========================================
// SIGNUP ACTION
// ==========================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signUp(_prevState: any, formData: FormData): Promise<SignUpState> {
  // 1. Validate form data
  const result = signUpSchema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { role, fullName, email, phone, password } = result.data;

  // 2. Call backend API
  const response = await registerApi({
    role: role as UserRole,
    fullName,
    email,
    phone,
    password,
  });

  // 3. Handle API response
  if (!response.isSuccess) {
    // Map backend errors to form fields
    const fieldErrors: {
      role?: string[];
      fullName?: string[];
      email?: string[];
      phone?: string[];
      password?: string[];
      confirmPassword?: string[];
    } = {};
    
    if (response.errors && Array.isArray(response.errors)) {
      response.errors.forEach((error: any) => {
        const errorMessage = typeof error === 'string' ? error : error.message || '';
        const errorField = typeof error === 'object' ? error.field : '';
        const lowerError = errorMessage.toLowerCase();
        
        if (errorField === 'email' || lowerError.includes("email")) {
          fieldErrors.email = fieldErrors.email || [];
          fieldErrors.email.push(errorMessage);
        } else if (errorField === 'phone' || lowerError.includes("phone")) {
          fieldErrors.phone = fieldErrors.phone || [];
          fieldErrors.phone.push(errorMessage);
        } else if (errorField === 'password' || lowerError.includes("password")) {
          fieldErrors.password = fieldErrors.password || [];
          fieldErrors.password.push(errorMessage);
        } else if (errorField === 'fullName' || lowerError.includes("name")) {
          fieldErrors.fullName = fieldErrors.fullName || [];
          fieldErrors.fullName.push(errorMessage);
        } else if (errorField === 'role' || lowerError.includes("role")) {
          fieldErrors.role = fieldErrors.role || [];
          fieldErrors.role.push(errorMessage);
        }
      });
    }

    // Handle specific server errors
    let userFriendlyMessage = response.message || "An error occurred during registration. Please try again.";

    // General error on email field if no specific field errors
    if (Object.keys(fieldErrors).length === 0) {
      fieldErrors.email = [userFriendlyMessage];
    }

    return {
      errors: fieldErrors,
      message: response.message,
    };
  }

  // 4. Check if we have the required data
  if (!response.data || !response.data.token) {
    return {
      errors: {
        email: ["We encountered an issue while registering. Please try again."],
      },
      message: "Registration failed",
    };
  }

  const { token, tokenExpiresAt, id, role: userRole, isVerified, fullName: userName } = response.data as any;

  // 5. Create session with user data
  await createSession(
    id,
    email,
    userName,
    token,
    userRole as UserRole,
    isVerified,
    tokenExpiresAt,
    null
  );

  // 6. Redirect to dashboard
  redirect("/dashboard");
}


// ==========================================
// LOGOUT ACTION
// ==========================================
export async function logout() {
  try {
    const session = await getSession();
    if (session?.token) {
      await logoutApi(session.token);
    }
    await deleteSession();
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    await deleteSession();
    redirect("/login"); // Still logout locally even if API fails
  }
}

// ==========================================
// PROFILE ACTIONS
// ==========================================

export async function getUserProfile() {

  try {
    const session = await getSession();

    
    if (!session?.token) {

      return {
        isSuccess: false,
        message: "Your session has expired. Please log in again.",
        data: null,
      };
    }

    const response = await authStatusApi(session.token);

    return response;
  } catch {

    return {
      isSuccess: false,
      message: "We couldn't load your profile. Please try again.",
      data: null,
    };
  }
}

// ==========================================
// GET SESSION TOKEN (for client-side use)
// ==========================================
export async function getSessionToken() {
  const session = await getSession();
  return session?.token || null;
}
