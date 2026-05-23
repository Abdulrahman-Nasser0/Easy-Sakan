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

interface AdminBookingsClientProps {
  token: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: '⏳ Pending Payment',
  CONFIRMED: '✅ Confirmed',
  COMPLETED: '✓ Completed',
  CANCELLED: '✕ Cancelled',
  EXPIRED: '⌛ Expired',
  DISPUTED: '⚠️ Disputed',
  REFUNDED: '↩ Refunded',
};

export default function AdminBookingsClient({ token }: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Action modals
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [disputeResolution, setDisputeResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminGetBookings(token, {
        page,
        pageSize: 20,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
      });

      if (response.isSuccess) {
        setBookings(response.data?.items || []);
        setTotalPages(response.data?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusStyle = (status: BookingStatus, hasDispute: boolean) => {
    if (hasDispute) return 'bg-orange-900/50 border-orange-600 text-orange-200';

    const styles: Record<string, string> = {
      PENDING_PAYMENT: 'bg-yellow-900/50 border-yellow-600 text-yellow-200',
      CONFIRMED: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
      COMPLETED: 'bg-blue-900/50 border-blue-600 text-blue-200',
      CANCELLED: 'bg-red-900/50 border-red-600 text-red-200',
      EXPIRED: 'bg-slate-700 border-slate-600 text-slate-300',
      DISPUTED: 'bg-orange-900/50 border-orange-600 text-orange-200',
      REFUNDED: 'bg-purple-900/50 border-purple-600 text-purple-200',
    };
    return styles[status] || styles.PENDING_PAYMENT;
  };

  const handleViewBooking = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleConfirmPayment = async (bookingId: number) => {
    console.log('🔵 Confirm Payment clicked for booking:', bookingId);
    setActionLoading(true);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      const response = await adminConfirmPayment(token, bookingId, {
        paymentMethod: "MANUAL",
        amountReceived: booking?.amountDue || 0,
        note: "Confirmed by admin"
      });
      console.log('🟢 Confirm Payment response:', response);
      if (response.isSuccess) {
        fetchBookings();
        setShowDetailModal(false);
      } else {
        setError(response.message || 'Failed to confirm payment');
      }
    } catch (err) {
      console.error('🔴 Confirm Payment error:', err);
      setError('Error confirming payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    setActionLoading(true);
    try {
      const response = await adminCompleteBooking(token, bookingId);
      if (response.isSuccess) {
        fetchBookings();
        setShowDetailModal(false);
      } else {
        setError(response.message || 'Failed to complete booking');
      }
    } catch (err) {
      setError('Error completing booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason) return;
    setActionLoading(true);

    try {
      const response = await adminCancelBooking(token, selectedBooking.id, cancelReason);
      if (response.isSuccess) {
        fetchBookings();
        setShowCancelModal(false);
        setShowDetailModal(false);
        setCancelReason('');
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Error cancelling booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDispute = async () => {
    if (!selectedBooking || !disputeResolution) return;
    setActionLoading(true);

    try {
      const response = await adminHandleDispute(token, selectedBooking.id, {
        disputeType: 'ADMIN_FLAG',
        description: disputeResolution,
        reportedBy: 'Admin',
      });
      if (response.isSuccess) {
        fetchBookings();
        setShowDisputeModal(false);
        setShowDetailModal(false);
        setDisputeResolution('');
      } else {
        setError(response.message || 'Failed to handle dispute');
      }
    } catch (err) {
      setError('Error handling dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedBooking || !refundAmount) return;
    setActionLoading(true);

    try {
      const response = await adminRefundBooking(token, selectedBooking.id, {
        refundAmount: parseFloat(refundAmount),
        refundMethod: 'BANK_TRANSFER',
        resolution: disputeResolution || 'Refund issued',
      });
      if (response.isSuccess) {
        fetchBookings();
        setShowRefundModal(false);
        setShowDetailModal(false);
        setRefundAmount('');
      } else {
        setError(response.message || 'Failed to process refund');
      }
    } catch (err) {
      setError('Error processing refund');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismissDispute = async (bookingId: number) => {
    setActionLoading(true);
    try {
      const response = await adminDismissDispute(token, bookingId, 'No valid evidence found');
      if (response.isSuccess) {
        fetchBookings();
        setShowDetailModal(false);
      } else {
        setError(response.message || 'Failed to dismiss dispute');
      }
    } catch (err) {
      setError('Error dismissing dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setPropertyFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const requestConfirmation = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by student, property..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="moveInDate">Move-in Date</option>
              <option value="amountDue">Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        <button onClick={resetFilters} className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          Reset Filters
        </button>
      </div>

      {/* Error */}
      {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">{error}</div>}

      {/* Bookings Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-slate-400 mb-4"></div>
            <p className="text-slate-400">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-50">📅</div>
            <p className="text-slate-400">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Move-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="text-white font-medium">{booking.studentName}</p>
                        {booking.studentContact && <p className="text-xs text-slate-400">{booking.studentContact}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{booking.propertyTitle}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(booking.moveInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(booking.status, booking.hasDispute)}`}>
                        {booking.hasDispute ? '⚠️ DISPUTED' : STATUS_LABELS[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {booking.amountDue.toLocaleString()} {booking.currency || 'EGP'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        booking.paymentStatus === 'CONFIRMED' ? 'bg-emerald-900/50 text-emerald-200' :
                        booking.paymentStatus === 'REFUNDED' ? 'bg-purple-900/50 text-purple-200' :
                        'bg-yellow-900/50 text-yellow-200'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 text-xs rounded font-medium transition-all"
                      >
                        View
                      </button>
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
          <div className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-lg font-bold text-white">Booking #{selectedBooking.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(selectedBooking.status, selectedBooking.hasDispute)}`}>
                  {selectedBooking.hasDispute ? '⚠️ DISPUTED' : STATUS_LABELS[selectedBooking.status] || selectedBooking.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  selectedBooking.paymentStatus === 'CONFIRMED' ? 'bg-emerald-900/50 text-emerald-200' :
                  selectedBooking.paymentStatus === 'REFUNDED' ? 'bg-purple-900/50 text-purple-200' :
                  'bg-yellow-900/50 text-yellow-200'
                }`}>
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Student</p>
                  <p className="text-white font-medium">{selectedBooking.studentName}</p>
                  {selectedBooking.studentContact && <p className="text-sm text-blue-400">{selectedBooking.studentContact}</p>}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Property</p>
                  <p className="text-white font-medium">{selectedBooking.propertyTitle}</p>
                  {selectedBooking.landlordName && <p className="text-sm text-slate-400">by {selectedBooking.landlordName}</p>}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Move-in Date</p>
                  <p className="text-white font-medium">{new Date(selectedBooking.moveInDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-blue-400">{selectedBooking.amountDue.toLocaleString()} {selectedBooking.currency || 'EGP'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Created</p>
                  <p className="text-white text-sm">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                {selectedBooking.paymentDeadline && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Payment Deadline</p>
                    <p className="text-yellow-300 text-sm">{new Date(selectedBooking.paymentDeadline).toLocaleString()}</p>
                  </div>
                )}
                {selectedBooking.paymentMethod && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Payment Method</p>
                    <p className="text-white text-sm">{selectedBooking.paymentMethod}</p>
                  </div>
                )}
                {selectedBooking.transactionReference && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Transaction Ref</p>
                    <p className="text-white text-sm font-mono">{selectedBooking.transactionReference}</p>
                  </div>
                )}
              </div>

              {/* Dispute Info */}
              {selectedBooking.hasDispute && (
                <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                  <p className="text-orange-300 font-medium mb-2">⚠️ Dispute Details</p>
                  <p className="text-sm text-orange-200/80">{selectedBooking.disputeDescription || 'No description provided'}</p>
                  <p className="text-xs text-orange-300/60 mt-2">Status: {selectedBooking.disputeStatus}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Actions */}
            <div className="border-t border-slate-700 px-6 py-4">
              <div className="flex flex-wrap gap-3">
                {selectedBooking.status === 'PENDING_PAYMENT' && (
                  <button
                    onClick={() => requestConfirmation(
                      'Confirm Payment',
                      `Are you sure you want to confirm payment of ${selectedBooking.amountDue.toLocaleString()} ${selectedBooking.currency || 'EGP'} for booking #${selectedBooking.id}?`,
                      () => handleConfirmPayment(selectedBooking.id)
                    )}
                    disabled={actionLoading}
                    className="bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading ? '⏳...' : '✅ Confirm Payment'}
                  </button>
                )}

                {selectedBooking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => requestConfirmation(
                      'Complete Booking',
                      `Mark booking #${selectedBooking.id} as completed? This will trigger the review period for the student.`,
                      () => handleCompleteBooking(selectedBooking.id)
                    )}
                    disabled={actionLoading}
                    className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading ? '⏳...' : '✓ Mark Complete'}
                  </button>
                )}

                {!selectedBooking.hasDispute && (selectedBooking.status === 'PENDING_PAYMENT' || selectedBooking.status === 'CONFIRMED') && (
                  <>
                    <button
                      onClick={() => { setShowDisputeModal(true); }}
                      className="bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      ⚠️ Flag Dispute
                    </button>
                    <button
                      onClick={() => { setShowCancelModal(true); }}
                      className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      ✕ Cancel Booking
                    </button>
                  </>
                )}

                {selectedBooking.hasDispute && selectedBooking.disputeStatus === 'OPEN' && (
                  <>
                    <button
                      onClick={() => { setShowRefundModal(true); }}
                      className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      ↩ Process Refund
                    </button>
                    <button
                      onClick={() => requestConfirmation(
                        'Dismiss Dispute',
                        `Dismiss the dispute on booking #${selectedBooking.id}? This will clear the dispute flag.`,
                        () => handleDismissDispute(selectedBooking.id)
                      )}
                      disabled={actionLoading}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? '⏳...' : 'Dismiss Dispute'}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-white mb-4">✕ Cancel Booking</h3>
            <p className="text-slate-300 mb-4">Are you sure you want to cancel booking #{selectedBooking?.id}?</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide reason for cancellation..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelModal(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Keep
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={actionLoading || !cancelReason}
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading ? '⏳...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-white mb-4">⚠️ Flag Dispute</h3>
            <p className="text-slate-300 mb-4">Describe the issue with booking #{selectedBooking?.id}</p>
            <textarea
              value={disputeResolution}
              onChange={(e) => setDisputeResolution(e.target.value)}
              placeholder="Describe the dispute details..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDisputeModal(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleOpenDispute}
                disabled={actionLoading || !disputeResolution}
                className="bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading ? '⏳...' : 'Flag Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-white mb-4">↩ Process Refund</h3>
            <p className="text-slate-300 mb-4">Process refund for booking #{selectedBooking?.id}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Refund Amount</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter refund amount"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Resolution Notes</label>
              <textarea
                value={disputeResolution}
                onChange={(e) => setDisputeResolution(e.target.value)}
                placeholder="Describe resolution..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRefundModal(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={actionLoading || !refundAmount}
                className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading ? '⏳...' : 'Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-white mb-4">{confirmTitle}</h3>
            <p className="text-slate-300 mb-6">{confirmMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (confirmAction) {
                    await confirmAction();
                    setShowConfirmModal(false);
                  }
                }}
                disabled={actionLoading}
                className="bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {actionLoading ? '⏳ Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
