# 📋 Design System Migration — Remaining Work

## Priority: Build Errors

1. **Corrupted sed replacements** — Some `sed` commands replaced single-quoted strings with `.` characters in these files:
   - `src/app/admin/bookings/AdminBookingsClient.tsx` (line ~124) — `COMPLETED` badge
   - `src/app/admin/fraud-detection/components/FraudAlertList.tsx` (line ~39) — default badge
   - `src/app/admin/reports/AdminReportsClient.tsx` (line ~28) — `IN_PROGRESS` badge
   - `src/app/dashboard/student/my-bookings/MyBookingsClient.tsx` (line ~175) — `COMPLETED` badge
   - `src/components/common/ErrorDisplay.tsx` (lines ~42-44) — error display colors
   - `src/components/common/Toast.tsx` (line ~52) — info toast bg

   **Fix:** Open each file, replace `.bg-sky-...` with `'bg-sky-...'` (proper single-quoted strings).

2. **EditPropertyForm.tsx and UploadPropertyForm.tsx** — The `sed` command for `hover:border-emerald-500/50` likely failed. Check if those forms still compile.

3. **`hover:text-blue-300`** — May still exist in some files that weren't caught.

## Lower Priority

### Files with potential non-standard patterns
- **`src/components/layout/Header/Navigation.tsx`** (if exists) — Check for gray/blue hover states
- **`src/app/dashboard/landlord/my-listings/MyListingsForm.tsx`** — Verify `bg-green-600` was replaced
- **`src/app/dashboard/student/my-bookings/MyBookingsClient.tsx`** — Verify `bg-green-600` → `bg-emerald-600`

### Light mode utility functions (unchanged intentionally)
- **`src/lib/utils.ts`** — `getStockBadgeColor`, `getDiscountBadgeColor` use light-mode colors (bg-green-50, bg-blue-500, etc.). These are utility helpers for stock/badge colors, not UI components. May want to update if used somewhere.

## How to build and check
```bash
cd /home/abdulrahman/frontEnd/easy-sakan
npm run build
# Fix any errors, then run again
```

## Quick fix for sed corruption
```bash
cd /home/abdulrahman/frontEnd/easy-sakan
# Replace corrupted .bg-sky strings with proper single-quoted strings
sed -i "s|\.bg-sky-900/50 border-sky-600 text-sky-200\.|'bg-sky-900/50 border-sky-600 text-sky-200'|g" \
  src/app/admin/bookings/AdminBookingsClient.tsx \
  src/app/admin/fraud-detection/components/FraudAlertList.tsx \
  src/app/admin/reports/AdminReportsClient.tsx \
  src/app/dashboard/student/my-bookings/MyBookingsClient.tsx \
  src/app/admin/users/UsersTable.tsx
sed -i "s|\.bg-sky-50\.|'bg-sky-50'|g; s|\.bg-sky-100\.|'bg-sky-100'|g" src/components/common/ErrorDisplay.tsx
sed -i "s|\.bg-sky-900/90 border-sky-600/50\.|'bg-sky-900/90 border-sky-600/50'|g" src/components/common/Toast.tsx
```
