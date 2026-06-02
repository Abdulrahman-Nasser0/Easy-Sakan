/**
 * Student Dashboard Styling System
 * Unified dark theme with sky blue accents for student flow.
 * For new components, prefer importing from '@/styles/designTokens'.
 */

export const studentStyles = {
  // Containers
  pageContainer: 'min-h-screen bg-slate-950',
  headerContainer: 'sticky top-0 z-10 bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700',
  mainContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  card: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors',
  cardWithHover: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-sky-500/50 transition-all cursor-pointer',

  // Headers
  pageTitle: 'text-3xl font-bold text-white',
  pageSubtitle: 'text-slate-400 mt-1',
  sectionHeader: 'text-xl font-bold text-white mb-4 flex items-center gap-2',

  // Forms & Inputs
  formGroup: 'flex flex-col gap-2',
  inputLabel: 'block text-sm font-medium text-slate-300 mb-1',
  input: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors',
  select: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors',
  textarea: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-colors resize-none',
  checkbox: 'flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors',
  formSection: 'space-y-4 border border-slate-700 rounded-lg p-6 bg-slate-800/30',

  // Buttons
  btnPrimary: 'px-4 py-2 rounded-lg font-medium bg-sky-500 hover:bg-sky-600 text-white transition-colors',
  btnSuccess: 'px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors',
  btnDanger: 'px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors',
  btnWarning: 'px-4 py-2 rounded-lg font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors',
  btnSecondary: 'px-4 py-2 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white transition-colors',
  btnSmall: 'px-3 py-1 rounded text-sm font-medium',
  btnOutline: 'px-4 py-2 rounded-lg font-medium border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors',

  // Tables
  table: 'w-full',
  tableHeader: 'bg-slate-900/50 border-b border-slate-700',
  tableHeaderCell: 'px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider',
  tableRow: 'border-b border-slate-700 hover:bg-slate-800/30 transition-colors',
  tableCell: 'px-6 py-4 text-sm text-slate-300',
  tableIcon: 'text-slate-400 hover:text-sky-400 transition-colors',

  // Badges & Status
  badge: 'inline-block px-3 py-1 rounded-full text-xs font-medium',
  badgeSuccess: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
  badgeError: 'bg-red-900/50 text-red-200 border border-red-600',
  badgeWarning: 'bg-amber-900/50 text-amber-200 border border-amber-600',
  badgeInfo: 'bg-sky-900/50 text-sky-200 border border-sky-600',
  badgePending: 'bg-slate-700 text-slate-300 border border-slate-600',

  // Alerts
  alertSuccess: 'p-4 bg-emerald-900/30 border border-emerald-600/30 rounded-lg text-emerald-200',
  alertError: 'p-4 bg-red-900/30 border border-red-600/30 rounded-lg text-red-200',
  alertWarning: 'p-4 bg-amber-900/30 border border-amber-600/30 rounded-lg text-amber-200',
  alertInfo: 'p-4 bg-sky-900/30 border border-sky-600/30 rounded-lg text-sky-200',

  // Modals
  modalBackdrop: 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4',
  modal: 'bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-sm w-full',
  modalLarge: 'bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-2xl w-full',
  modalContent: 'space-y-6 p-6',
  modalHeader: 'border-b border-slate-700 px-6 py-4 flex items-center justify-between',
  modalBody: 'px-6 py-4 text-slate-300',
  modalFooter: 'border-t border-slate-700 px-6 py-4 flex gap-3 justify-end',

  // Stats & Cards
  statCard: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow',
  statNumber: 'text-3xl font-bold text-sky-400',
  statLabel: 'text-sm text-slate-400 mt-2',

  // Special
  emptyState: 'text-center py-12 px-6 bg-slate-800/30 rounded-lg border border-slate-700',
  loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-sky-400',
  skeleton: 'bg-slate-700 rounded-lg animate-pulse',
};

/**
 * Booking Status Colors for Student Dashboard
 */
export const bookingStatusColors: Record<string, string> = {
  PENDING: 'bg-amber-900/50 text-amber-200 border border-amber-600',
  CONFIRMED: 'bg-emerald-900/50 text-emerald-200 border border-emerald-600',
  COMPLETED: 'bg-sky-900/50 text-sky-200 border border-sky-600',
  CANCELLED: 'bg-red-900/50 text-red-200 border border-red-600',
  DISPUTED: 'bg-purple-900/50 text-purple-200 border border-purple-600',
};

/**
 * Payment Status Colors
 */
export const paymentStatusColors: Record<string, string> = {
  PENDING: 'text-amber-400',
  CONFIRMED: 'text-emerald-400',
  REFUNDED: 'text-orange-400',
};
