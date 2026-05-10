# Easy Sakan - Admin Flow & Features

## Overview
The Admin flow within Easy Sakan provides system administrators with the necessary tools to monitor the platform, verify users, approve property listings, moderate bookings, and detect fraudulent activities. It serves as the primary control center to maintain the quality and safety of the platform.

## 1. Admin Dashboard (`/admin/dashboard`)
The central hub summarizing overall system health and offering quick navigation to management modules.
- **Dynamic Stats Grid**: Displays platform-wide metrics including Total Users, Total Properties, Total Bookings, and Estimated Total Revenue (using `adminGetDashboardStats`).
- **Actionable Alerts Grid**: Highlights critical areas requiring immediate attention:
  - Pending user verifications.
  - Active booking disputes.
  - Fraud alerts.
- **Quick Links**: Direct tiles mapping to dedicated management pages (Users, Properties, Bookings, Fraud, Audit Log).

## 2. User Management (`/admin/users`)
Comprehensive list interface to view all registered users (students and landlords).
- **Retrieval**: Uses `adminGetUsers` (mapped to `GET /api/admin/users`).
- **Detailed View**: Opens user profiles via `adminGetUserDetails` modal showing verification documents, contact info, and activity history.
- **Actions**:
  - `Approve User`: Verifies ID documents mapping to `PUT /api/admin/users/{id}/approve`.
  - `Reject User`: Declines verification with a reason mapping to `PUT /api/admin/users/{id}/reject`.
  - `Deactivate / Reactivate User`: Suspends or restores account access (`PUT /api/admin/users/{id}/deactivate` / `reactivate`).

## 3. Property Management (`/admin/properties`)
Dedicated view to oversee all property listings created by landlords to ensure quality and authenticity.
- **Filters**: Advanced filtering by Status (Pending, Approved, Rejected), Landlord ID, Listing Mode, and sorting operations (`adminGetProperties`).
- **Detailed Modal Validation**: 
  - Allows the admin to inspect the property description, location, amenities, and uploaded images.
- **Actions**:
  - `Approve Property`: Makes the property visible to students (`PUT /api/admin/properties/{id}/approve`).
  - `Reject Property`: Hides property requiring the landlord to make corrections (`PUT /api/admin/properties/{id}/reject`).
  - `Delete Property`: Forcefully removes inappropriate listings (`DELETE /api/admin/properties/{id}`).

## 4. Bookings & Dispute Resolution (`/admin/bookings`)
Interface to monitor active, completed, and canceled reservations.
- **Overview**: Uses `adminGetBookings` to load all reservations.
- **Management Sub-flows**:
  - Manual Payment Confirmation: `adminConfirmPayment` (`PUT /api/admin/bookings/{id}/confirm-payment`).
  - Cancel / Complete booking flows.
- **Disputes Module**:
  - Admins can mediate disagreements. Actions mapping to `adminHandleDispute`, `adminRefundBooking`, and `adminDismissDispute`.

## 5. Security & Fraud Detection (`/admin/fraud-detection` & `/admin/audit-log`)
System integrity and trust modules.
- **Fraud Detection**: Highlights suspicious account behaviors or transactions mapped to `adminGetFraudDetection`. Enables admins to resolve alerts using `adminResolveFraudAlert`.
- **Audit Log**: System-wide immutable history trail to track which admin executed what action (`adminGetAuditLog`).

## 6. Access Control & API Integration
All `/admin/*` routes strictly utilize Next.js Server Components that validate the `<SessionData>` secure token. Only users strictly designated with `Role = "Admin"` can bypass the middleware. If unauthorized, they are forcibly redirected to the standard login. All API operations within this flow securely route through the central `apiCall` wrapper appending the `Bearer {token}` header to every request.
