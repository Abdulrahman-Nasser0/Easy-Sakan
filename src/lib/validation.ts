import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

// Phone regex for Egyptian numbers: +201XXXXXXXXX or 01XXXXXXXXX (9 digits after 01)
const egyptianPhoneRegex = /^(\+20|0)1[0-9]{9}$/;

export const signUpSchema = z.object({
  role: z.enum(['Student', 'Landlord'], { message: "Please select a valid role" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }).max(100, { message: "Full name must be at most 100 characters" }).trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  phone: z.string().regex(egyptianPhoneRegex, { message: "Please enter a valid Egyptian phone number (01XXXXXXXXX or +201XXXXXXXXX)" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
    .trim(),
  confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});