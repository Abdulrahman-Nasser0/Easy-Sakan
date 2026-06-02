/**
 * 🎨 Easy Sakan Design Tokens
 * 
 * Single source of truth for all design system values.
 * Inspired by Booking.com — Clean, trustworthy, sky blue primary.
 * 
 * Usage:
 *   import { tokens, getBadgeStyle } from '@/styles/designTokens';
 *   <div className={tokens.card.base}>
 */

// ============================================
// 1. LAYOUT & CONTAINERS
// ============================================

export const layout = {
  /** Page wrapper — use on every page */
  page: 'min-h-screen bg-slate-950',
  /** Content wrapper — max width with centering */
  content: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  /** Content wrapper with extra padding */
  contentPadded: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
} as const;

export const header = {
  /** Page header with sky blue gradient */
  base: 'bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700',
  /** Inner content area */
  inner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
  /** Page title text */
  title: 'text-3xl font-bold text-white',
  /** Page subtitle text */
  subtitle: 'text-slate-400 text-sm mt-1',
  /** Section header (h2) */
  section: 'text-2xl font-bold text-white',
  /** Small section header */
  sectionSm: 'text-xl font-bold text-white',
} as const;

// ============================================
// 2. CARDS
// ============================================

export const card = {
  /** Standard card */
  base: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6',
  /** Hoverable card */
  hover: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-sky-500/50 transition-all cursor-pointer',
  /** No border variant */
  noBorder: 'bg-slate-800/50 rounded-lg p-6',
  /** Stat card (numbers dashboard) */
  stat: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6',
  /** Stat number */
  statNumber: 'text-3xl font-bold text-sky-400 mt-2',
  /** Stat label */
  statLabel: 'text-sm text-slate-400',
} as const;

// ============================================
// 3. BUTTONS — Use with <Button> component
// ============================================

/** These are applied automatically in Button.tsx */
export const button = {
  primary: 'bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg px-6 py-3 transition-all active:scale-[0.98]',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg px-6 py-3 transition-all',
  outline: 'border border-slate-600 text-slate-300 hover:border-sky-500 hover:text-sky-400 font-medium rounded-lg px-6 py-3 transition-all',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-6 py-3 transition-all',
  ghost: 'text-slate-400 hover:text-sky-400 hover:bg-slate-800/50 font-medium rounded-lg px-4 py-2 transition-all',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-6 py-3 transition-all',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg px-6 py-3 transition-all',
  /** Small variant — append to any button class */
  sm: 'px-3 py-1.5 text-sm',
  /** Large variant — append to any button class */
  lg: 'px-8 py-4 text-lg',
} as const;

// ============================================
// 4. FORM ELEMENTS
// ============================================

export const form = {
  /** Standard input */
  input: 'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors',
  /** Textarea */
  textarea: 'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors resize-none',
  /** Select dropdown */
  select: 'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors appearance-none cursor-pointer',
  /** Input label */
  label: 'block text-sm font-medium text-slate-300 mb-2',
  /** Form group wrapper */
  group: 'space-y-2',
  /** Checkbox wrapper */
  checkbox: 'flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors',
  /** Form section card */
  section: 'bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 space-y-4',
} as const;

// ============================================
// 5. TABLES
// ============================================

export const table = {
  base: 'w-full',
  header: 'bg-slate-900/50 border-b border-slate-700',
  headerCell: 'px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider',
  row: 'border-b border-slate-700 hover:bg-slate-700/30 transition-colors',
  cell: 'px-6 py-4 text-sm text-slate-200',
  cellIcon: 'flex items-center gap-2',
} as const;

// ============================================
// 6. BADGES
// ============================================

export const badge = {
  success: 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/50 border border-emerald-600 text-emerald-200',
  warning: 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/50 border border-amber-600 text-amber-200',
  danger: 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-900/50 border border-red-600 text-red-200',
  info: 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-sky-900/50 border border-sky-600 text-sky-200',
  neutral: 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 border border-slate-600 text-slate-300',
} as const;

/**
 * Get badge style based on status string.
 * Handles common booking/property/user statuses.
 */
export function getBadgeStyle(status: string): string {
  const upper = status.toUpperCase();
  
  if (upper.includes('APPROVED') || upper.includes('CONFIRMED') || upper.includes('COMPLETED') || upper.includes('ACTIVE') || upper.includes('VERIFIED') || upper.includes('RESOLVED') || upper.includes('SUCCESS')) {
    return badge.success;
  }
  if (upper.includes('PENDING') || upper.includes('WAITING') || upper.includes('IN_PROGRESS') || upper.includes('PROGRESS') || upper.includes('IN_REVIEW') || upper.includes('OPEN')) {
    return badge.warning;
  }
  if (upper.includes('REJECTED') || upper.includes('CANCELLED') || upper.includes('CANCELED') || upper.includes('DELETED') || upper.includes('ERROR') || upper.includes('FAILED') || upper.includes('CLOSED') || upper.includes('INACTIVE') || upper.includes('FLAGGED')) {
    return badge.danger;
  }
  if (upper.includes('PENDING_PAYMENT') || upper.includes('DISPUTED') || upper.includes('REFUNDED')) {
    return badge.warning;
  }
  
  return badge.info;
}

// ============================================
// 7. ALERTS
// ============================================

export const alert = {
  success: 'p-4 bg-emerald-900/30 border border-emerald-600/30 rounded-lg text-emerald-200 text-sm',
  error: 'p-4 bg-red-900/30 border border-red-600/30 rounded-lg text-red-200 text-sm',
  warning: 'p-4 bg-amber-900/30 border border-amber-600/30 rounded-lg text-amber-200 text-sm',
  info: 'p-4 bg-sky-900/30 border border-sky-600/30 rounded-lg text-sky-200 text-sm',
} as const;

// ============================================
// 8. MODALS
// ============================================

export const modal = {
  backdrop: 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4',
  container: 'bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full',
  containerLg: 'bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full',
  containerXl: 'bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full',
  header: 'px-6 py-4 border-b border-slate-700 flex justify-between items-center',
  body: 'px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto',
  footer: 'px-6 py-4 border-t border-slate-700 flex justify-end gap-3',
  title: 'text-lg font-bold text-white',
} as const;

// ============================================
// 9. PAGINATION
// ============================================

export const pagination = {
  container: 'flex justify-center items-center gap-2 mt-8',
  button: 'px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-slate-300',
  active: 'bg-sky-600 border-sky-600 text-white',
} as const;

// ============================================
// 10. FILTERS
// ============================================

export const filter = {
  container: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
} as const;

// ============================================
// 11. EMPTY STATE
// ============================================

export const emptyState = {
  container: 'text-center py-12 px-6 bg-slate-800/30 rounded-lg border border-slate-700',
  icon: 'text-5xl mb-4 opacity-50',
  title: 'text-lg font-medium text-white mb-2',
  text: 'text-slate-400',
} as const;

// ============================================
// 12. LOADING
// ============================================

export const loading = {
  spinner: 'inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-sky-400',
  spinnerLg: 'inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-sky-400',
  skeleton: 'bg-slate-700 rounded-lg animate-pulse',
} as const;

// ============================================
// 13. PROPERTY CARDS (Listing cards)
// ============================================

export const propertyCard = {
  container: 'bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-sky-500/50 transition-all group',
  image: 'h-48 bg-slate-700 overflow-hidden relative',
  content: 'p-4 space-y-3',
  title: 'font-semibold text-white text-lg line-clamp-2',
  price: 'text-2xl font-bold text-sky-400',
  meta: 'text-xs text-slate-400 flex items-center gap-1',
} as const;

// ============================================
// 14. IMAGE UPLOAD
// ============================================

export const upload = {
  box: 'border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-sky-500 transition-colors cursor-pointer',
  placeholder: 'text-slate-400 text-sm',
  preview: 'relative rounded-lg overflow-hidden bg-slate-700 group',
  overlay: 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2',
} as const;

// ============================================
// Helper: Combined tokens object
// ============================================

/**
 * All design tokens in one place.
 * Import individual exports for type safety,
 * or use this combined object for convenience.
 */
export const tokens = {
  layout,
  header,
  card,
  button,
  form,
  table,
  badge,
  alert,
  modal,
  pagination,
  filter,
  emptyState,
  loading,
  propertyCard,
  upload,
  getBadgeStyle,
} as const;
