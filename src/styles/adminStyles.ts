// Admin Panel Styling Constants
// Unified styling for all admin components

export const adminStyles = {
  // Containers
  container: "min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white",
  pageContainer: "max-w-7xl mx-auto px-6 py-8",
  cardContainer: "bg-slate-800 border border-slate-700 rounded-lg",
  
  // Headers & Section Headers
  sectionHeader: "text-2xl font-bold text-white mb-6 flex items-center gap-3",
  sectionSubtitle: "text-slate-400 text-sm",
  
  // Cards & Panels
  card: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors",
  cardWithHover: "bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-700/50 transition-all",
  
  // Tables
  table: "w-full",
  tableHeader: "bg-slate-700 border-b border-slate-600",
  tableHeaderCell: "px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider",
  tableRow: "border-b border-slate-700 hover:bg-slate-700/50 transition-colors",
  tableCell: "px-6 py-4 text-sm text-slate-300",
  tableCellIcon: "flex items-center gap-2",
  
  // Buttons
  btnPrimary: "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnSuccess: "bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnDanger: "bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnWarning: "bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-lg font-medium transition-all",
  btnSecondary: "bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors",
  btnSmall: "px-3 py-1 text-xs rounded font-medium transition-all",
  
  // Input Fields
  input: "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors",
  inputLabel: "block text-sm font-medium text-slate-300 mb-2",
  formGroup: "mb-4",
  
  // Select & Dropdown
  select: "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors",
  
  // Badges & Status
  badge: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
  badgeSuccess: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  badgeWarning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  badgeDanger: "bg-red-500/20 text-red-300 border border-red-500/30",
  badgeInfo: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  badgePending: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  
  // Modals & Dialogs
  modal: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50",
  modalContent: "bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto",
  modalHeader: "bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0",
  modalBody: "px-6 py-6",
  modalFooter: "border-t border-slate-700 px-6 py-4 flex justify-end gap-3",
  
  // Alerts
  alertSuccess: "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg p-4 mb-4",
  alertError: "bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-4 mb-4",
  alertWarning: "bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg p-4 mb-4",
  alertInfo: "bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg p-4 mb-4",
  
  // Filters & Search
  filterContainer: "bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6",
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
  paginationActive: "bg-blue-600 border-blue-600 text-white",
};

// Color scheme for different status types
export const statusColors = {
  PENDING: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-300" },
  APPROVED: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-300" },
  REJECTED: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-300" },
  ACTIVE: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-300" },
  INACTIVE: { bg: "bg-slate-500/20", border: "border-slate-500/30", text: "text-slate-300" },
  COMPLETED: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-300" },
  CANCELLED: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-300" },
  DISPUTED: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-300" },
  VERIFIED: { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-300" },
  UNVERIFIED: { bg: "bg-slate-500/20", border: "border-slate-500/30", text: "text-slate-300" },
};
