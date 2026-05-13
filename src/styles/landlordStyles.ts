/**
 * Landlord Dashboard Unified Styling System
 * Provides consistent dark theme styling across all landlord components
 * Use these classes to maintain design consistency across the landlord flow
 */

export const landlordStyles = {
  // ============ CONTAINERS ============
  pageContainer: 'min-h-screen bg-slate-950',
  headerContainer: 'bg-gradient-to-r from-emerald-900 via-slate-800 to-slate-900 border-b border-emerald-700/30 sticky top-0 z-10',
  headerContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4',
  mainContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
  
  // ============ HEADERS & TITLES ============
  pageTitle: 'text-3xl font-bold text-white',
  pageSubtitle: 'text-slate-400 text-sm',
  sectionHeader: 'text-2xl font-bold bg-linear-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent',
  
  // ============ CARDS & CONTAINERS ============
  card: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-colors',
  cardWithHover: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-600/50 transition-all',
  cardNoBorder: 'bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm',
  
  // ============ STATS CARDS ============
  statCard: 'bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-emerald-600/50 transition-colors',
  statNumber: 'text-3xl font-bold text-emerald-400',
  statLabel: 'text-slate-400 text-sm',
  
  // ============ FORMS & INPUTS ============
  formGroup: 'space-y-2',
  inputLabel: 'block text-sm font-medium text-slate-300 mb-2',
  input: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all',
  select: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer',
  textarea: 'w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none',
  checkbox: 'w-5 h-5 rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer',
  formSection: 'bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 space-y-4',
  
  // ============ FILTERS ============
  filterContainer: 'bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm',
  filterGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // ============ BUTTONS ============
  btnBase: 'px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  btnPrimary: 'px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 disabled:opacity-50',
  btnSuccess: 'px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 disabled:opacity-50',
  btnDanger: 'px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all active:scale-95 disabled:opacity-50',
  btnWarning: 'px-4 py-2 rounded-lg font-medium bg-amber-600 hover:bg-amber-700 text-white transition-all active:scale-95 disabled:opacity-50',
  btnSecondary: 'px-4 py-2 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all active:scale-95 disabled:opacity-50',
  btnSmall: 'px-3 py-1 text-sm',
  btnOutline: 'px-4 py-2 rounded-lg font-medium border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-all',
  
  // ============ TABLES ============
  table: 'w-full',
  tableHeader: 'bg-slate-900/50 border-b border-slate-600',
  tableHeaderCell: 'px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider',
  tableRow: 'border-b border-slate-700 hover:bg-slate-700/30 transition-colors',
  tableCell: 'px-6 py-4 text-sm text-slate-200',
  tableIcon: 'text-lg',
  
  // ============ BADGES & STATUS ============
  badge: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
  badgeSuccess: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
  badgeError: 'bg-red-900/50 border-red-600 text-red-200',
  badgeWarning: 'bg-amber-900/50 border-amber-600 text-amber-200',
  badgeInfo: 'bg-blue-900/50 border-blue-600 text-blue-200',
  badgePending: 'bg-slate-700 border-slate-600 text-slate-300',
  
  // ============ ALERTS ============
  alertSuccess: 'mb-4 bg-emerald-900/30 border border-emerald-600 rounded-lg p-4 text-emerald-200',
  alertError: 'mb-4 bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-200',
  alertWarning: 'mb-4 bg-amber-900/30 border border-amber-600 rounded-lg p-4 text-amber-200',
  alertInfo: 'mb-4 bg-blue-900/30 border border-blue-600 rounded-lg p-4 text-blue-200',
  
  // ============ MODALS ============
  modal: 'bg-slate-800 rounded-lg shadow-2xl border border-slate-700 max-w-md w-full',
  modalLarge: 'bg-slate-800 rounded-lg shadow-2xl border border-slate-700 max-w-2xl w-full',
  modalContent: 'bg-slate-800 rounded-lg',
  modalHeader: 'sticky top-0 border-b border-slate-700 px-6 py-4 flex justify-between items-center',
  modalBody: 'p-6 space-y-6 max-h-[70vh] overflow-y-auto',
  modalFooter: 'border-t border-slate-700 px-6 py-4 flex justify-end gap-3',
  modalBackdrop: 'fixed inset-0 bg-black/70 z-40',
  
  // ============ EMPTY STATES ============
  emptyState: 'text-center py-12',
  emptyStateIcon: 'text-6xl mb-4',
  emptyStateText: 'text-slate-400 text-lg mt-2',
  emptyStateSubtext: 'text-slate-500 text-sm mt-1',
  
  // ============ LOADING ============
  loadingSpinner: 'inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-emerald-400',
  skeleton: 'bg-slate-700 animate-pulse rounded',
  
  // ============ PAGINATION ============
  pagination: 'flex justify-between items-center mt-8',
  paginationBtn: 'px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  
  // ============ PROPERTY CARDS ============
  propertyCard: 'bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-emerald-600/50 transition-all group',
  propertyImage: 'h-48 bg-slate-700 overflow-hidden relative group-hover:opacity-90 transition-opacity',
  propertyContent: 'p-4 space-y-3',
  propertyTitle: 'font-semibold text-white text-lg line-clamp-2',
  propertyPrice: 'text-2xl font-bold text-emerald-400',
  propertyMeta: 'text-xs text-slate-400 flex items-center gap-1',
  
  // ============ IMAGE UPLOAD ============
  uploadBox: 'border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer',
  uploadPlaceholder: 'text-slate-400 text-sm',
  imagePreview: 'relative rounded-lg overflow-hidden bg-slate-700 group',
  imagePreviewOverlay: 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2',
};

/**
 * Property Status Colors - Use with landlordStyles.badge
 */
export const propertyStatusColors: Record<string, string> = {
  PENDING_APPROVAL: 'bg-amber-900/50 border-amber-600 text-amber-200',
  APPROVED: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
  REJECTED: 'bg-red-900/50 border-red-600 text-red-200',
  DELETED: 'bg-slate-700 border-slate-600 text-slate-300',
  ACTIVE: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
  INACTIVE: 'bg-slate-700 border-slate-600 text-slate-300',
  DRAFT: 'bg-blue-900/50 border-blue-600 text-blue-200',
};

/**
 * Amenities Icons - For consistent display
 */
export const amenitiesIcons: Record<string, string> = {
  'WiFi': '📡',
  'AC': '❄️',
  'Elevator': '🛗',
  'Security': '🔒',
  'Parking': '🅿️',
  'Balcony': '🏠',
  'Kitchen': '🍳',
  'Furnished': '🛋️',
};
