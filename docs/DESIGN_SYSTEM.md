# 🎨 Easy Sakan Design System

> **Inspired by Booking.com** — Clean, trustworthy, and user-friendly design with a sky blue primary palette.

---

## 📋 Table of Contents

- [1. Color Palette](#1-color-palette)
- [2. Typography](#2-typography)
- [3. Spacing & Layout](#3-spacing--layout)
- [4. Component Styles](#4-component-styles)
- [5. Migration Plan](#5-migration-plan)

---

## 1. Color Palette

### Primary — Sky Blue Family

The primary palette is inspired by trust, clarity, and professionalism — similar to Booking.com's iconic blue.

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| **Primary-50** | `#f0f9ff` | `sky-50` | Very light backgrounds |
| **Primary-100** | `#e0f2fe` | `sky-100` | Light hover states, badges |
| **Primary-200** | `#bae6fd` | `sky-200` | Subtle borders |
| **Primary-300** | `#7dd3fc` | `sky-300` | Active states, secondary accents |
| **Primary-400** | `#38bdf8` | `sky-400` | Hover on primary buttons |
| **Primary-500** | `#0ea5e9` | `sky-500` | **Primary buttons, CTAs, links** |
| **Primary-600** | `#0284c7` | `sky-600` | Button hover, active links |
| **Primary-700** | `#0369a1` | `sky-700` | Pressed states |
| **Primary-800** | `#075985` | `sky-800` | Dark backgrounds |
| **Primary-900** | `#0c4a6e` | `sky-900` | Deepest backgrounds |

### Neutral — Slate Family (Dark theme backgrounds)

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| **Surface-50** | `slate-50` | Page backgrounds (light mode) |
| **Surface-100** | `slate-100` | Card backgrounds (light mode) |
| **Surface-200** | `slate-200` | Borders (light mode) |
| **Surface-700** | `slate-700` | Borders (dark mode) |
| **Surface-800** | `slate-800` | Card backgrounds (dark mode) |
| **Surface-900** | `slate-900` | Deep backgrounds (dark mode) |
| **Surface-950** | `slate-950` | Page backgrounds (dark mode) |

### Semantic Colors

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| **Success** | `emerald-500` | Confirmed, completed, verified |
| **Warning** | `amber-500` | Pending, awaiting action |
| **Danger** | `red-500` | Cancelled, rejected, errors |
| **Info** | `sky-400` | Informational alerts |
| **Neutral** | `slate-400` | Disabled, secondary text |

### Accent Gradients (use sparingly)

```css
/* Hero sections, header backgrounds */
gradient-hero: linear-gradient(to right, sky-900, slate-800, slate-900)
/* Buttons */
gradient-primary: linear-gradient(to right, sky-500, sky-600)
/* Stats section */
gradient-stats: linear-gradient(to right, sky-600, blue-700)
```

---

## 2. Typography

### Font Family

- **Primary:** `Inter` (already configured via `next/font`)
- **Fallback:** `Arial, Helvetica, sans-serif`

### Font Sizes

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| **xs** | 0.75rem | `text-xs` | Helper text, badges, timestamps |
| **sm** | 0.875rem | `text-sm` | Secondary text, meta info |
| **base** | 1rem | `text-base` | Body text |
| **lg** | 1.125rem | `text-lg` | Section descriptions |
| **xl** | 1.25rem | `text-xl` | Card titles |
| **2xl** | 1.5rem | `text-2xl` | Section headers |
| **3xl** | 1.875rem | `text-3xl` | Page titles |
| **4xl** | 2.25rem | `text-4xl` | Hero headings |

### Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Labels, emphasized text |
| 600 | `font-semibold` | Subheadings |
| 700 | `font-bold` | Headings, page titles |
| 800 | `font-extrabold` | Hero titles (sparingly) |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| **tight** | 1.25 | Headings |
| **normal** | 1.5 | Body text |
| **relaxed** | 1.625 | Long-form content |

---

## 3. Spacing & Layout

### Spacing Scale (Tailwind defaults)

| Size | Rem | Common Usage |
|------|-----|-------------|
| 2 | 0.5rem | Inner padding for small elements |
| 3 | 0.75rem | Gap between form elements |
| 4 | 1rem | Standard padding, card padding |
| 6 | 1.5rem | Section padding, card padding large |
| 8 | 2rem | Page section spacing |
| 12 | 3rem | Large section spacing |
| 16 | 4rem | Page margins, hero padding |
| 20 | 5rem | Extra large spacing |

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| **sm** | 640px | Small forms, modals |
| **md** | 768px | Medium content |
| **lg** | 1024px | Standard content |
| **xl** | 1280px | Dashboard content |
| **2xl** | 1536px | Full-width with margins |

### Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| **sm** | 0.25rem | `rounded-sm` | Badges, small labels |
| **md** | 0.5rem | `rounded-lg` | Buttons, inputs, cards |
| **lg** | 0.75rem | `rounded-xl` | Modals, large cards |
| **xl** | 1rem | `rounded-2xl` | Hero sections, featured cards |
| **full** | 9999px | `rounded-full` | Avatars, pills |

---

## 4. Component Styles

### 4.1 Buttons — use `<Button>` component only

| Variant | Classes (applied automatically) |
|---------|-------------------------------|
| **primary** | `bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg px-6 py-3 transition-all active:scale-[0.98]` |
| **secondary** | `bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg px-6 py-3 transition-all` |
| **outline** | `border border-slate-600 text-slate-300 hover:border-sky-500 hover:text-sky-400 font-medium rounded-lg px-6 py-3 transition-all` |
| **danger** | `bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-6 py-3 transition-all` |
| **ghost** | `text-slate-400 hover:text-sky-400 hover:bg-slate-800/50 font-medium rounded-lg px-4 py-2 transition-all` |
| **success** | `bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-6 py-3 transition-all` |
| **warning** | `bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg px-6 py-3 transition-all` |

> **Rule:** All `bg-gradient-to-r` button styles are **deprecated**. Use solid `bg-sky-500` instead. Gradients on buttons look dated and "AI-generated".

### 4.2 Cards

```tsx
// Standard card (e.g., dashboard widgets)
<div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
```

```tsx
// Interactive card (hover effect)
<div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-sky-500/50 transition-all cursor-pointer">
```

```tsx
// Stat card (dashboard numbers)
<div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
  <p className="text-slate-400 text-sm">Label</p>
  <p className="text-3xl font-bold text-sky-400 mt-2">42</p>
</div>
```

### 4.3 Inputs

```tsx
<input className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors" />
```

### 4.4 Tables

```tsx
<table className="w-full">
  <thead>
    <tr className="bg-slate-900/50 border-b border-slate-700">
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
      <td className="px-6 py-4 text-sm text-slate-200">Data</td>
    </tr>
  </tbody>
</table>
```

### 4.5 Badges

```tsx
// Success
<span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/50 border border-emerald-600 text-emerald-200">
  Confirmed
</span>

// Warning / Pending
<span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/50 border border-amber-600 text-amber-200">
  Pending
</span>

// Error / Rejected
<span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-900/50 border border-red-600 text-red-200">
  Rejected
</span>

// Info
<span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-sky-900/50 border border-sky-600 text-sky-200">
  Info
</span>
```

### 4.6 Modals

```tsx
<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
  <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full">
    <div className="px-6 py-4 border-b border-slate-700">
      <h3 className="text-lg font-bold text-white">Title</h3>
    </div>
    <div className="px-6 py-6 space-y-4">
      {/* Content */}
    </div>
    <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
      <button className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
      <button className="px-4 py-2 text-sm bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Confirm</button>
    </div>
  </div>
</div>
```

### 4.7 Page Layout

```tsx
<div className="min-h-screen bg-slate-950">
  {/* Optional page header */}
  <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-white">Page Title</h1>
    </div>
  </div>
  
  {/* Page content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Content */}
  </div>
</div>
```

### 4.8 Alerts & Notifications

```tsx
// Success toast
<div className="bg-emerald-900/30 border border-emerald-600/30 text-emerald-200 rounded-lg p-4">
  ✅ Booking confirmed successfully!
</div>

// Error toast
<div className="bg-red-900/30 border border-red-600/30 text-red-200 rounded-lg p-4">
  ❌ Failed to process your booking.
</div>

// Warning toast
<div className="bg-amber-900/30 border border-amber-600/30 text-amber-200 rounded-lg p-4">
  ⚠️ Payment pending. 48 hours remaining.
</div>

// Info toast
<div className="bg-sky-900/30 border border-sky-600/30 text-sky-200 rounded-lg p-4">
  ℹ️ Your booking is being reviewed.
</div>
```

---

## 5. Migration Plan

### Phase 1: Create Core Files ✅
- [x] Create this design system document
- [x] Update `globals.css` with proper CSS variables
- [x] Update `Button.tsx` with new sky-blue palette (solid colors, no gradients)
- [x] Create `src/styles/designTokens.ts` — Single source of truth for all style tokens

### Phase 2: Migrate Style Files ✅
- [x] `adminStyles.ts` — Consolidated with sky blue palette, no gradient backgrounds
- [x] `landlordStyles.ts` — Switched from emerald to sky blue, no gradient backgrounds
- [x] `studentStyles.ts` — Switched to sky blue palette, simplified
- [x] All three style files reference `designTokens.ts` as source of truth

### Phase 3: Migrate Pages ✅ (Completed in two passes)
- [x] `app/page.tsx` — Homepage
- [x] `app/login/page.tsx` — Login page
- [x] `app/signup/page.tsx` — Signup page
- [x] `app/not-found.tsx` — Not found page
- [x] `app/properties/page.tsx` — Property listing
- [x] `app/properties/[id]/page.tsx` — Property detail
- [x] `app/properties/[id]/review/page.tsx` — Review form
- [x] `app/dashboard/student/page.tsx` — Student dashboard
- [x] `app/dashboard/landlord/page.tsx` — Landlord dashboard
- [x] `app/dashboard/landlord/properties/new/page.tsx` — Upload property
- [x] `app/dashboard/landlord/properties/[id]/edit/page.tsx` — Edit property
- [x] `app/dashboard/landlord/my-listings/page.tsx` — My listings
- [x] `app/dashboard/student/my-bookings/page.tsx` — My bookings
- [x] `app/settings/page.tsx` — Settings
- [x] `app/profile/page.tsx` — Profile
- [x] `app/report-issue/page.tsx` — Report issue
- [x] `app/admin/dashboard/page.tsx` — Admin dashboard
- [x] `app/admin/users/page.tsx` — Admin users
- [x] `app/admin/properties/page.tsx` — Admin properties
- [x] `app/admin/bookings/page.tsx` — Admin bookings
- [x] `app/admin/reports/page.tsx` — Admin reports
- [x] `app/admin/fraud-detection/page.tsx` — Admin fraud
- [x] `app/admin/audit-log/page.tsx` — Admin audit log

### Phase 4: Component Cleanup ✅
- [x] `components/common/Button.tsx` — Already uses design tokens
- [x] `components/common/Toast.tsx` — Fixed
- [x] `components/common/BookingModal.tsx` — Fixed
- [x] `components/common/ErrorDisplay.tsx` — Fixed
- [x] `components/common/NotificationBell.tsx` — Fixed
- [x] `components/common/ReportIssueModal.tsx` — Fixed
- [x] `components/layout/Header/Logo.tsx` — Fixed
- [x] `components/layout/Header/PromotionalBanner.tsx` — Fixed
- [x] `components/layout/Header/Header.tsx` — Fixed
- [x] `components/home/RecommendedProperties.tsx` — Fixed

### Rules to Follow During Migration

1. **NO gradient backgrounds on buttons** — Use solid `bg-sky-500`, `bg-slate-700`, etc.
2. **NO gradient text** — No `bg-clip-text text-transparent` patterns (looks AI-generated)
3. **NO floating blob animations** — Remove `animate-blob`, `mix-blend-multiply` patterns
4. **NO animated grid backgrounds** — Remove the grid overlay patterns
5. **Use sky blue** (`sky-*`) — Not `blue-*` for primary actions, links, headers
6. **Rounded corners** — Standard `rounded-lg` (8px) for most elements
7. **Consistent borders** — Always use `border-slate-700` for dark theme
8. **Hover states** — Simple opacity or border color changes, no `scale-105`
9. **No `hover:shadow-*-500/50`** — Use subtle shadows or none
10. **No `mix-blend-multiply`** — Removes AI-generated look

### Quick Reference: Before vs After

| Element | Before (❌ Deprecated) | After (✅ Correct) |
|---------|----------------------|-------------------|
| Primary Button | `bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/50` | `bg-sky-500 hover:bg-sky-600` |
| Secondary Button | `border-2 border-slate-600 bg-slate-800/50` | `bg-slate-700 hover:bg-slate-600 text-slate-100` |
| Card | `hover:shadow-lg hover:shadow-emerald-500/20` | `hover:border-sky-500/50` |
| Header | `bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900` | `bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900` |
| Page Title | `bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent` | `text-2xl font-bold text-white` |
| Stat Number | `text-emerald-400` | `text-sky-400` |
| Focus Ring | `focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30` | `focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30` |
