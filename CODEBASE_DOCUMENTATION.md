# Easy Sakan - Codebase Documentation

## 🏗️ Architecture Overview

**Easy Sakan** is a Next.js 14+ property booking platform built with **TypeScript**, **React**, and **Tailwind CSS v4**. It connects **Students** (looking for accommodation) with **Landlords** (offering properties), with full **Admin** oversight.

---

## 📁 Project Structure

```
easy-sakan/
├── src/
│   ├── app/                          # Next.js App Router - Pages & API
│   │   ├── layout.tsx                # Root layout with Header & AuthProvider
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles & animations (Tailwind v4)
│   │   ├── not-found.tsx             # 404 page
│   │   │
│   │   ├── (auth)/                   # Auth pages (no layout wrapping)
│   │   │   ├── login/                # Login page + LoginForm
│   │   │   ├── signup/               # Signup page + SignUpForm
│   │   │   ├── forgot-password/      # Forgot password page
│   │   │   └── verify-email/         # Email verification page
│   │   │
│   │   ├── admin/                    # Admin routes (protected by layout)
│   │   │   ├── layout.tsx            # Admin layout (checks Admin role)
│   │   │   ├── dashboard/            # Admin dashboard with stats
│   │   │   ├── users/                # User management (table + modals)
│   │   │   ├── properties/           # Property management (approve/reject)
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── fraud-detection/      # Fraud alerts management
│   │   │   └── audit-log/            # Audit log viewer
│   │   │
│   │   ├── dashboard/                # Dashboard routes
│   │   │   ├── page.tsx              # Role-based redirect
│   │   │   ├── student/              # Student dashboard + my-bookings
│   │   │   └── landlord/             # Landlord dashboard + CRUD
│   │   │       ├── my-listings/      # Property listings table
│   │   │       └── properties/
│   │   │           ├── new/          # Upload property form
│   │   │           └── [id]/edit/    # Edit property form
│   │   │
│   │   ├── properties/               # Public property pages
│   │   │   ├── page.tsx              # Browse all properties (with filters)
│   │   │   └── [id]/page.tsx         # Single property detail page
│   │   │
│   │   ├── profile/                  # Profile page
│   │   ├── settings/                 # Settings page (under development)
│   │   ├── test-image-endpoint/      # Test utility for image uploads
│   │   │
│   │   └── api/                      # Internal API routes
│   │       └── auth/session/route.ts # Session retrieval API
│   │
│   ├── components/
│   │   ├── common/                   # Reusable UI components
│   │   │   ├── Button.tsx            # Multi-variant button with loading
│   │   │   ├── BookingModal.tsx      # Booking creation modal
│   │   │   ├── EmptyState.tsx        # Empty state placeholder
│   │   │   ├── ErrorDisplay.tsx      # Error display component
│   │   │   ├── LoadingSpinner.tsx    # Loading indicator
│   │   │   └── fonts.ts              # Font configuration (Inter)
│   │   │
│   │   └── layout/
│   │       └── Header/               # Header components
│   │           ├── Header.tsx        # Main header (composition root)
│   │           ├── Logo.tsx          # Brand logo
│   │           ├── UserActions.tsx   # Auth-aware action buttons
│   │           ├── AccountDropdown.tsx # User account dropdown menu
│   │           ├── Dropdown.tsx      # Generic dropdown component
│   │           ├── DesktopNavigation.tsx # Desktop nav links
│   │           ├── MobileMenu.tsx    # Mobile navigation drawer
│   │           ├── SearchBar.tsx     # Search input
│   │           └── PromotionalBanner.tsx # Promo banner (commented out)
│   │
│   ├── context/
│   │   └── AuthContext.tsx           # Client-side auth state provider
│   │
│   ├── hooks/
│   │   └── useMenuState.ts          # Mobile menu toggle hook
│   │
│   ├── lib/
│   │   ├── actions.ts               # Server actions (login, signup, logout)
│   │   ├── api.ts                   # API client functions
│   │   ├── session.ts              # Server session management (encrypt/decrypt)
│   │   ├── types.ts                 # TypeScript type definitions
│   │   └── utils.ts                 # Utility functions (getImageUrl)
│   │
│   ├── providers/
│   │   └── SessionProvider.tsx      # Session data provider
│   │
│   ├── styles/
│   │   ├── studentStyles.ts         # Student dashboard style constants
│   │   ├── landlordStyles.ts        # Landlord dashboard style constants
│   │   └── adminStyles.ts           # Admin panel style constants
│   │
│   └── middleware.ts                # (in root, see proxy.ts)
│
├── proxy.ts                         # Next.js middleware - route protection
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── tailwind.config.ts / globals.css  # Tailwind v4 configuration
```

---

## 🧩 Core Architecture Patterns

### 1. **Hybrid Rendering (Server + Client Components)**

The app strategically splits rendering responsibilities:

**Server Components** (default in App Router):
- Data fetching via `getSession()` (cookies)
- Pass `token` + `userId` + `role` down as props
- SEO-friendly content (landing page)
- Access control via `redirect()`

**Client Components** (`'use client'`):
- Interactive UI (forms, modals, search)
- API calls using the token via `fetch` or `lib/api.ts`
- State management (useState, useEffect)
- Form actions via `useActionState`

**Data Flow Pattern:**
```
Server Component → fetch session → pass token prop → Client Component → API calls
```

### 2. **Authentication System**

**Server-side (middleware - `proxy.ts`):**
- Reads `easy_sakan_session` cookie
- Decrypts to get `{ userId, role, isVerified, token }`
- Protects routes based on user role
- Redirects unauthenticated users to `/login`
- Redirects admins away from user routes

**Server-side (page level):**
- `getSession()` called in server components
- Access control via `redirect()` if role mismatches

**Client-side (`AuthContext`):**
- Fetches `/api/auth/session` on mount
- Provides `user`, `isLoading`, role helpers
- Used by client components for conditional rendering

### 3. **Authorization Flow**

```
Request → proxy.ts (middleware)
  ├── Check cookie → decrypt session
  ├── Protected route? → redirect to /login if no session
  ├── Admin on user route? → redirect to /admin/dashboard
  ├── Auth user on auth pages? → redirect to dashboard
  └── Pass through → NextResponse.next()

Page load → Server Component
  ├── getSession() reads cookie
  ├── Role check → redirect if unauthorized
  └── Render UI (pass token to client components)

API calls → Client Component
  └── Uses token from session for authenticated requests
```

### 4. **API Communication**

- **Backend base URL**: Configured via environment variables (`NEXT_PUBLIC_API_URL`)
- **API client**: `src/lib/api.ts` contains functions for all endpoints
- **Authentication**: Token is passed from session to API calls
- **Response format**: `ApiResponse<T>` with `isSuccess`, `message`, `data`, `errors`

---

## 👥 User Roles & Permissions

| Feature | Guest | Student | Landlord | Admin |
|---------|-------|---------|----------|-------|
| Browse properties | ✅ | ✅ | ✅ | ✅ |
| Create account | ✅ | ✅ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Book property | ❌ | ✅ | ❌ | ❌ |
| Upload property | ❌ | ❌ | ✅ | ❌ |
| Approve properties | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| View all bookings | ❌ | ❌ | ❌ | ✅ |
| Profile/Settings | ❌ | ✅ | ✅ | ❌ |

### Route Mapping
- `/dashboard/student` → Student dashboard
- `/dashboard/landlord` → Landlord dashboard
- `/admin/*` → Admin panel (layout checks role)
- `/properties` → Public property listing (auth not required)
- `/profile`, `/settings` → User profile (non-admin only)
- `/login`, `/signup` → Auth pages (redirect if already logged in)

---

## 📦 Key Components

### Common Components (`src/components/common/`)

| Component | Description |
|-----------|-------------|
| **Button** | Multi-variant button (`primary`, `secondary`, `danger`, `outline`, `ghost`, `success`, `warning`) with loading state, sizes, icons |
| **BookingModal** | Modal for students to book a property (date selection, price summary) |
| **EmptyState** | Placeholder with icon, title, message, and optional action button |
| **ErrorDisplay** | Error/warning/info box with configurable action |
| **LoadingSpinner** | Animated spinner with configurable size |

### Header Components (`src/components/layout/Header/`)

| Component | Description |
|-----------|-------------|
| **Header** | Main navigation bar (composition root) |
| **Logo** | Brand logo with gradient text |
| **UserActions** | Auth-aware buttons: Sign In/Up, Dashboard, Admin Panel |
| **AccountDropdown** | User menu: Profile, Settings, Sign Out |
| **Dropdown** | Generic dropdown with click-outside handling |
| **MobileMenu** | Responsive mobile navigation |

---

## 🗄️ Data Flow

### Session Flow
```
1. User logs in → Server Action (login in lib/actions.ts)
2. Server creates session → encrypts → sets cookie `easy_sakan_session`
3. Subsequent requests → proxy.ts reads cookie → decrypts → allows/denies access
4. Client components → AuthContext fetches /api/auth/session → provides user state
```

### Property Booking Flow
```
1. Student browses properties (/properties)
2. Student clicks "Book Now" on property detail (/properties/[id])
3. BookingModal opens → selects dates → submits
4. API call to backend with token
5. On success → redirect to /dashboard/student/my-bookings
```

### Landlord Property Flow
```
1. Landlord clicks "Upload New Property" (/dashboard/landlord/properties/new)
2. Fills form (title, description, price, images, etc.)
3. API call to create property → upload images
4. Property status: PENDING_APPROVAL
5. Admin approves/rejects → status changes to APPROVED/REJECTED
6. Property becomes visible to students
```

---

## 🎨 Styling System

### Tailwind CSS v4
- **Location**: `src/app/globals.css` uses `@import "tailwindcss"`
- **PostCSS plugin**: `@tailwindcss/postcss`
- **Custom animations**: Blob, grid-move, gradient animations defined in globals.css

### Style Constants (src/styles/)

Three style object files provide consistent dark-themed styling:

| File | Theme | Primary Color |
|------|-------|---------------|
| `studentStyles.ts` | Dark (slate) | Blue-600 |
| `landlordStyles.ts` | Dark (slate) | Emerald-600 |
| `adminStyles.ts` | Dark (slate) | Blue-600 |

Each file exports: containers, headers, cards, forms, buttons, tables, badges, alerts, modals, empty states, loading spinners, pagination.

---

## 🛠️ Key Libraries & Dependencies

| Package | Purpose |
|---------|---------|
| next 15 | React framework with App Router |
| react 19 | UI library |
| typescript | Type safety |
| tailwindcss v4 | Utility-first CSS |
| @tailwindcss/postcss | Tailwind PostCSS plugin |
| jose | JWT/encryption for session cookies |
| clsx | Conditional class name utility |
| next/font | Font optimization (Inter) |
| eslint | Code quality |

---

## 🚦 Middleware (proxy.ts)

Located at `src/proxy.ts`, the middleware:

- **Runs on**: All routes except `/api`, `/_next/static`, `/_next/image`, `*.png`
- **Protected routes**: `/dashboard`, `/profile`, `/settings`, `/admin`
- **Public routes**: `/login`, `/signup`, `/`, `/forgot-password`, `/verify-email`
- **Key behaviors**:
  1. Redirects unauthenticated users from protected routes to `/login`
  2. Redirects admins from user routes (`/profile`, `/settings`) to `/admin/dashboard`
  3. Redirects authenticated non-admin users from auth pages to their dashboard
  4. Allows unverified users to access `/verify-email`

---

## 🔐 Security Patterns

1. **Session encryption**: `jose` library for cookie encryption/decryption (`session.ts`)
2. **Server-side access control**: Multiple layers (middleware + page-level)
3. **Form validation**: Client-side + server-side validation in actions
4. **CSRF protection**: Next.js server actions handle this inherently
5. **Image validation**: File size (5MB), type (JPG/PNG/WebP), count limits

---

## 🚧 Known Issues / TODOs

1. **Settings page**: Placeholder only, functionality not implemented
2. **SearchBar**: Commented out in both desktop and mobile headers
3. **PromotionalBanner**: Commented out in Header
4. **Test pages**: `test-image-endpoint/` is a dev utility, not for production
5. **FraudAlertList**: Uses `alert()` for error handling
6. **EditPropertyForm handleSubmit**: Logic for deleting removed images has a potential bug - compares new image names to existing images, but names won't match
7. **Some admin pages lack client-side refresh**: After actions like approve/reject, some pages don't show visual confirmation
8. **No error boundaries**: The app lacks ErrorBoundary components for graceful error handling
9. **`clickDropdown.tsx`**: Exists in Header folder but may be unused (duplicate of Dropdown.tsx)

---

## 🔍 Useful Commands

```bash
# Development
npm run dev           # Start dev server on localhost:3000

# Build
npm run build         # Production build
npm run start         # Start production server

# Linting
npm run lint          # ESLint check

# Type checking
npx tsc --noEmit      # TypeScript type check
```
