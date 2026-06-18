/**
 * 🎨 Easy Sakan Design Tokens
 * Light theme. Booking.com-inspired. Blue is the only accent color.
 */

export const layout = {
  page: 'min-h-screen bg-white',
  content: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  contentPadded: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
} as const;

export const header = {
  base: 'bg-white border-b border-gray-200',
  inner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
  title: 'text-2xl font-bold text-[#1a1a2e]',
  subtitle: 'text-gray-500 text-sm mt-1',
  section: 'text-2xl font-bold text-[#1a1a2e]',
  sectionSm: 'text-xl font-bold text-[#1a1a2e]',
} as const;

export const card = {
  base: 'bg-white border border-gray-200 rounded-lg p-6',
  hover: 'bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-[#0071c2] transition-all cursor-pointer',
  noBorder: 'bg-white rounded-lg p-6',
  stat: 'bg-white border border-gray-200 rounded-lg p-6',
  statNumber: 'text-3xl font-bold text-[#1a1a2e] mt-1',
  statLabel: 'text-gray-500 text-sm',
} as const;

export const button = {
  primary: 'bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors',
  secondary: 'border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] font-semibold text-sm px-5 py-2.5 rounded-md transition-colors bg-white',
  outline: 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] font-medium text-sm px-5 py-2.5 rounded-md transition-colors bg-white',
  danger: 'bg-[#cc0000] hover:bg-[#aa0000] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors',
  ghost: 'text-[#0071c2] hover:underline font-medium text-sm px-4 py-2 rounded-md transition-colors',
  success: 'bg-[#008009] hover:bg-[#006600] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors',
  warning: 'bg-[#b95000] hover:bg-[#9a4000] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-8 py-4 text-base',
} as const;

export const form = {
  input: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm',
  textarea: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none',
  select: 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer',
  label: 'block text-sm font-medium text-gray-600 mb-1.5',
  group: 'space-y-2',
  checkbox: 'flex items-center gap-2 cursor-pointer text-gray-600 hover:text-[#1a1a2e] transition-colors text-sm',
  section: 'bg-white border border-gray-200 rounded-lg p-6 space-y-4',
} as const;

export const table = {
  base: 'w-full',
  header: 'bg-[#f2f6fc] border-b border-gray-200',
  headerCell: 'px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
  row: 'border-b border-gray-100 hover:bg-[#f2f6fc] transition-colors',
  cell: 'px-6 py-4 text-sm text-[#1a1a2e]',
  cellIcon: 'flex items-center gap-2',
} as const;

export const badge = {
  success: 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf7eb] text-[#008009]',
  warning: 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff3e0] text-[#b95000]',
  danger: 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff0f0] text-[#cc0000]',
  info: 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3ff] text-[#0071c2]',
  neutral: 'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600',
} as const;

export function getBadgeStyle(status: string): string {
  const upper = status.toUpperCase();
  if (upper.includes('APPROVED') || upper.includes('CONFIRMED') || upper.includes('COMPLETED') || upper.includes('ACTIVE') || upper.includes('VERIFIED') || upper.includes('RESOLVED') || upper.includes('SUCCESS')) {
    return badge.success;
  }
  if (upper.includes('PENDING') || upper.includes('WAITING') || upper.includes('IN_PROGRESS') || upper.includes('PROGRESS') || upper.includes('IN_REVIEW') || upper.includes('OPEN')) {
    return badge.warning;
  }
  if (upper.includes('REJECTED') || upper.includes('CANCELLED') || upper.includes('CANCELED') || upper.includes('DELETED') || upper.includes('ERROR') || upper.includes('FAILED') || upper.includes('CLOSED') || upper.includes('INACTIVE') || upper.includes('FLAGGED') || upper.includes('DEACTIVATED')) {
    return badge.danger;
  }
  if (upper.includes('PENDING_PAYMENT') || upper.includes('DISPUTED') || upper.includes('REFUNDED')) {
    return badge.warning;
  }
  return badge.info;
}

export const alert = {
  success: 'bg-[#ebf7eb] border border-[#c3e6c3] text-[#008009] rounded-md p-4 text-sm',
  error: 'bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm',
  warning: 'bg-[#fff3e0] border border-[#f5d6a3] text-[#b95000] rounded-md p-4 text-sm',
  info: 'bg-[#ebf3ff] border border-[#b3d4f5] text-[#0071c2] rounded-md p-4 text-sm',
} as const;

export const modal = {
  backdrop: 'fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4',
  container: 'bg-white border border-gray-200 rounded-lg max-w-lg w-full shadow-xl',
  containerLg: 'bg-white border border-gray-200 rounded-lg max-w-2xl w-full shadow-xl',
  containerXl: 'bg-white border border-gray-200 rounded-lg max-w-4xl w-full shadow-xl',
  header: 'px-6 py-4 border-b border-gray-100 flex justify-between items-center',
  body: 'px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto',
  footer: 'px-6 py-4 border-t border-gray-100 flex justify-end gap-3',
  title: 'text-lg font-semibold text-[#1a1a2e]',
} as const;

export const pagination = {
  container: 'flex justify-center items-center gap-2 mt-8',
  button: 'px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600',
  active: 'bg-[#0071c2] border-[#0071c2] text-white hover:bg-[#005999]',
} as const;

export const filter = {
  container: 'bg-white border border-gray-200 rounded-lg p-6',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
} as const;

export const emptyState = {
  container: 'text-center py-12 px-6 bg-white rounded-lg border border-gray-200',
  icon: 'text-5xl mb-4 opacity-40',
  title: 'text-lg font-medium text-[#1a1a2e] mb-2',
  text: 'text-gray-500',
} as const;

export const loading = {
  spinner: 'inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]',
  spinnerLg: 'inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-[#0071c2]',
  skeleton: 'bg-gray-100 rounded-lg animate-pulse',
} as const;

export const propertyCard = {
  container: 'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all group',
  image: 'h-48 bg-gray-100 overflow-hidden relative',
  content: 'p-4 space-y-3',
  title: 'font-semibold text-[#1a1a2e] text-lg line-clamp-2',
  price: 'text-2xl font-bold text-[#0071c2]',
  meta: 'text-xs text-gray-500 flex items-center gap-1',
} as const;

export const upload = {
  box: 'border-2 border-dashed border-gray-200 rounded-md p-8 text-center hover:border-[#0071c2] transition-colors cursor-pointer',
  placeholder: 'text-gray-400 text-sm',
  preview: 'relative rounded-md overflow-hidden bg-gray-100 group',
  overlay: 'absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2',
} as const;

export const tokens = {
  layout, header, card, button, form, table, badge, alert, modal,
  pagination, filter, emptyState, loading, propertyCard, upload, getBadgeStyle,
} as const;
