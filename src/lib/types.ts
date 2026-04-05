export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export type SignUpState = {
  errors?: {
    role?: string[];
    fullName?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
} | undefined;

export interface UserActionsProps {
  isAuthenticated?: boolean;
  userRole?: UserRole;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  message: string;
  messageAr?: string;
  data: T;
  errors?: string[];
  statusCode: number;
  timestamp: string;
}

export type UserRole = 'Student' | 'Landlord' | 'Admin';
export type VerificationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    fullName: string;
    phone: string;
    isVerified: boolean;
    profileImage: string | null;
  };
}

export interface AuthStatusResponse {
  userId: number;
  email: string;
  role: UserRole;
  isVerified: boolean;
  fullName: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: UserRole;
  fullName: string;
  isVerified: boolean;
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  profileImage: string | null;
  university?: string;
  createdAt: string;
  stats?: {
    totalBookings: number;
    activeBookings: number;
    reviewsGiven: number;
  };
}

// ==========================================
// ADMIN TYPES
// ==========================================

export type UserStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DEACTIVATED';
export type PropertyStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type DisputeStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';
export type FraudStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeDisputes: number;
  fraudAlerts: number;
}

export interface AdminUser extends User {
  status: UserStatus;
  documentVerificationStatus: VerificationStatus;
  approvedDate?: string;
}

export interface AdminProperty {
  id: number;
  title: string;
  landlordId: number;
  landlordName: string;
  status: PropertyStatus;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  createdAt: string;
  submittedAt: string;
  approvedAt?: string;
  images: string[];
}

export interface AdminBooking {
  id: number;
  studentId: number;
  studentName: string;
  propertyId: number;
  propertyTitle: string;
  status: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  paymentStatus: 'PENDING' | 'CONFIRMED' | 'REFUNDED';
  createdAt: string;
  hasDispute: boolean;
}

export interface AdminDispute {
  id: number;
  bookingId: number;
  studentId: number;
  landlordId: number;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface FraudAlert {
  id: number;
  userId: number;
  userName: string;
  alertType: 'DUPLICATE_DOCUMENT' | 'SUSPICIOUS_ACTIVITY' | 'PAYMENT_FRAUD' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: FraudStatus;
  detectedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface AuditLogEntry {
  id: number;
  adminId: number;
  adminName: string;
  action: string;
  targetType: 'USER' | 'PROPERTY' | 'BOOKING' | 'DISPUTE' | 'FRAUD_ALERT';
  targetId: number;
  details: string;
  timestamp: string;
}