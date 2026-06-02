/**
 * Admin Panel Styling Constants
 * Unified styling for all admin components using sky blue design system.
 * For new components, prefer importing from '@/styles/designTokens'.
 */

export const adminStyles = {
  // Containers
  container: "min-h-screen bg-slate-950",
  pageContainer: "max-w-7xl mx-auto px-6 py-8",
  cardContainer: "bg-slate-800 border border-slate-700 rounded-lg",

  // Headers & Section Headers
  sectionHeader: "text-2xl font-bold text-white mb-6 flex items-center gap-3",
  sectionSubtitle: "text-slate-400 text-sm",

  // Cards & Panels
  card: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors",
  cardWithHover: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-600 hover:shadow-lg hover:shadow-sky-500/10 transition-all",

  // Tables
  table: "w-full",
  tableHeader: "bg-slate-800/50 border-b border-slate-700",
  tableHeaderCell: "px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider",
  tableRow: "border-b border-slate-700 hover:bg-slate-700/30 transition-colors",
  tableCell: "px-6 py-4 text-sm text-slate-300",
  tableCellIcon: "flex items-center gap-2",

  // Buttons
  btnPrimary: "bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnSuccess: "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnDanger: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnWarning: "bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnSecondary: "bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors",
  btnSmall: "px-3 py-1 text-xs rounded font-medium transition-all",

  // Input Fields
  input: "w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors",
  inputLabel: "block text-sm font-medium text-slate-300 mb-2",
  formGroup: "mb-4",

  // Select & Dropdown
  select: "w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors",

  // Badges & Status
  badge: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
  badgeSuccess: "bg-emerald-900/50 text-emerald-200 border border-emerald-600/30",
  badgeWarning: "bg-amber-900/50 text-amber-200 border border-amber-600/30",
  badgeDanger: "bg-red-900/50 text-red-200 border border-red-600/30",
  badgeInfo: "bg-sky-900/50 text-sky-200 border border-sky-600/30",
  badgePending: "bg-orange-900/50 text-orange-200 border border-orange-600/30",

  // Modals & Dialogs
  modal: "fixed inset-0 bg-black/70 flex items-center justify-center z-50",
  modalContent: "bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto",
  modalHeader: "bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0",
  modalBody: "px-6 py-6",
  modalFooter: "border-t border-slate-700 px-6 py-4 flex justify-end gap-3",

  // Alerts
  alertSuccess: "bg-emerald-900/30 border border-emerald-600/30 text-emerald-200 rounded-lg p-4 mb-4",
  alertError: "bg-red-900/30 border border-red-600/30 text-red-200 rounded-lg p-4 mb-4",
  alertWarning: "bg-amber-900/30 border border-amber-600/30 text-amber-200 rounded-lg p-4 mb-4",
  alertInfo: "bg-sky-900/30 border border-sky-600/30 text-sky-200 rounded-lg p-4 mb-4",

  // Filters & Search
  filterContainer: "bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6",
  filterGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",

  // Empty State
  emptyState: "text-center py-12",
  emptyStateIcon: "text-5xl mb-4 opacity-50",
  emptyStateText: "text-slate-400",

  // Loading
  loadingSpinner: "text-center py-12",
  skeleton: "bg-slate-700 rounded-lg animate-pulse",

  // Pagination
  pagination: "flex justify-center items-center gap-2 mt-8",
  paginationBtn: "px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  paginationActive: "bg-sky-600 border-sky-600 text-white",
};

// Color scheme for different status types
export const statusColors = {
  PENDING: { bg: "bg-amber-900/50", border: "border-amber-600/30", text: "text-amber-200" },
  APPROVED: { bg: "bg-emerald-900/50", border: "border-emerald-600/30", text: "text-emerald-200" },
  REJECTED: { bg: "bg-red-900/50", border: "border-red-600/30", text: "text-red-200" },
  ACTIVE: { bg: "bg-emerald-900/50", border: "border-emerald-600/30", text: "text-emerald-200" },
  INACTIVE: { bg: "bg-slate-700", border: "border-slate-600", text: "text-slate-300" },
  COMPLETED: { bg: "bg-emerald-900/50", border: "border-emerald-600/30", text: "text-emerald-200" },
  CANCELLED: { bg: "bg-red-900/50", border: "border-red-600/30", text: "text-red-200" },
  DISPUTED: { bg: "bg-red-900/50", border: "border-red-600/30", text: "text-red-200" },
  VERIFIED: { bg: "bg-emerald-900/50", border: "border-emerald-600/30", text: "text-emerald-200" },
  UNVERIFIED: { bg: "bg-slate-700", border: "border-slate-600", text: "text-slate-300" },
};
