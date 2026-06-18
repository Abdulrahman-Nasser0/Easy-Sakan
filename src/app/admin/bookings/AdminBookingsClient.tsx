'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  adminGetBookings,
  adminConfirmPayment,
  adminCancelBooking,
  adminCompleteBooking,
  adminHandleDispute,
  adminRefundBooking,
  adminDismissDispute,
} from '@/lib/api';
import { BookingStatus } from '@/lib/types';

interface BookingItem {
  id: number;
  studentId: number;
  studentName: string;
  studentContact?: string;
  propertyId: number;
  propertyTitle: string;
  landlordId?: number;
  landlordName?: string;
  status: BookingStatus;
  amountDue: number;
  amountPaid: number;
  currency?: string;
  moveInDate: string;
  paymentDeadline: string | null;
  paymentStatus: 'PENDING' | 'CONFIRMED' | 'REFUNDED';
  paymentMethod?: string;
  transactionReference?: string;
  hasDispute: boolean;
  disputeDescription?: string;
  disputeStatus?: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

interface AdminBookingsClientProps { token: string; }

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending Payment', CONFIRMED: 'Confirmed', COMPLETED: 'Completed',
  CANCELLED: 'Cancelled', EXPIRED: 'Expired', DISPUTED: 'Disputed', REFUNDED: 'Refunded',
};

// Reusable classes
const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm';
const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer';
const primaryBtn = 'bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm';
const dangerBtn = 'bg-[#cc0000] hover:bg-[#aa0000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm';
const ghostBtn = 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] px-4 py-2 rounded-md font-medium transition-colors bg-white text-sm';

function getStatusStyle(status: BookingStatus, hasDispute: boolean) {
  if (hasDispute) return 'bg-[#fff3e0] text-[#b95000]';
  const styles: Record<string, string> = {
    PENDING_PAYMENT: 'bg-[#fff3e0] text-[#b95000]', CONFIRMED: 'bg-[#ebf7eb] text-[#008009]',
    COMPLETED: 'bg-[#ebf3ff] text-[#0071c2]', CANCELLED: 'bg-[#fff0f0] text-[#cc0000]',
    EXPIRED: 'bg-gray-100 text-gray-500', DISPUTED: 'bg-[#fff3e0] text-[#b95000]',
    REFUNDED: 'bg-[#ebf3ff] text-[#0071c2]',
  };
  return styles[status] || styles.PENDING_PAYMENT;
}

function getPaymentStyle(status: string) {
  const styles: Record<string, string> = {
    CONFIRMED: 'bg-[#ebf7eb] text-[#008009]',
    REFUNDED: 'bg-[#ebf3ff] text-[#0071c2]',
    PENDING: 'bg-[#fff3e0] text-[#b95000]',
  };
  return styles[status] || styles.PENDING;
}

export default function AdminBookingsClient({ token }: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [disputeResolution, setDisputeResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await adminGetBookings(token, { page, pageSize: 20, status: statusFilter || undefined, search: searchTerm || undefined, sortBy, sortOrder });
      if (response.isSuccess) {
        setBookings(response.data?.items || []);
        setTotalPages(response.data?.totalPages || 1);
      } else { setError(response.message || 'Failed to fetch bookings'); }
    } catch { setError('Error fetching bookings'); }
    finally { setLoading(false); }
  }, [token, page, statusFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleConfirmPayment = async (bookingId: number) => {
    setActionLoading(true);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      const response = await adminConfirmPayment(token, bookingId, { paymentMethod: "MANUAL", amountReceived: booking?.amountDue || 0, note: "Confirmed by admin" });
      if (response.isSuccess) { fetchBookings(); setShowDetailModal(false); }
      else { setError(response.message || 'Failed to confirm payment'); }
    } catch { setError('Error confirming payment'); }
    finally { setActionLoading(false); }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    setActionLoading(true);
    try {
      const response = await adminCompleteBooking(token, bookingId);
      if (response.isSuccess) { fetchBookings(); setShowDetailModal(false); }
      else { setError(response.message || 'Failed to complete booking'); }
    } catch { setError('Error completing booking'); }
    finally { setActionLoading(false); }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason) return;
    setActionLoading(true);
    try {
      const response = await adminCancelBooking(token, selectedBooking.id, cancelReason);
      if (response.isSuccess) { fetchBookings(); setShowCancelModal(false); setShowDetailModal(false); setCancelReason(''); }
      else { setError(response.message || 'Failed to cancel booking'); }
    } catch { setError('Error cancelling booking'); }
    finally { setActionLoading(false); }
  };

  const handleOpenDispute = async () => {
    if (!selectedBooking || !disputeResolution) return;
    setActionLoading(true);
    try {
      const response = await adminHandleDispute(token, selectedBooking.id, { disputeType: 'ADMIN_FLAG', description: disputeResolution, reportedBy: 'Admin' });
      if (response.isSuccess) { fetchBookings(); setShowDisputeModal(false); setShowDetailModal(false); setDisputeResolution(''); }
      else { setError(response.message || 'Failed to handle dispute'); }
    } catch { setError('Error handling dispute'); }
    finally { setActionLoading(false); }
  };

  const handleRefund = async () => {
    if (!selectedBooking || !refundAmount) return;
    setActionLoading(true);
    try {
      const response = await adminRefundBooking(token, selectedBooking.id, { refundAmount: parseFloat(refundAmount), refundMethod: 'BANK_TRANSFER', resolution: disputeResolution || 'Refund issued' });
      if (response.isSuccess) { fetchBookings(); setShowRefundModal(false); setShowDetailModal(false); setRefundAmount(''); }
      else { setError(response.message || 'Failed to process refund'); }
    } catch { setError('Error processing refund'); }
    finally { setActionLoading(false); }
  };

  const handleDismissDispute = async (bookingId: number) => {
    setActionLoading(true);
    try {
      const response = await adminDismissDispute(token, bookingId, 'No valid evidence found');
      if (response.isSuccess) { fetchBookings(); setShowDetailModal(false); }
      else { setError(response.message || 'Failed to dismiss dispute'); }
    } catch { setError('Error dismissing dispute'); }
    finally { setActionLoading(false); }
  };

  const resetFilters = () => { setStatusFilter(''); setSearchTerm(''); setSortBy('createdAt'); setSortOrder('desc'); setPage(1); };

  return (
    <>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Search</label>
            <input type="text" placeholder="Search by student, property..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Status</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
              <option value="DISPUTED">Disputed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Sort By</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className={selectClass}>
              <option value="createdAt">Created Date</option>
              <option value="moveInDate">Move-in Date</option>
              <option value="amountDue">Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Order</label>
            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }} className={selectClass}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        <button onClick={resetFilters} className="mt-4 border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] px-4 py-2 rounded-md font-medium transition-colors bg-white text-sm">
          Reset Filters
        </button>
      </div>

      {/* Error */}
      {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 mb-6 text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2] mb-4"></div>
            <p className="text-gray-500 text-sm">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-40">📅</div>
            <p className="text-gray-500">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f2f6fc] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Move-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-[#f2f6fc] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1a1a2e] font-mono">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="text-[#1a1a2e] font-medium">{booking.studentName}</p>
                        {booking.studentContact && <p className="text-xs text-gray-500">{booking.studentContact}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a1a2e]">{booking.propertyTitle}</td>
                    <td className="px-6 py-4 text-sm text-[#1a1a2e]">{new Date(booking.moveInDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(booking.status, booking.hasDispute)}`}>
                        {booking.hasDispute ? 'DISPUTED' : STATUS_LABELS[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1a1a2e]">{booking.amountDue.toLocaleString()} {booking.currency || 'EGP'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getPaymentStyle(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }} className={primaryBtn}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">← Previous</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">Next →</button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-[#1a1a2e]">Booking #{selectedBooking.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-[#1a1a2e] text-xl">&times;</button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(selectedBooking.status, selectedBooking.hasDispute)}`}>
                  {selectedBooking.hasDispute ? 'DISPUTED' : STATUS_LABELS[selectedBooking.status] || selectedBooking.status}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStyle(selectedBooking.paymentStatus)}`}>
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Student', value: selectedBooking.studentName, sub: selectedBooking.studentContact },
                  { label: 'Property', value: selectedBooking.propertyTitle, sub: selectedBooking.landlordName ? `by ${selectedBooking.landlordName}` : '' },
                  { label: 'Move-in Date', value: new Date(selectedBooking.moveInDate).toLocaleDateString() },
                  { label: 'Amount', value: `${selectedBooking.amountDue.toLocaleString()} ${selectedBooking.currency || 'EGP'}`, big: true },
                  { label: 'Created', value: new Date(selectedBooking.createdAt).toLocaleString() },
                  ...(selectedBooking.paymentDeadline ? [{ label: 'Payment Deadline', value: new Date(selectedBooking.paymentDeadline).toLocaleString(), warn: true }] : []),
                  ...(selectedBooking.paymentMethod ? [{ label: 'Payment Method', value: selectedBooking.paymentMethod }] : []),
                  ...(selectedBooking.transactionReference ? [{ label: 'Transaction Ref', value: selectedBooking.transactionReference, mono: true }] : []),
                ].map(item => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-md p-4">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`${item.big ? 'text-2xl font-bold text-[#0071c2]' : 'text-sm font-medium text-[#1a1a2e]'} ${item.warn ? 'text-[#b95000]' : ''} ${item.mono ? 'font-mono' : ''}`}>
                      {item.value}
                    </p>
                    {item.sub && <p className="text-sm text-gray-500">{item.sub}</p>}
                  </div>
                ))}
              </div>
              {selectedBooking.hasDispute && (
                <div className="bg-[#fff3e0] border border-[#f5d6a3] rounded-md p-4">
                  <p className="text-[#b95000] font-medium mb-2">Dispute Details</p>
                  <p className="text-sm text-[#b95000]/80">{selectedBooking.disputeDescription || 'No description provided'}</p>
                  <p className="text-xs text-[#b95000]/60 mt-2">Status: {selectedBooking.disputeStatus}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                {selectedBooking.status === 'PENDING_PAYMENT' && (
                  <button onClick={() => handleConfirmPayment(selectedBooking.id)} disabled={actionLoading}
                    className="bg-[#008009] hover:bg-[#006600] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50">
                    {actionLoading ? 'Processing...' : 'Confirm Payment'}
                  </button>
                )}
                {selectedBooking.status === 'CONFIRMED' && (
                  <button onClick={() => handleCompleteBooking(selectedBooking.id)} disabled={actionLoading}
                    className={primaryBtn}>
                    {actionLoading ? 'Processing...' : 'Mark Complete'}
                  </button>
                )}
                {!selectedBooking.hasDispute && (selectedBooking.status === 'PENDING_PAYMENT' || selectedBooking.status === 'CONFIRMED') && (
                  <>
                    <button onClick={() => { setShowDisputeModal(true); }}
                      className="bg-[#b95000] hover:bg-[#9a4000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">Flag Dispute</button>
                    <button onClick={() => { setShowCancelModal(true); }} className={dangerBtn}>Cancel Booking</button>
                  </>
                )}
                {selectedBooking.hasDispute && selectedBooking.disputeStatus === 'OPEN' && (
                  <>
                    <button onClick={() => { setShowRefundModal(true); }}
                      className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">Process Refund</button>
                    <button onClick={() => handleDismissDispute(selectedBooking.id)} disabled={actionLoading}
                      className={ghostBtn}>{actionLoading ? 'Processing...' : 'Dismiss Dispute'}</button>
                  </>
                )}
                <button onClick={() => setShowDetailModal(false)} className={ghostBtn}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4 text-sm">Are you sure you want to cancel booking #{selectedBooking?.id}?</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide reason for cancellation..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none mb-4"
              rows={3} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelModal(false)} className={ghostBtn}>Keep</button>
              <button onClick={handleCancelBooking} disabled={actionLoading || !cancelReason}
                className={dangerBtn}>{actionLoading ? 'Processing...' : 'Confirm Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Flag Dispute</h3>
            <p className="text-gray-600 mb-4 text-sm">Describe the issue with booking #{selectedBooking?.id}</p>
            <textarea value={disputeResolution} onChange={(e) => setDisputeResolution(e.target.value)}
              placeholder="Describe the dispute details..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none mb-4"
              rows={3} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDisputeModal(false)} className={ghostBtn}>Cancel</button>
              <button onClick={handleOpenDispute} disabled={actionLoading || !disputeResolution}
                className="bg-[#b95000] hover:bg-[#9a4000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Flag Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Process Refund</h3>
            <p className="text-gray-600 mb-4 text-sm">Process refund for booking #{selectedBooking?.id}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Refund Amount</label>
              <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter refund amount" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Resolution Notes</label>
              <textarea value={disputeResolution} onChange={(e) => setDisputeResolution(e.target.value)}
                placeholder="Describe resolution..." className={inputClass} rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRefundModal(false)} className={ghostBtn}>Cancel</button>
              <button onClick={handleRefund} disabled={actionLoading || !refundAmount}
                className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
