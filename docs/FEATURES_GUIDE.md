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
| Filter by university | `GET /api/properties?university=` | ✅ Done | Dropdown with common universities |
| Filter by price range | `GET /api/properties?minPrice=&maxPrice=` | ✅ Done | Price range slider |
| Filter by gender | `GET /api/properties?gender=` | ✅ Done | Gender toggle |
| Filter by rental type | `GET /api/properties?rentalType=` | ✅ Done | Bed vs EntireUnit |
| Filter by amenities | `GET /api/properties?amenities=` | ✅ Done | Dropdown with common amenities |
| Sort properties | `GET /api/properties?sortBy=&sortOrder=` | ✅ Done | Sort by price, rating, date |
| Include sold-out | `GET /api/properties?includeSoldOut=true` | ✅ Done | Checkbox to show sold-out |
| Min rating filter | `GET /api/properties?minRating=` | ✅ Done | Dropdown 1-5 stars |
| View Property Details | `GET /api/properties/{id}` | ✅ Done | Detail page at `/properties/[id]` |
| View Landlord Info | — | ✅ Done | Shown on property detail page |
| View Reviews on Property | `GET /api/reviews/property/{id}` | ✅ Done | Shown on detail page |
| Get Recommended Properties | `GET /api/properties/recommended` | ✅ Done | Section on student dashboard at `/dashboard/student` |
| Log Interactions | `POST /api/analytics/interaction` | ⬜ Not Started | Backend silent logger for recommendations |

### 2.3 Booking System

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Create Booking | `POST /api/bookings` | ✅ Done | Book now button on property detail |
| View My Bookings | `GET /api/bookings/my-bookings` | ✅ Done | Page at `/dashboard/student/my-bookings` |
| View Booking Detail | `GET /api/bookings/{id}` | ✅ Done | Detail view |
| Cancel Booking (Student) | `PUT /api/bookings/{id}/cancel` | ✅ Done | Available for PENDING_PAYMENT |
| View Booking History | `GET /api/bookings/{id}/history` | ✅ Done | Status timeline |
| Payment Timer (48h countdown) | — | ✅ Done | Countdown timer on each booking card |
| WhatsApp Payment Instructions | — | ✅ Done | Payment instructions + WhatsApp link |
| Trust Period Display (72h) | — | ✅ Done | Trust period countdown on CONFIRMED |
| Landlord Contact (after confirm) | — | ✅ Done | Name and phone displayed after CONFIRMED |
| Summary Cards (pending/confirmed/cancelled/expired counts) | — | ✅ Done | Summary cards at top of my-bookings |

### 2.4 Reviews

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Create Review | `POST /api/reviews` | ✅ Done | Review form at `/properties/[id]/review` |
| View Property Reviews | `GET /api/reviews/property/{id}` | ✅ Done | Shown on property detail page |
| Reviews Sorting | — | ✅ Done | Sort by date, rating |

### Issues / Missing
- ⬜ No recommended properties section on homepage (available on student dashboard only)

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
| Predict Fair Price | `POST /api/ml/predict-price` | ✅ Done | UI in UploadPropertyForm & EditPropertyForm |

### 3.3 Booking Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Booking Requests | `GET /api/bookings/landlord-requests` | ✅ Done | Booking requests list |
| Filter by Property | — | ✅ Done | Filter by specific property |
| Filter by Status | — | ✅ Done | Filter by booking status |
| View Student Contact | — | 🟡 Partial | Shown after CONFIRMED |

### Issues / Missing
- ⬜ No booking requests count badge on dashboard (covered by NotificationBell in header)
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
| View User Details | `GET /api/admin/users/{id}` | ✅ Done | Modal with tabs (info/documents/bookings) |
| Approve User | `PUT /api/admin/users/{id}/approve` | ✅ Done | Verifies documents |
| Reject User | `PUT /api/admin/users/{id}/reject` | ✅ Done | With rejection reason |
| Deactivate User | `PUT /api/admin/users/{id}/deactivate` | ✅ Done | Modal with reason input |
| Reactivate User | `PUT /api/admin/users/{id}/reactivate` | ✅ Done | Action button |
| Search/Filter Users | — | ✅ Done | Role, verification, active, search, sort |

### 4.3 Property Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| List All Properties | `GET /api/admin/properties` | ✅ Done | Table with filters |
| Approve Listing | `PUT /api/admin/properties/{id}/approve` | ✅ Done | Action button |
| Reject Listing | `PUT /api/admin/properties/{id}/reject` | ✅ Done | With rejection reason |
| Delete Listing (Force) | `DELETE /api/admin/properties/{id}` | ✅ Done | Delete modal with reason + cancel active bookings |

### 4.4 Booking Management

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| List All Bookings | `GET /api/admin/bookings` | ✅ Done | Client component with filters at `/admin/bookings` |
| View Booking Details | `GET /api/admin/bookings/{id}` | ✅ Done | Detail modal with all booking info, student/landlord/amount |
| Confirm Payment | `PUT /api/admin/bookings/{id}/confirm-payment` | ✅ Done | Action button in modal |
| Cancel Booking | `PUT /api/admin/bookings/{id}/cancel` | ✅ Done | With reason modal |
| Complete Booking | `PUT /api/admin/bookings/{id}/complete` | ✅ Done | Confirmation before completing |
| Handle Dispute | `PUT /api/admin/bookings/{id}/dispute` | ✅ Done | Dispute flag modal |
| Refund Booking | `PUT /api/admin/bookings/{id}/refund` | ✅ Done | Refund amount + resolution modal |
| Dismiss Dispute | `PUT /api/admin/bookings/{id}/dismiss-dispute` | ✅ Done | Confirmation before dismissing |

### 4.5 Reviews & Moderation

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| Delete Review | `DELETE /api/admin/reviews/{id}` | 🟡 Partial | API exists, admin UI for review moderation needed |

### 4.6 Security & Fraud Detection

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Fraud Alerts | `GET /api/admin/fraud-detection` | ✅ Done | Client component with severity badges, resolve/dismiss |
| Resolve Fraud Alert | `PUT /api/admin/fraud-detection/{id}/resolve` | ✅ Done | Confirm fraud or mark as false alarm |
| View Audit Log | `GET /api/admin/audit-log` | ✅ Done | Page exists at `/admin/audit-log` |

### 4.7 Reports

| Feature | Endpoint | Status | Notes |
|---------|----------|--------|-------|
| View Reports | `GET /api/admin/reports` | ✅ Done | Table with filtering at `/admin/reports` |
| Update Report Status | `PUT /api/admin/reports/{id}` | ✅ Done | Status modal with admin notes |

### Issues / Missing
- ⬜ No fraud detection dashboard detail view

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
| Get App Config | `GET /api/system/config` | ✅ Done | `useSystemConfig()` hook + `fetchSystemConfig()` server utility |
| Report Problem | `POST /api/system/report` | ✅ Done | Page at `/report-issue` with form + validation |

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
| Toast/Snackbar Notifications | ✅ Done | `Toast.tsx` — context/provider with useToast() hook |
| Form Validation | ✅ Done | Zod schemas |
| Image Galleries | ✅ Done | Property detail gallery |
| Search Autocomplete | ⬜ Not Started | No search suggestions |

---

## 7. PRIORITY ROADMAP

### Phase 1 — Critical Fixes (Completed ✅)

| Priority | Feature | Status |
|----------|---------|--------|
| 🔴 High | Booking client fields (checkInDate → moveInDate) | ✅ Done |
| 🔴 High | Booking status (PENDING → PENDING_PAYMENT) | ✅ Done |
| 🔴 High | 48h payment countdown timer | ✅ Done |
| 🔴 High | Trust period display (72h) | ✅ Done |
| 🔴 High | WhatsApp payment instructions | ✅ Done |
| 🔴 High | Landlord contact display after CONFIRMED | ✅ Done |
| 🔴 High | Admin bookings full client refactor | ✅ Done |
| 🔴 High | Admin booking detail modal | ✅ Done |
| 🔴 High | Admin dispute resolution workflow | ✅ Done |

### Phase 2 — Core UX Gaps (Completed ✅)

| Priority | Feature | Status |
|----------|---------|--------|
| 🟡 Medium | University filter | ✅ Done |
| 🟡 Medium | Amenities filter | ✅ Done |
| 🟡 Medium | Rental type filter | ✅ Done |
| 🟡 Medium | Include sold-out option | ✅ Done |
| 🟡 Medium | Min rating filter | ✅ Done |
| 🟡 Medium | Sort order (asc/desc) | ✅ Done |
| 🟡 Medium | ML deal rating on property cards | ✅ Done |
| 🟡 Medium | Review submission UI for students | ✅ Done |
| 🟡 Medium | Booking modal (moveInDate + 48h info) | ✅ Done |
| 🟡 Medium | Admin force delete property | ✅ Done |

### Phase 3 — Enhancement (Completed ✅)

| Priority | Feature | Status | Commit |
|----------|---------|--------|--------|
| 🟢 Low | Price prediction UI for landlords | ✅ Done | Already existed |
| 🟢 Low | Recommended properties on homepage | ✅ Done | `ad71b5a`, `1338bc3` |
| 🟢 Low | System config integration | ✅ Done | `32e6bd5`, `465ee74` |
| 🟢 Low | In-app report problem UI | ✅ Done | `84ec36b` |
| 🟢 Low | Toast notification system | ✅ Done | `fc85893` |
| 🟢 Low | Admin reports page | ✅ Done | `fae9293` |

### Phase 4 — Polish (Future)

| Priority | Feature | Reason |
|----------|---------|--------|
| ⚪ Backlog | Arabic UI translations | i18n support |
| ⚪ Backlog | Search autocomplete | UX improvement |
| ⚪ Backlog | Property sharing/QR codes | Viral growth |
| ⚪ Backlog | Fraud detection detail view | Moderation tool |

---

## 8. KNOWN ISSUES

### API Layer (`src/lib/api.ts`)
1. `confirmEmailApi` — Endpoint not in backend docs (may be incorrect)
2. `resendVerificationApi` — Endpoint not in backend docs (may be incorrect)
3. `authStatusApi` — Not documented in backend spec (check if exists)

### Frontend Issues
1. **Delete button** — After soft-delete, properties reappear on page refresh (client-side filter added as workaround)
2. **Landlord dashboard stats** — Hardcoded calculation, not from a dedicated endpoint

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

*Last Updated: May 2025*

---

## RECENTLY COMPLETED

### Phase 1 — Critical Fixes (Completed ✅)

| Feature | Previous Status | New Status | Commit |
|---------|----------------|------------|--------|
| Booking client fields (checkInDate → moveInDate) | 🟡 Partial | ✅ Done | PH1-F1 |
| Booking status (PENDING → PENDING_PAYMENT) | 🟡 Partial | ✅ Done | PH1-F1 |
| Payment countdown timer (48h) | ⬜ Not Started | ✅ Done | PH1-F1 |
| Trust period display (72h) | ⬜ Not Started | ✅ Done | PH1-F1 |
| WhatsApp payment instructions | ⬜ Not Started | ✅ Done | PH1-F1 |
| Landlord contact display (after confirm) | 🟡 Partial | ✅ Done | PH1-F1 |
| Review submission link for completed bookings | ⬜ Not Started | ✅ Done | PH1-F1 |
| Admin bookings page refactor (client component) | 🟡 Partial | ✅ Done | PH1-F2 |
| Admin booking detail modal | ⬜ Not Started | ✅ Done | PH1-F2 |
| Admin dispute resolution workflow UI | ⬜ Not Started | ✅ Done | PH1-F2 |
| Admin cancel booking with reason | 🟡 Partial | ✅ Done | PH1-F2 |
| Admin refund processing | 🟡 Partial | ✅ Done | PH1-F2 |
| Admin dismiss dispute | 🟡 Partial | ✅ Done | PH1-F2 |

### Phase 2 — Core UX Gaps (Completed ✅)

| Feature | Previous Status | New Status | Commit |
|---------|----------------|------------|--------|
| University filter | 🟡 Partial | ✅ Done | PH2-F3 |
| Amenities filter | 🟡 Partial | ✅ Done | PH2-F3 |
| Rental type filter | 🟡 Partial | ✅ Done | PH2-F3 |
| Include sold-out option | 🟡 Partial | ✅ Done | PH2-F3 |
| Min rating filter | 🟡 Partial | ✅ Done | PH2-F3 |
| Sort order (asc/desc) | 🟡 Partial | ✅ Done | PH2-F3 |
| ML deal rating on property cards | 🟡 Partial | ✅ Done | PH2-F3 |
| Review submission UI for students | 🟡 Partial | ✅ Done | PH2-F4 |
| Booking modal (moveInDate + 48h info) | 🟡 Partial | ✅ Done | PH2-F4 |
| Admin force delete property | 🟡 Partial | ✅ Done | PH1-F5 |

### Phase 3 — Enhancement (Completed ✅)

| Feature | Previous Status | New Status | Commit |
|---------|----------------|------------|--------|
| Toast notification system | ⬜ Not Started | ✅ Done | `fc85893` |
| Report Issue page (Support Channel) | ⬜ Not Started | ✅ Done | `84ec36b` |
| Report Issue in account dropdown + profile | ⬜ Not Started | ✅ Done | `84ec36b` |
| Admin Reports management page | ⬜ Not Started | ✅ Done | `fae9293` |
| Reports link in Admin Dashboard | ⬜ Not Started | ✅ Done | `dfddaba` |
| Recommended Properties component | ⬜ Not Started | ✅ Done | `ad71b5a` |
| Recommended Properties on Student Dashboard | ⬜ Not Started | ✅ Done | `1338bc3` |
| Notification Bell (header badge + dropdown) | ⬜ Not Started | ✅ Done | `16e01f0` |
| System Config Integration (client hook) | ⬜ Not Started | ✅ Done | `32e6bd5` |
| System Config Integration (server fetcher) | ⬜ Not Started | ✅ Done | `465ee74` |
