# Easy Sakan — Features Guide & Implementation Status

## 📋 Overview

This document tracks all features across the three user roles (Student, Landlord, Admin) with their implementation status. Use this as a roadmap to prioritize upcoming work.

**Legend:**
- ✅ **Done** — Fully implemented and tested
- 🟡 **Partial** — Partially implemented (UI exists but needs work)
- ⬜ **Not Started** — Not yet implemented
- 🔄 **In Progress** — Currently being worked on

---

## TABLE OF CONTENTS

- [1. Authentication & Account Management](#1-authentication--account-management)
- [2. Student Features](#2-student-features)
- [3. Landlord Features](#3-landlord-features)
- [4. Admin Features](#4-admin-features)
- [5. Cross-Cutting Features](#5-cross-cutting-features)
- [6. UI/UX Features](#6-uiux-features)
- [7. Priority Roadmap](#7-priority-roadmap)
- [8. Known Issues](#8-known-issues)

---

## 1. AUTHENTICATION & ACCOUNT MANAGEMENT

### Auth Pages

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Login | `POST /api/auth/login` | ✅ Done | login page at `/login` |
| Register | `POST /api/auth/register` | ✅ Done | signup page at `/signup`, role selection supported |
| Logout | `POST /api/auth/logout` | ✅ Done | Invalidates token + refresh token |
| Refresh Token | `POST /api/auth/refresh-token` | ✅ Done | Automatic token refresh in api.ts |
| Forgot Password | `POST /api/auth/forgot-password` | ✅ Done | Page at `/forgot-password` |
| Reset Password | `POST /api/auth/reset-password` | ✅ Done | Via OTP |
| Change Password | `PUT /api/auth/change-password` | ✅ Done | UI in settings |
| Upload Verification Docs | `POST /api/auth/upload-verification` | ✅ Done | FormData upload |
| Get Verification Status | `GET /api/auth/verification-status` | ✅ Done | Shows pending/approved/rejected |

### Issues / Missing
- ⬜ No email confirmation flow after registration
- ⬜ No verification document upload UI for students (only API function exists)
- ⬜ No account deletion UI flow

---

## 2. STUDENT FEATURES

### 2.1 Profile Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Profile | `GET /api/profile` | ✅ Done | Page at `/profile` |
| Update Profile | `PUT /api/profile` | ✅ Done | Edit name, phone, university |
| Upload Avatar | `POST /api/profile/avatar` | ✅ Done | FormData upload |
| Delete Account | `DELETE /api/profile` | 🟡 Partial | API exists, no dedicated UI flow |
| Profile Image Display | — | ✅ Done | Avatar shown in header & profile |

### 2.2 Property Discovery

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Browse All Properties | `GET /api/properties` | ✅ Done | Page at `/properties` with filters |
| Search Properties | `GET /api/properties?search=` | ✅ Done | Search bar in header |
| Filter by location | `GET /api/properties?location=` | ✅ Done | Filter UI on properties page |
| Filter by university | `GET /api/properties?university=` | 🟡 Partial | API param exists, UI filter may be missing |
| Filter by price range | `GET /api/properties?minPrice=&maxPrice=` | ✅ Done | Price range slider |
| Filter by gender | `GET /api/properties?gender=` | ✅ Done | Gender toggle |
| Filter by rental type | `GET /api/properties?rentalType=` | ✅ Done | Bed vs EntireUnit |
| Filter by amenities | `GET /api/properties?amenities=` | 🟡 Partial | API param exists |
| Sort properties | `GET /api/properties?sortBy=&sortOrder=` | ✅ Done | Sort by price, rating, date |
| Include sold-out | `GET /api/properties?includeSoldOut=true` | 🟡 Partial | API param exists |
| View Property Details | `GET /api/properties/{id}` | ✅ Done | Detail page at `/properties/[id]` |
| View Landlord Info | — | ✅ Done | Shown on property detail page |
| View Reviews on Property | `GET /api/reviews/property/{id}` | ✅ Done | Shown on detail page |
| Get Recommended Properties | `GET /api/properties/recommended` | 🔄 Partial | API exists, UI integration needed |
| Log Interactions | `POST /api/analytics/interaction` | ⬜ Not Started | Backend silent logger for recommendations |

### 2.3 Booking System

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Create Booking | `POST /api/bookings` | ✅ Done | Book now button on property detail |
| View My Bookings | `GET /api/bookings/my-bookings` | ✅ Done | Page at `/dashboard/student/my-bookings` |
| View Booking Detail | `GET /api/bookings/{id}` | ✅ Done | Detail view |
| Cancel Booking (Student) | `PUT /api/bookings/{id}/cancel` | ✅ Done | Available for PENDING_PAYMENT |
| View Booking History | `GET /api/bookings/{id}/history` | ✅ Done | Status timeline |
| Payment Timer (48h countdown) | — | ⬜ Not Started | No countdown UI |
| WhatsApp Payment Instructions | — | ⬜ Not Started | No payment instructions display |
| Trust Period Display (72h) | — | ⬜ Not Started | No trust period UI |
| Landlord Contact (after confirm) | — | 🟡 Partial | API returns data, UI display pending |

### 2.4 Reviews

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Create Review | `POST /api/reviews` | 🟡 Partial | API exists, student review UI needed |
| View Property Reviews | `GET /api/reviews/property/{id}` | ✅ Done | Shown on property detail page |
| Reviews Sorting | — | ✅ Done | Sort by date, rating |

### Issues / Missing
- ⬜ No "canReview" flag display on completed bookings
- ⬜ No review submission UI on student dashboard
- ⬜ No 48h payment countdown timer
- ⬜ No WhatsApp payment receipt instructions
- ⬜ No recommended properties section on student dashboard/homepage

---

## 3. LANDLORD FEATURES

### 3.1 Dashboard

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Dashboard Overview | — | ✅ Done | Stats cards, recent properties |
| Property Summary Stats | — | ✅ Done | Total listings, pending, bookings, revenue |
| Quick View Properties | — | ✅ Done | Recent properties with edit links |

### 3.2 Property Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Create Property | `POST /api/properties` | ✅ Done | Upload form at `/dashboard/landlord/properties/new` |
| Upload Property Images | `POST /api/properties/{id}/images` | ✅ Done | Multi-image upload |
| Edit Property | `PUT /api/properties/{id}` | ✅ Done | Edit form |
| Delete Property Image | `DELETE /api/properties/{id}/images/{imageId}` | ✅ Done | During edit |
| View My Listings | `GET /api/properties/my-listings` | ✅ Done | Table at `/dashboard/landlord/my-listings` |
| Toggle Availability | `PATCH /api/properties/{id}/availability` | ✅ Done | Hide/Show toggle |
| Delete Listing | `DELETE /api/properties/{id}` | ✅ Done | Soft-delete with confirmation modal |
| Predict Fair Price | `POST /api/ml/predict-price` | 🟡 Partial | API exists, UI integration needed |

### 3.3 Booking Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Booking Requests | `GET /api/bookings/landlord-requests` | ✅ Done | Booking requests list |
| Filter by Property | — | ✅ Done | Filter by specific property |
| Filter by Status | — | ✅ Done | Filter by booking status |
| View Student Contact | — | 🟡 Partial | Shown after CONFIRMED |

### Issues / Missing
- ⬜ No price prediction UI (ML feature)
- ⬜ No booking requests count badge on dashboard
- ⬜ No notification when new booking comes in
- ⬜ No listing QR code or share link

---

## 4. ADMIN FEATURES

### 4.1 Dashboard

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Stats Overview | `GET /api/admin/dashboard/stats` | ✅ Done | Dashboard at `/admin/dashboard` |
| User Stats | — | ✅ Done | Total, pending, new today/week/month |
| Property Stats | — | ✅ Done | Total, pending, approved, sold-out |
| Booking Stats | — | ✅ Done | By status, today/week/month |
| Financial Stats | — | ✅ Done | Revenue, pending, avg value |
| Alert Cards | — | ✅ Done | Expiring, pending verification, disputes |

### 4.2 User Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| List Users | `GET /api/admin/users` | ✅ Done | Table with filters |
| View User Details | `GET /api/admin/users/{id}` | 🟡 Partial | API exists, modal/UI may be limited |
| Approve User | `PUT /api/admin/users/{id}/approve` | ✅ Done | Verifies documents |
| Reject User | `PUT /api/admin/users/{id}/reject` | ✅ Done | With rejection reason |
| Deactivate User | `PUT /api/admin/users/{id}/deactivate` | 🟡 Partial | API exists |
| Reactivate User | `PUT /api/admin/users/{id}/reactivate` | 🟡 Partial | API exists |
| Search/Filter Users | — | 🟡 Partial | Basic filters, more needed |

### 4.3 Property Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| List All Properties | `GET /api/admin/properties` | ✅ Done | Table with filters |
| Approve Listing | `PUT /api/admin/properties/{id}/approve` | ✅ Done | Action button |
| Reject Listing | `PUT /api/admin/properties/{id}/reject` | ✅ Done | With rejection reason |
| Delete Listing (Force) | `DELETE /api/admin/properties/{id}` | 🟡 Partial | API exists, admin UI may need modal |

### 4.4 Booking Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| List All Bookings | `GET /api/admin/bookings` | ✅ Done | Table at `/admin/bookings` |
| View Booking Details | `GET /api/admin/bookings/{id}` | 🟡 Partial | API exists, detail modal/UI needed |
| Confirm Payment | `PUT /api/admin/bookings/{id}/confirm-payment` | ✅ Done | Action button |
| Cancel Booking | `PUT /api/admin/bookings/{id}/cancel` | ✅ Done | With reason |
| Complete Booking | `PUT /api/admin/bookings/{id}/complete` | 🟡 Partial | API exists |
| Handle Dispute | `PUT /api/admin/bookings/{id}/dispute` | 🟡 Partial | API exists |
| Refund Booking | `PUT /api/admin/bookings/{id}/refund` | 🟡 Partial | API exists, UI may need refinement |
| Dismiss Dispute | `PUT /api/admin/bookings/{id}/dismiss-dispute` | 🟡 Partial | API exists |

### 4.5 Reviews & Moderation

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Delete Review | `DELETE /api/admin/reviews/{id}` | 🟡 Partial | API exists, admin UI needed |

### 4.6 Security & Fraud Detection

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Fraud Alerts | `GET /api/admin/fraud-detection` | 🟡 Partial | Page exists at `/admin/fraud-detection` |
| Resolve Fraud Alert | `PUT /api/admin/fraud-detection/{id}/resolve` | 🟡 Partial | API exists |
| View Audit Log | `GET /api/admin/audit-log` | ✅ Done | Page exists at `/admin/audit-log` |

### 4.7 Reports

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Reports | `GET /api/admin/reports` | 🟡 Partial | API exists, admin UI may be limited |
| Update Report Status | `PUT /api/admin/reports/{id}` | 🟡 Partial | API exists |

### Issues / Missing
- ⬜ No user detail modal (view documents, audit trail)
- ⬜ No booking detail modal
- ⬜ No dispute resolution workflow UI
- ⬜ No fraud detection dashboard detail view
- ⬜ No user document preview
- ⬜ No property image preview in admin listing

---

## 5. CROSS-CUTTING FEATURES

### 5.1 Notifications

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Get Notifications | `GET /api/notifications` | ✅ Done | List with pagination |
| Unread Count | `GET /api/notifications/unread-count` | ✅ Done | Badge in header |
| Mark as Read | `PUT /api/notifications/{id}/read` | ✅ Done | Click to dismiss |
| Mark All Read | `PUT /api/notifications/read-all` | ✅ Done | Bulk action |
| Delete Notification | `DELETE /api/notifications/{id}` | ✅ Done | Single delete |
| Clear Read Notifications | `DELETE /api/notifications/clear-read` | ✅ Done | Bulk clear |
| Notification Types | — | 🟡 Partial | Types defined in docs, UI needs styling per type |

### 5.2 System

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Health Check | `GET /api/health` | ⬜ Not Started | Not integrated into any UI |
| Get App Config | `GET /api/system/config` | ⬜ Not Started | Not used (hardcoded values) |
| Report Problem | `POST /api/system/report` | ⬜ Not Started | No in-app support UI |

### 5.3 Other Pages

| Feature | Status | Notes |
|---------|--------|-------|
| Settings Page | ✅ Done | Page at `/settings` |
| Profile Page | ✅ Done | Page at `/profile` |
| Homepage | ✅ Done | Landing page with featured properties |

---

## 6. UI/UX FEATURES

| Feature | Status | Notes |
|---------|--------|-------|
| Responsive Design | ✅ Done | Mobile, tablet, desktop |
| Dark Theme | ✅ Done | Dark scheme throughout |
| Arabic Translation | 🟡 Partial | messageAr in API, UI translation pending |
| Loading States | ✅ Done | Loading spinners |
| Error Handling | ✅ Done | Error messages, retry buttons |
| Empty States | ✅ Done | Message + CTA when no data |
| Confirmation Modals | ✅ Done | Delete confirmations |
| Filter Persistence | 🟡 Partial | Some filters reset on page change |
| Sorting | ✅ Done | Available in tables and property lists |
| Pagination | ✅ Done | Page numbers, prev/next |
| Toast/Snackbar Notifications | ⬜ Not Started | No toast system |
| Form Validation | ✅ Done | Zod schemas |
| Image Galleries | ✅ Done | Property detail gallery |
| Search Autocomplete | ⬜ Not Started | No search suggestions |

---

## 7. PRIORITY ROADMAP

### Phase 1 — Critical Fixes (Immediate)

| Priority | Feature | Reason |
|----------|---------|--------|
| 🔴 High | Verify Hide/Show toggle works with PATCH | Recently changed, needs testing |
| 🔴 High | Fix booking success/error handling after API changes | createBooking field changed |
| 🔴 High | Test admin dashboard stats after API refinements | adminGetBookings signature changed |

### Phase 2 — Core UX Gaps (This Sprint)

| Priority | Feature | Reason |
|----------|---------|--------|
| 🟡 Medium | Student booking 48h countdown timer | Critical for payment flow |
| 🟡 Medium | WhatsApp payment instructions display | Required for payment completion |
| 🟡 Medium | Review submission UI for students | Enables review system |
| 🟡 Medium | Admin user detail modal | Needed for verification workflow |

### Phase 3 — Enhancement (Next Sprint)

| Priority | Feature | Reason |
|----------|---------|--------|
| 🟢 Low | Price prediction UI for landlords | ML feature, nice-to-have |
| 🟢 Low | Recommended properties on homepage | Personalization |
| 🟢 Low | System config integration | Replace hardcoded values |
| 🟢 Low | In-app report problem UI | Support channel |
| 🟢 Low | Toast notification system | Better UX feedback |

### Phase 4 — Polish (Future)

| Priority | Feature | Reason |
|----------|---------|--------|
| ⚪ Backlog | Arabic UI translations | i18n support |
| ⚪ Backlog | Search autocomplete | UX improvement |
| ⚪ Backlog | Property sharing/QR codes | Viral growth |
| ⚪ Backlog | Admin dispute workflow UI | Moderation tool |

---

## 8. KNOWN ISSUES

### API Layer (`src/lib/api.ts`)
1. `confirmEmailApi` — Endpoint not in backend docs (may be incorrect)
2. `resendVerificationApi` — Endpoint not in backend docs (may be incorrect)
3. `authStatusApi` — Not documented in backend spec (check if exists)

### Frontend Issues
1. **Delete button** — After soft-delete, properties reappear on page refresh (client-side filter added as workaround)
2. **Hide/Show toggle** — Changed from PUT to PATCH, needs verification
3. **Booking create fields** — Changed from `checkInDate`/`checkOutDate` to `moveInDate`, needs UI update
4. **Landlord dashboard stats** — Hardcoded calculation, not from a dedicated endpoint

### Backend Dependencies
1. Verification document upload requires AI analysis service
2. ML price prediction requires ML model deployment
3. 48h/72h timers require background job service
4. Notifications require email service integration

---

## APPENDIX: API COVERAGE MATRIX

| Document Section | API Endpoints | Covered in api.ts | Missing |
|-----------------|---------------|-------------------|---------|
| 1. Auth & Account | 9 endpoints | 9 (100%) | — |
| 2. User Profile | 4 endpoints | 4 (100%) | — |
| 3. Properties | 9 endpoints | 9 (100%) | — |
| 4. Bookings | 6 endpoints | 6 (100%) | — |
| 5. Reviews | 2 endpoints | 2 (100%) | — |
| 6. Admin - Users | 7 endpoints | 7 (100%) | — |
| 7. Admin - Properties | 4 endpoints | 4 (100%) | — |
| 8. Admin - Bookings | 7 endpoints | 7 (100%) | — |
| 9. Admin - Reviews | 1 endpoint | 1 (100%) | — |
| 10. Admin - Audit & Fraud | 3 endpoints | 3 (100%) | — |
| 11. Admin - Reports | 2 endpoints | 2 (100%) | — |
| 12. Notifications | 6 endpoints | 6 (100%) | — |
| 13. System | 3 endpoints | 3 (100%) | — |
| 14. ML & Analytics | 3 endpoints | 3 (100%) | — |
| **TOTAL** | **66 endpoints** | **66 (100%)** | **0 missing** |

> **Note on extra endpoints in api.ts not in docs v2.1:**
> - `confirmEmailApi` — May be deprecated or undocumented
> - `resendVerificationApi` — May be deprecated or undocumented
> - `authStatusApi` — May be undocumented but used by middleware
>
> These should be verified against the actual backend.

---

*Last Updated: June 2026*
