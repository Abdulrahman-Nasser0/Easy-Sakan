# Easy Sakan Frontend — Developer Handoff (Junior-Friendly)

This document is written for **you as a junior developer** who just opened this repo and needs to confidently continue development.

It is based on reading the code in `src/` and the project config files.

---

## 1) What this project is

**Easy Sakan** is a Next.js (App Router) frontend for a property/accommodation marketplace with **3 roles**:

- **Student**: browses properties and (eventually) books them.
- **Landlord**: uploads/manages properties and (eventually) manages bookings.
- **Admin**: reviews users/properties, monitors bookings, fraud alerts, and audit logs.

The UI is already built for many pages, but several flows are still **placeholder / not wired**.

---

## 2) Tech stack (what’s used)

From `package.json`:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (see `src/app/globals.css` + `postcss.config.mjs`)
- **Zod** for validation (`src/lib/validation.ts`)
- **jose** for JWT signing/verifying (session cookie) (`src/lib/session.ts`)
- **ESLint** (Next presets) (`eslint.config.mjs`)

There’s **no test framework installed** yet (no Jest/Vitest/Playwright in deps).

---

## 3) How to run locally

### Prerequisites

- Node.js (use a modern LTS)
- `pnpm` (repo has `pnpm-lock.yaml`)

### Environment variables (required)

This app will crash on server startup if `SESSION_SECRET` is missing because `src/lib/session.ts` throws immediately.

Create a `.env.local` (recommended) with:

- `SESSION_SECRET` — any long random string
- `NEXT_PUBLIC_API_URL` — backend base URL (defaults to `http://localhost:8000`)

Example:

```bash
# .env.local
SESSION_SECRET="change-me-to-a-long-random-string"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### Commands

```bash
pnpm install
pnpm dev
```

---

## 4) Project structure (how to navigate)

### `src/app/` (Next.js App Router)

Routes live here. Key ones:

- Public
  - `/` → `src/app/page.tsx` (landing)
  - `/properties` → `src/app/properties/page.tsx`
  - `/properties/[id]` → `src/app/properties/[id]/page.tsx`
- Auth
  - `/login` → `src/app/(auth)/login/page.tsx`
  - `/signup` → `src/app/(auth)/signup/page.tsx`
  - `/forgot-password` → `src/app/(auth)/forgot-password/page.tsx`
  - `/verify-email` → `src/app/(auth)/verify-email/page.tsx`
- Dashboards
  - `/dashboard/student` → `src/app/dashboard/student/page.tsx`
  - `/dashboard/landlord` → `src/app/dashboard/landlord/page.tsx`
  - `/dashboard/landlord/my-listings` → `src/app/dashboard/landlord/my-listings/page.tsx`
  - `/dashboard/landlord/properties/new` → `src/app/dashboard/landlord/properties/new/page.tsx`
  - `/dashboard/landlord/properties/[id]/edit` → `src/app/dashboard/landlord/properties/[id]/edit/page.tsx`
- Admin
  - `/admin/dashboard` → `src/app/admin/dashboard/page.tsx`
  - `/admin/users` → `src/app/admin/users/page.tsx`
  - `/admin/properties` → `src/app/admin/properties/page.tsx`
  - `/admin/bookings` → `src/app/admin/bookings/page.tsx`
  - `/admin/fraud-detection` → `src/app/admin/fraud-detection/page.tsx`
  - `/admin/audit-log` → `src/app/admin/audit-log/page.tsx`

### `src/components/`

Reusable UI pieces (header, buttons, empty/error/loading states). Example: `src/components/layout/Header/*`.

### `src/lib/`

“Backend + auth + utilities” layer.

Important files:

- `src/lib/session.ts` — **server-only** session cookie creation/verification (JWT via `jose`)
- `src/lib/actions.ts` — Next **Server Actions** (login/signUp/logout + getUserProfile)
- `src/lib/api.ts` — backend API wrapper + endpoints (currently a big file)
- `src/lib/types.ts` — shared types (`ApiResponse`, roles, property models, admin models)
- `src/lib/validation.ts` — zod schemas for forms

### `src/context/`

- `src/context/AuthContext.tsx` exists but is **not currently used** in `src/app/layout.tsx`.

---

## 5) How authentication works (current implementation)

### The session cookie

- On login/sign up, the frontend receives tokens from the backend.
- It stores them in an **HTTP-only cookie** called `easy_sakan_session`.
- Cookie contents are a **JWT** signed by `SESSION_SECRET`.

Code:

- Create / delete / read session: `src/lib/session.ts`
- Login / signUp server actions: `src/lib/actions.ts`

### Checking session from the browser

There is a Next route:

- `GET /api/auth/session` → `src/app/api/auth/session/route.ts`

Client code uses it to detect auth state (example: `src/app/page.tsx`).

---

## 6) Backend API integration (what’s wired + what’s risky)

### Backend base URL

- `src/lib/api.ts` uses `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).
- All endpoints are called like `${API_URL}/api/...`.

### Expected response shape

The client assumes the backend returns:

```ts
type ApiResponse<T> = {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: string[];
  statusCode: number;
  timestamp: string;
}
```

If your backend returns a different shape, many pages will “work” visually but fail at runtime.

### Major architectural issue: server-only code imported by client components

`src/lib/api.ts` starts with `"use server"` and also imports `getSession/createSession` from `src/lib/session.ts` (server-only). However, many **client components** import it directly, for example:

- `src/app/properties/page.tsx` (`'use client'`) imports `getAllProperties`
- `src/app/dashboard/landlord/...` client forms import property APIs
- Admin client UIs import admin APIs

In Next.js, importing a server-only module into a client component typically causes build/runtime errors.

**You should plan to refactor this early.** (See the roadmap section.)

### Token refresh logic is currently not effective

In `apiCall()` inside `src/lib/api.ts`, the code tries:

- `if (error instanceof Response && error.status === 401)`

But `fetch()` does not throw a `Response` on HTTP 401 — it returns a response with `ok=false`.

So refresh will likely never run as written.

### Logging and security

`src/lib/api.ts` logs request/response bodies (including potential sensitive data) via `console.log`. That’s useful while debugging but not safe long-term.

---

## 7) Route protection / authorization (current state)

There is a file `src/proxy.ts` that *looks like* middleware logic, but:

- There is **no** `middleware.ts` in the repo, so this logic is **not running**.
- Even if it ran, `protectedRoutes.includes(path)` only matches exact strings, so `/dashboard/student` would NOT be protected by `"/dashboard"`.

Also:

- `src/app/admin/layout.tsx` correctly blocks non-admins, but redirects them to `/dashboard` which currently **does not exist**.

**Bottom line:** access control is partially implemented inside pages, but there’s no single, reliable place enforcing it.

---

## 8) What features are already implemented

### Public / browsing

- Landing page UI (`/`)
- Properties list with filters UI (`/properties`)
- Property detail page UI (`/properties/[id]`)

### Auth

- Login UI + server action (`/login` → `src/lib/actions.ts:login`)
- Signup UI + server action (`/signup` → `src/lib/actions.ts:signUp`)
- Logout server action (`src/lib/actions.ts:logout`)
- Forgot password request UI (`/forgot-password` → calls backend)
- Verify email page UI (`/verify-email` → calls backend)

### Landlord

- Landlord dashboard UI + basic stats from `getMyListings()`
- Upload property (create + image upload)
- Edit property (update + image upload + delete image)
- “My Listings” list, hide/show availability, delete listing

### Admin

- Admin dashboard stats page (calls `adminGetDashboardStats`)
- Users management page (table, filters UI; detail modal exists)
- Properties management page (grid, filters UI; detail modal exists)
- Bookings table page (display only)
- Fraud alerts list + resolve actions
- Audit log table

---

## 9) What is incomplete / missing

These are the biggest gaps you’ll hit while trying to “finish the app”:

### Student booking flow is mostly missing

- “Book Now” button on property detail is UI-only (no booking action).
- Student dashboard has placeholders for:
  - My Bookings
  - Saved Properties

### Settings route is missing

Header dropdown links to `/settings`, but `src/app/settings/` has no route page.

### Admin and landlord flows are only partially connected

- Many admin filter UIs exist, but backend calls may not send query params (example: `adminGetUsers()` does not include pagination/query string).
- Admin “View” actions often don’t implement mutations (approve/reject/deactivate/etc) in UI yet.

### Verify-email redirect is likely broken

`src/app/(auth)/verify-email/page.tsx` uses `redirect()` inside a client component. In Next.js this is usually server-only; client code should use `useRouter().push()`.

### Central auth middleware not wired

`src/proxy.ts` is not active. Without real middleware, protection depends on each page remembering to check session.

### Leftover/unrelated utilities

`src/lib/utils.ts` contains e-commerce-like helpers (stock status, discount badges). It doesn’t match the accommodation domain and is likely leftover boilerplate.

---

## 10) The “complex parts” (and how to simplify them)

### A) The API layer is too big and mixes concerns

`src/lib/api.ts` mixes:

- Auth APIs
- Admin APIs
- Property APIs
- Generic fetch logic
- (Attempted) token refresh + session updates

**Simplify:** split it by domain:

- `src/lib/api/auth.ts`
- `src/lib/api/properties.ts`
- `src/lib/api/admin.ts`
- `src/lib/api/core.ts` (the shared `apiCall`)

### B) Server vs client boundary is currently unclear

Right now, client components directly call server-only code.

**Simplify options (choose one as a team):**

1) **Proxy through Next API routes** (recommended when you want client components to fetch)
   - Create `src/app/api/backend/*` routes.
   - Client components fetch `/api/backend/...`.
   - Server reads session cookie and attaches `Authorization` safely.

2) **Prefer server components + server actions**
   - Fetch data in server components and pass to client as props.
   - Use server actions for mutations.

Either way: keep secrets/tokens on the server whenever possible.

### C) Duplicated landlord forms

`UploadPropertyForm.tsx` and `EditPropertyForm.tsx` share a lot of logic.

**Simplify:** extract a shared `PropertyForm` component + shared validation helpers.

---

## 11) Making features independent (so you can test each part alone)

Think in layers. A good “testable architecture” for this repo:

### Layer 1 — Pure UI components

- Only accept props.
- No direct `fetch()`.
- Example: a `PropertyCard` component.

**Test:** component tests (render + interactions).

### Layer 2 — Feature modules

Create a folder per domain:

- `src/features/auth/`
- `src/features/properties/`
- `src/features/landlord/`
- `src/features/admin/`

Each feature contains:

- `components/` (UI)
- `services/` (API calls)
- `schemas/` (zod)
- `types.ts`

**Test:** service tests with mocked fetch + integration tests with MSW.

### Layer 3 — App routes

Routes (`src/app/...`) should compose features and handle routing.

**Test:** e2e tests.

---

## 12) Testing plan (what to add)

This repo currently has **no automated tests**. A practical approach:

### Unit + component tests

- Add **Vitest** + **React Testing Library** (or Jest if you prefer).
- Start by testing:
  - `loginSchema` + `signUpSchema` (`src/lib/validation.ts`)
  - API response parsing in the core API wrapper
  - A couple of key UI components (buttons/forms)

### API mocking

- Use **MSW** to mock backend responses.
- This helps you test the frontend without needing the real backend running.

### E2E

- Add **Playwright** for flows:
  - signup → verify email → login
  - landlord uploads property → sees it in listings

---

## 13) “Is backend connection okay?” — quick checklist

Use this when debugging issues:

- Is backend running and reachable at `NEXT_PUBLIC_API_URL`?
- Do endpoints exist exactly as used in `src/lib/api.ts`?
- Does backend return the expected `ApiResponse<T>` wrapper?
- Are auth endpoints returning `token`, `refreshToken`, `tokenExpiresAt`, and `user`?
- Are property endpoints returning the fields expected by `Property` in `src/lib/types.ts`?

If any answer is “no”, update either:

- the frontend types + parsing, or
- the backend response contract.

---

## 14) Roadmap (recommended order to finish the project)

### Phase 0 — Stabilize architecture (do this first)

1) Fix server/client boundary for API calls (choose a strategy and apply it consistently)
2) Add real auth middleware (or consistent per-page guards)
3) Fix broken redirects and missing routes (`/dashboard`, `/settings`)
4) Remove/limit sensitive console logging

### Phase 1 — Student core experience

1) Implement booking API + “Book Now” flow
2) Add “My Bookings” page and connect it
3) Add “Saved properties” (wishlist) if required

### Phase 2 — Landlord operations

1) Landlord bookings management
2) Better property analytics (revenue/occupancy based on real data)
3) Improve property form validation and location selection (real lat/lng)

### Phase 3 — Admin operations

1) Wire user verification actions (approve/reject/deactivate)
2) Wire property approval actions
3) Add booking dispute actions UI (confirm payment, refund, resolve dispute)

### Phase 4 — Tests + quality

1) Add unit/component testing
2) Add MSW
3) Add Playwright smoke flows

---

## 15) “Where do I start as a junior dev?” (practical steps)

If you want a clear first PR path:

1) Create `.env.local` and get the app running
2) Fix the `/settings` missing route (simple page)
3) Fix the `/admin/layout.tsx` redirect target (`/dashboard` → a real route)
4) Choose the API boundary strategy and refactor `src/lib/api.ts` usage

Once the app is stable, start implementing the student booking flow.

---

## 16) Important files you’ll touch a lot

- `src/lib/session.ts` — session cookie (server-only)
- `src/lib/actions.ts` — server actions (login/signup/logout)
- `src/lib/api.ts` — backend calls (needs refactor)
- `src/lib/types.ts` — shared types
- `src/app/**` — routes
- `src/components/layout/Header/*` — navigation/auth links

---

If you want, tell me which backend you’re using (base URL + a sample response for one endpoint like `GET /api/properties`), and I can:

- validate the API contract vs the frontend types, and
- propose the cleanest refactor option (proxy routes vs server components/actions) for this repo.
