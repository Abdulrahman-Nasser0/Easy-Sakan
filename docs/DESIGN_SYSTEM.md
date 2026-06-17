# 🎨 Easy Sakan Design System

> **Inspired by Booking.com.** Light theme. Clean and trustworthy.
> White backgrounds, not dark. Blue is the only accent color. Use it with restraint.
> No gradients on interactive elements. No glow effects.
> Every color choice must serve trust and clarity — not aesthetics.

---

## 1. Colors

### Backgrounds
| Role | Hex | Tailwind |
|------|-----|----------|
| Page background | `#ffffff` | `bg-white` |
| Section / alternate | `#f2f6fc` | `bg-[#f2f6fc]` |
| Card background | `#ffffff` | `bg-white` |
| Input background | `#ffffff` | `bg-white` |

### Primary — Blue (the ONLY accent)
| Role | Hex | Tailwind |
|------|-----|----------|
| Primary action / CTA | `#0071c2` | `bg-[#0071c2]` |
| Primary hover | `#005999` | `hover:bg-[#005999]` |
| Links | `#0071c2` | `text-[#0071c2]` |
| Link hover | `#005999` | `hover:text-[#005999]` |
| Focus ring | `#0071c2` | `ring-[#0071c2]` |
| Light blue tint (bg, badges) | `#ebf3ff` | `bg-[#ebf3ff]` |

### Text
| Role | Hex | Tailwind |
|------|-----|----------|
| Primary text | `#1a1a2e` | `text-[#1a1a2e]` |
| Secondary / meta text | `#6b7280` | `text-gray-500` |
| Placeholder text | `#9ca3af` | `placeholder-gray-400` |
| Disabled text | `#d1d5db` | `text-gray-300` |

### Borders
| Role | Hex | Tailwind |
|------|-----|----------|
| Default border | `#e5e7eb` | `border-gray-200` |
| Focused border | `#0071c2` | `border-[#0071c2]` |
| Dividers | `#f3f4f6` | `border-gray-100` |

### Semantic
| Role | Hex | Tailwind |
|------|-----|----------|
| Success | `#008009` | `text-[#008009]` / `bg-[#ebf7eb]` |
| Warning | `#b95000` | `text-[#b95000]` / `bg-[#fff3e0]` |
| Danger | `#cc0000` | `text-[#cc0000]` / `bg-[#fff0f0]` |
| Info | `#0071c2` | `text-[#0071c2]` / `bg-[#ebf3ff]` |

---

## 2. Typography
**Font:** Inter, fallback `Arial, Helvetica, sans-serif`

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| xs | 0.75rem | `text-xs` | Labels, timestamps |
| sm | 0.875rem | `text-sm` | Secondary text, table data |
| base | 1rem | `text-base` | Body text |
| lg | 1.125rem | `text-lg` | Card descriptions |
| xl | 1.25rem | `text-xl` | Card titles |
| 2xl | 1.5rem | `text-2xl` | Section headers |
| 3xl | 1.875rem | `text-3xl` | Page titles |

**Weights:** `font-normal` (body), `font-medium` (labels), `font-semibold` (subheadings), `font-bold` (headings).

---

## 3. Component Patterns

### Buttons (solid colors only, no gradients, no shadows)
```tsx
// Primary (blue CTA)
<button className="bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">Book now</button>

// Secondary (outline)
<button className="border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] font-semibold text-sm px-5 py-2.5 rounded-md transition-colors bg-white">Learn more</button>

// Danger
<button className="bg-[#cc0000] hover:bg-[#aa0000] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors">Cancel</button>

// Ghost
<button className="text-[#0071c2] hover:underline font-medium text-sm">View details</button>
```

### Cards
```tsx
// Standard card
<div className="bg-white border border-gray-200 rounded-lg p-6">...</div>

// Interactive card
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-[#0071c2] transition-all cursor-pointer">...</div>
```

### Inputs
```tsx
<input className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm" />
```

### Badges
```tsx
// Success
<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf7eb] text-[#008009]">Confirmed</span>
// Warning
<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff3e0] text-[#b95000]">Pending</span>
// Danger
<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff0f0] text-[#cc0000]">Rejected</span>
// Info
<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3ff] text-[#0071c2]">Info</span>
```

### Tables
```tsx
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
  <table className="w-full">
    <thead><tr className="bg-[#f2f6fc] border-b border-gray-200">
      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Header</th>
    </tr></thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-[#f2f6fc] transition-colors">
        <td className="px-6 py-4 text-sm text-[#1a1a2e]">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Alerts
```tsx
<div className="bg-[#ebf7eb] border border-[#c3e6c3] text-[#008009] rounded-md p-4 text-sm">Success</div>
<div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">Error</div>
<div className="bg-[#fff3e0] border border-[#f5d6a3] text-[#b95000] rounded-md p-4 text-sm">Warning</div>
<div className="bg-[#ebf3ff] border border-[#b3d4f5] text-[#0071c2] rounded-md p-4 text-sm">Info</div>
```

### Modals
```tsx
<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
  <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full shadow-xl">
    <div className="px-6 py-4 border-b border-gray-100">
      <h3 className="text-lg font-semibold text-[#1a1a2e]">Title</h3>
    </div>
    <div className="px-6 py-6 space-y-4">{/* Content */}</div>
    <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
      <button className="px-4 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">Cancel</button>
      <button className="px-4 py-2 text-sm bg-[#0071c2] hover:bg-[#005999] text-white rounded-md transition-colors">Confirm</button>
    </div>
  </div>
</div>
```

### Page Layout
```tsx
<div className="min-h-screen bg-white">
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Page Title</h1>
    </div>
  </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Content */}
  </div>
</div>
```

---

## 4. Rules — What NOT to Do

| ❌ Avoid | ✅ Use instead |
|----------|---------------|
| Dark backgrounds (slate-800, slate-900) | White or `#f2f6fc` |
| Gradient buttons | Solid `bg-[#0071c2]` |
| Glow / ring effects on hover | Simple border + `focus:ring-2` |
| Multiple accent colors | Blue only (`#0071c2`) |
| `rounded-2xl` or `rounded-3xl` on cards | `rounded-lg` max |
| Heavy shadows (`shadow-2xl`) | `shadow-md` or none |
| Fancy animations | `transition-colors` only |
| Colored section backgrounds | White or `#f2f6fc` only |
| Bright neon text (`text-sky-400`) | `text-[#0071c2]` medium blue |
| `text-white` on dark bg | `text-[#1a1a2e]` on light bg |
| Status colors with borders | Semantic bg + text color only |

---

## 5. Migration Plan

### Phase 0 — Foundation (Core Config)
- [ ] `globals.css` — Light theme CSS variables
- [ ] `designTokens.ts` — Replace all dark theme tokens with light
- [ ] `Button.tsx` — Solid `#0071c2` blue, no gradients
- [ ] `adminStyles.ts` — Backward-compat light theme aliases
- [ ] `landlordStyles.ts` — Backward-compat light theme aliases  
- [ ] `studentStyles.ts` — Backward-compat light theme aliases

**Key changes per file:**
- `globals.css`: `--background: #ffffff`, `--foreground: #1a1a2e`, `--primary: #0071c2`
- `designTokens.ts`: All `slate-*` → `white`/`gray-*`, `sky-*` → `[#0071c2]`, `text-white` → `text-[#1a1a2e]`
- `Button.tsx`: Remove gradient + scale animations, use `rounded-md`, `text-sm`

### Phase 1 — Common Components
- [ ] `Toast.tsx` — Light semantic colors
- [ ] `BookingModal.tsx` — White bg, gray border
- [ ] `ReportIssueModal.tsx` — White bg, gray border
- [ ] `ErrorDisplay.tsx` — White bg, light error banner
- [ ] `EmptyState.tsx` — White bg, gray text
- [ ] `LoadingSpinner.tsx` — Gray border, blue spinner
- [ ] `NotificationBell.tsx` — White dropdown, dark text

### Phase 2 — Header & Navigation
- [ ] `Header.tsx` — White bg, `border-b border-gray-200`
- [ ] `Logo.tsx` — Dark text, no gradient
- [ ] `DesktopNavigation.tsx` — Dark text, blue hover
- [ ] `MobileMenu.tsx` — White bg, dark text
- [ ] `SearchBar.tsx` — White input, gray border
- [ ] `AccountDropdown.tsx` — White dropdown, dark text
- [ ] `Dropdown.tsx` — White dropdown, dark text
- [ ] `UserActions.tsx` — Dark text, blue accent

### Phase 3 — Auth Pages
- [ ] `login/page.tsx` — `bg-white`, blue CTA
- [ ] `signup/page.tsx` — `bg-white`, blue CTA
- [ ] `forgot-password/page.tsx` — `bg-white`, blue CTA
- [ ] `verify-email/page.tsx` — `bg-white`, blue CTA

### Phase 4 — Public Pages
- [ ] `page.tsx` (Homepage) — White bg, light hero
- [ ] `not-found.tsx` — White bg
- [ ] `properties/page.tsx` — White bg, light filter panel
- [ ] `properties/[id]/page.tsx` — White bg, white cards
- [ ] `properties/[id]/review/page.tsx` — White bg, white form

### Phase 5 — Dashboard Pages
- [ ] `dashboard/page.tsx` — White bg
- [ ] `dashboard/student/page.tsx` — White bg, stat cards
- [ ] `dashboard/student/my-bookings/page.tsx` + `MyBookingsClient.tsx`
- [ ] `dashboard/landlord/page.tsx` — White bg
- [ ] `dashboard/landlord/my-listings/page.tsx` + `MyListingsForm.tsx`
- [ ] `dashboard/landlord/properties/new/page.tsx` + `UploadPropertyForm.tsx`
- [ ] `dashboard/landlord/properties/[id]/edit/page.tsx` + `EditPropertyForm.tsx`

### Phase 6 — Admin Pages
- [ ] `admin/dashboard/page.tsx`
- [ ] `admin/users/page.tsx` + `UsersManagement.tsx` + `UsersTable.tsx`
- [ ] `admin/properties/page.tsx` + `PropertiesManagement.tsx`
- [ ] `admin/bookings/page.tsx` + `AdminBookingsClient.tsx` + `BookingsTable.tsx`
- [ ] `admin/reports/page.tsx` + `AdminReportsClient.tsx`
- [ ] `admin/fraud-detection/page.tsx` + `FraudAlertList.tsx`
- [ ] `admin/audit-log/page.tsx`

### Phase 7 — Other Pages
- [ ] `profile/page.tsx` + `ProfileContent.tsx`
- [ ] `settings/page.tsx` + `SettingsForm.tsx`
- [ ] `report-issue/page.tsx` + `ReportIssuePageClient.tsx`
- [ ] `RecommendedProperties.tsx`

---

## 6. Key Pattern Replacements

| Dark (❌ Before) | Light (✅ After) |
|-----------------|------------------|
| `bg-slate-950` | `bg-white` |
| `bg-slate-800/50` | `bg-white` |
| `border-slate-700` | `border-gray-200` |
| `bg-sky-500` | `bg-[#0071c2]` |
| `hover:bg-sky-600` | `hover:bg-[#005999]` |
| `text-white` (body) | `text-[#1a1a2e]` |
| `text-slate-400` | `text-gray-500` |
| `text-sky-400` (stat) | `text-[#0071c2]` |
| `text-sky-200` (badge) | `text-[#0071c2]` |
| `bg-sky-900/50` (badge) | `bg-[#ebf3ff]` |
| `border-sky-600` (badge) | no border on badges |
| `bg-emerald-900/50` | `bg-[#ebf7eb]` |
| `text-emerald-200` | `text-[#008009]` |
| `bg-amber-900/50` | `bg-[#fff3e0]` |
| `text-amber-200` | `text-[#b95000]` |
| `bg-red-900/50` | `bg-[#fff0f0]` |
| `text-red-200` | `text-[#cc0000]` |
| `rounded-lg` (button) | `rounded-md` |
| `rounded-xl` (modal) | `rounded-lg` |
| `active:scale-[0.98]` | remove |
| `placeholder-slate-500` | `placeholder-gray-400` |
| `bg-slate-700` (hover) | `hover:bg-gray-50` |
| `border-slate-600` (input) | `border-gray-200` |
| `focus:ring-1 focus:ring-sky-500/30` | `focus:ring-2 focus:ring-[#0071c2]/20` |
| `bg-black/70` (overlay) | `bg-black/40` |
