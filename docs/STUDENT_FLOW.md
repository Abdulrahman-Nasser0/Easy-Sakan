# Student Flow Documentation

## Overview
The student flow encompasses the complete journey from browsing properties, creating bookings, managing existing bookings, and interacting with the platform. This document details every step of the student experience.

## User Roles & Permissions
- **Student**: Can browse properties, create bookings, view/cancel bookings, view reviews, view profile
- No special verification required (basic email verification during signup)

---

## Phase 1: Authentication & Account Setup

### 1.1 Registration (Signup)
**Endpoint**: `POST /api/auth/register`
**Location**: `src/app/(auth)/signup/page.tsx`

**Required Fields**:
- `email` - Valid email address (unique)
- `password` - Min 8 characters, must include uppercase, lowercase, numbers, special chars
- `fullName` - Student's full name
- `role` - Set to "STUDENT" during signup
- `phone` - Optional phone number
- `university` - Optional university/institution name

**API Function**: `registerApi(userData: RegisterRequest)`

**Flow**:
1. Student enters registration details in SignUpForm
2. Form validates all required fields locally
3. Submit to backend via `registerApi()`
4. Backend creates account and sends verification email
5. Student redirected to verify-email page
6. Student enters 6-digit code from email
7. Account verified via `confirmEmailApi(email, code)`
8. Redirect to login

### 1.2 Login
**Endpoint**: `POST /api/auth/login`
**Location**: `src/app/(auth)/login/page.tsx`

**API Function**: `loginApi(credentials: LoginRequest)`

**Returns**:
```typescript
{
  id: number;
  email: string;
  fullName: string;
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
  role: "STUDENT" | "LANDLORD" | "ADMIN";
}
```

**Flow**:
1. Student enters email and password
2. Backend validates credentials
3. Returns JWT token + refresh token
4. Token stored in HTTP-only cookie (secure)
5. Redirect to student dashboard (`/dashboard/student`)

---

## Phase 2: Student Dashboard

### 2.1 Dashboard Overview
**Location**: `src/app/dashboard/student/page.tsx`
**Access**: Dynamic route requiring valid session token

**Server-Side Features**:
- Fetches real-time statistics
  - Available properties count via `getAllProperties(1, 1)`
  - Student booking stats via `getMyBookings(token, 1, 100)`
  - Active bookings count
  - Completed bookings count

**UI Components**:
1. **Header** - Welcome message with name from session
2. **Quick Actions Panel**:
   - Browse Properties → `/properties`
   - My Bookings → `/dashboard/student/my-bookings`
   - Saved Properties → `/properties` (with saved filter)
3. **Stats Cards**:
   - Available Properties count (clickable link to browse)
   - Total Bookings with breakdown
   - Active Bookings count (clickable to view)
4. **Recent Activity Summary** - Shows active and completed bookings

---

## Phase 3: Property Browsing

### 3.1 Property Listing Page
**Location**: `src/app/properties/page.tsx`
**Public Access**: No authentication required (read-only)

**Features**:
- **Search & Filter**:
  - Search by title, address, landlord
  - Filter by price range (min/max)
  - Filter by location/city
  - Filter by university
  - Filter by gender (Any, Male, Female)
  - Filter by amenities
  - Sort by: newest, price, rating

- **API Call**: `getAllProperties(page, pageSize, filters)`
  ```typescript
  {
    search?: string;
    location?: string;
    university?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    rentalType?: string;
    amenities?: string;
    sortBy?: string;
    sortOrder?: string;
    includeSoldOut?: boolean;
    minRating?: number;
  }
  ```

- **Property Cards Display**:
  - Property image with status badge
  - Title and address
  - Price in EGP
  - Bedrooms, bathrooms, area (m²)
  - Rating (stars) with review count
  - Amenities preview
  - Landlord name
  - Available slots / total capacity

- **Pagination**:
  - Default 10 properties per page
  - Supports page navigation

### 3.2 Property Detail Page
**Location**: `src/app/properties/[id]/page.tsx`
**Public Access**: No authentication required

**API Call**: `getPropertyById(propertyId)`

**Displays**:
1. **Image Gallery**:
   - Full-resolution images with carousel
   - Navigation arrows (prev/next)
   - Image counter

2. **Property Information**:
   - Title
   - Address with location details
   - Nearest university
   - Price per month/semester
   - Bed count, bathroom count, area
   - Rental type (Single Bed / Entire Unit)
   - Gender preference

3. **Amenities**:
   - List of amenities tags
   - Visual icons

4. **Description**:
   - Full property description
   - Special features/highlights

5. **Landlord Card**:
   - Landlord name and avatar
   - Email and phone (if provided)
   - Verification status badge
   - Member since date
   - Average rating
   - Contact Landlord button

6. **Availability**:
   - Total capacity
   - Available slots
   - Occupancy status
   - "Sold Out" or "Cannot Book" badge if applicable

7. **Reviews Section**:
   - Average rating with stars
   - Review count
   - Individual review cards with:
     - Student name
     - Rating (1-5 stars)
     - Comment/review text
     - Date posted

8. **ML Insights** (if available):
   - Predicted fair price
   - Deal rating (e.g., "Great Deal", "Fair Price", "Premium")
   - Price difference percentage vs fair market

9. **Booking Button**:
   - "Book Now" - Normal state
   - "Sold Out" - When all slots filled
   - "Cannot Book" - When property isn't available for booking
   - **Click Action**: Opens BookingModal (requires authentication)

---

## Phase 4: Creating a Booking

### 4.1 Booking Modal
**Component**: `src/components/common/BookingModal.tsx`
**Triggered**: Click "Book Now" on property detail page
**Authentication**: Requires valid student session

**Steps**:
1. Modal opens with property details
2. Student selects check-in date (date picker)
3. Student selects check-out date (date picker)
4. System calculates:
   - Number of days/months
   - Daily/monthly rate
   - Total price
5. Display price breakdown
6. Validate date selection:
   - Check-out after check-in
   - Not in the past
   - Within property availability
7. Submit booking via `createBooking(token, {propertyId, checkInDate, checkOutDate})`

### 4.2 Create Booking API
**Endpoint**: `POST /api/bookings`
**Function**: `createBooking(token, bookingData)`

**Request**:
```typescript
{
  propertyId: number;
  checkInDate: string; // ISO format: YYYY-MM-DD
  checkOutDate: string; // ISO format: YYYY-MM-DD
}
```

**Response**:
```typescript
{
  isSuccess: boolean;
  message: string;
  data: {
    id: number;
    propertyId: number;
    studentId: number;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED";
    paymentStatus: "PENDING" | "CONFIRMED";
    createdAt: string;
  };
  errors?: any[];
}
```

**Success Flow**:
1. Booking created successfully
2. User redirected to `/dashboard/student/my-bookings`
3. New booking appears in bookings list
4. Status typically "PENDING" until admin confirms payment

**Error Handling**:
- Validation errors displayed
- Booking conflicts flagged
- Price miscalculations caught
- Authorization errors shown

---

## Phase 5: Managing Bookings

### 5.1 My Bookings Page
**Location**: `src/app/dashboard/student/my-bookings/page.tsx`
**Access**: Requires authenticated student session

**Features**:

#### 5.1.1 Booking List
- **API Call**: `getMyBookings(token, page, pageSize, status?)`
- **Default**: Shows first 10 bookings

**Displayed Information per Booking**:
- Property title (clickable → property detail page)
- Check-in date
- Check-out date
- Total price
- Status badge with color-coding:
  - PENDING → Yellow
  - CONFIRMED → Green
  - COMPLETED → Gray
  - CANCELLED → Red
  - DISPUTED → Orange
- Payment status:
  - PENDING → "Payment pending"
  - CONFIRMED → "Paid"
  - REFUNDED → "Refunded"

#### 5.1.2 Status Filtering
- "All Bookings"
- "Active" (PENDING, CONFIRMED)
- "Completed"
- "Cancelled"

#### 5.1.3 Pagination
- Page navigation
- Shows current page of total pages
- Previous/Next buttons

### 5.2 Cancel Booking
**API Function**: `cancelBookingRequest(token, bookingId, reason?)`

**Process**:
1. Click "Cancel Booking" on booking card
2. Confirmation dialog opens
3. Optional: Student can enter cancellation reason
4. Click "Confirm Cancel"
5. API call sent to backend
6. Booking status updated to "CANCELLED"
7. Confirmation message displayed

**Conditions**:
- Can only cancel PENDING or CONFIRMED bookings
- Cannot cancel if check-in date has passed
- Admin may have different policies

### 5.3 Booking Details
**API Function**: `getBookingById(token, bookingId)`

**Information Available**:
- Full property details
- Exact check-in/check-out times (if available)
- Total price breakdown
- Payment method (if available)
- Landlord contact information
- Booking confirmation number
- Special requests/notes (if entered during booking)

---

## Phase 6: User Profile Management

### 6.1 Profile Page
**Location**: `src/app/profile/page.tsx`
**Access**: Requires authenticated session

**Component**: `ProfileContent.tsx`

**Student Information Displayed**:
- Full name
- Email address
- Phone number
- University/Institution
- Account creation date
- Email verification status badge

**Profile Actions**:
- Edit profile information
- Change password
- View booking history
- Download booking receipts
- Contact support

**API Functions**:
- `authStatusApi(token)` - Get current profile
- `changePasswordApi(token, oldPassword, newPassword)` - Update password

---

## Phase 7: Authentication Token Management

### 7.1 Session Management
**Location**: `src/lib/session.ts`
**Function**: `getSession()`

**Returns**:
```typescript
{
  token: string;
  refreshToken: string;
  name: string;
  email: string;
  role: string;
  userId: number;
}
```

**Token Storage**:
- Stored in HTTP-only cookie
- Secure flag set
- SameSite policy enforced
- Sent automatically with requests

### 7.2 Token Refresh
**Endpoint**: `POST /api/auth/refresh-token`
**Function**: `refreshTokenApi(refreshToken)`

**Automatic Triggers**:
- When main token expires
- Before making API call (if token near expiration)

### 7.3 Logout
**Endpoint**: `POST /api/auth/logout`
**Function**: `logoutApi(token, refreshToken)`

**Process**:
1. Call logout API
2. Token invalidated on backend
3. Cookies cleared on client
4. Redirect to login page

---

## Phase 8: Student Statistics & Features

### 8.1 Statistics Tracked
Per User Type "Student":
- Total bookings created
- Active bookings
- Completed bookings
- Cancelled bookings
- Reviews given
- Average booking value
- Preferred location/university

### 8.2 Features Available
- ✅ Browse properties
- ✅ Filter by multiple criteria
- ✅ Create bookings
- ✅ Cancel bookings
- ✅ View booking history
- ✅ View property details & reviews
- ✅ View landlord information
- ✅ Update profile
- ✅ Change password
- 🔄 Save properties (bookmarking) - Backend API ready, Frontend UI pending
- 🔄 Leave reviews - Backend API ready, Frontend UI pending
- 🔄 Messaging with landlords - Backend API ready, Frontend UI pending

---

## API Summary for Students

### Authentication APIs
- `loginApi(credentials)` - Login
- `registerApi(userData)` - Create account
- `confirmEmailApi(email, code)` - Verify email
- `resendVerificationApi(email, type)` - Resend verification
- `forgotPasswordApi(email)` - Password reset request
- `resetPasswordApi(email, code, newPassword)` - Reset password
- `changePasswordApi(token, oldPassword, newPassword)` - Change password
- `refreshTokenApi(refreshToken)` - Refresh JWT
- `logoutApi(token, refreshToken)` - Logout

### Property APIs
- `getAllProperties(page, pageSize, filters)` - List properties with filters
- `getPropertyById(propertyId)` - Get property details

### Booking APIs
- `createBooking(token, {propertyId, checkInDate, checkOutDate})` - Create booking
- `getMyBookings(token, page, pageSize, status?)` - List student's bookings
- `getBookingById(token, bookingId)` - Get booking details
- `cancelBookingRequest(token, bookingId, reason?)` - Cancel booking

---

## Error Handling

### Common Error Scenarios

**Invalid Authentication**:
- Expired token → Redirect to login
- Missing token → Show auth error
- Invalid credentials → Display error message

**Booking Errors**:
- Property not available → "Property is currently booked"
- Capacity full → "No available slots"
- Date conflict → "Dates conflict with another booking"
- Invalid dates → "Check-out must be after check-in"

**Network Errors**:
- Timeout → Retry mechanism
- 5xx errors → "Server error, please try again"
- No internet → "Connection lost"

---

## Performance Considerations

### Caching
- Property list results cached for 5 minutes
- Property details cached for 10 minutes
- Booking list cache invalidated on new booking

### Pagination
- Default 10 items per page
- Lazy loading on scroll (future enhancement)

### Optimizations
- Images lazy loaded
- API calls debounced on filters
- Server-side data fetching for dashboard stats

---

## Security Features

### For Student Accounts
- ✅ Email verification required
- ✅ Token-based authentication (JWT)
- ✅ HTTPS required (in production)
- ✅ HTTP-only cookies for token storage
- ✅ CORS protection
- ✅ Rate limiting on login attempts
- ✅ Password hashing (bcrypt)
- ✅ Refresh token rotation

---

## Testing Student Flow

### Manual Testing Checklist
- [ ] Register new account
- [ ] Verify email
- [ ] Login successfully
- [ ] View dashboard with correct stats
- [ ] Browse properties
- [ ] Filter properties
- [ ] View property details
- [ ] Click Book Now
- [ ] Create booking with valid dates
- [ ] View booking in my-bookings
- [ ] Cancel booking
- [ ] Verify booking status updated
- [ ] View profile
- [ ] Change password
- [ ] Logout
- [ ] Try accessing protected routes after logout

---

## Related Documentation
- See `docs/ADMIN_FLOW.md` for admin operations
- See `docs/LANDLORD_FLOW.md` for landlord operations
- See `PROJECT_STATUS.md` for complete project status

