/**
 * DEPRECATED: Prefer importing from '@/styles/designTokens' instead.
 * Backward-compatible aliases to the new light theme design tokens.
 */
export * from './designTokens';

export const studentStyles = {
  container: 'min-h-screen bg-white',
  pageContainer: 'max-w-7xl mx-auto px-6 py-8',
  cardContainer: 'bg-white border border-gray-200 rounded-lg',
  sectionHeader: 'text-2xl font-bold text-[#1a1a2e] mb-6 flex items-center gap-3',
  sectionSubtitle: 'text-gray-500 text-sm',
  card: 'bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors',
  cardWithHover: 'bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0071c2] hover:shadow-md transition-all',
  headerContainer: 'bg-white border-b border-gray-200',
  mainContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  pageTitle: 'text-2xl font-bold text-[#1a1a2e]',
  pageSubtitle: 'text-gray-500 text-sm mt-1',
  btnPrimary: 'bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-all',
  btnDanger: 'bg-[#cc0000] hover:bg-[#aa0000] text-white px-4 py-2 rounded-md font-medium transition-all',
  btnSecondary: 'border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] px-4 py-2 rounded-md font-medium transition-all bg-white',
  btnCancel: 'border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white',
  input: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm',
  inputLabel: 'block text-sm font-medium text-gray-600 mb-1.5',
  label: 'block text-sm font-medium text-gray-600 mb-1.5',
  select: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer',
  textarea: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none',
  modal: 'fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4',
  modalBackdrop: 'fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4',
  modalHeader: 'px-6 py-4 border-b border-gray-100',
  modalBody: 'px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto',
  modalFooter: 'px-6 py-4 border-t border-gray-100 flex justify-end gap-3',
  loadingSpinner: 'inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]',
  statCard: 'bg-white border border-gray-200 rounded-lg p-6',
  statNumber: 'text-3xl font-bold text-[#1a1a2e] mt-1',
  emptyState: 'text-center py-12 px-6 bg-white rounded-lg border border-gray-200',
  alertError: 'bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm',
};

export const bookingStatusColors: Record<string, string> = {
  PENDING_PAYMENT: 'text-[#b95000]', CONFIRMED: 'text-[#008009]', COMPLETED: 'text-[#0071c2]',
  CANCELLED: 'text-[#cc0000]', CANCELLED_BY_LANDLORD: 'text-[#cc0000]', EXPIRED: 'text-gray-500',
  DISPUTED: 'text-[#b95000]', REFUNDED: 'text-[#0071c2]', PENDING: 'text-[#b95000]',
};

export const paymentStatusColors: Record<string, string> = {
  PENDING: 'text-[#b95000]', CONFIRMED: 'text-[#008009]', REFUNDED: 'text-[#0071c2]',
  SUCCESS: 'text-[#008009]', FAILED: 'text-[#cc0000]',
};
