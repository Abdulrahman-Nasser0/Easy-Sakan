'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings, cancelBookingRequest } from '@/lib/api';
import { studentStyles, bookingStatusColors, paymentStatusColors } from '@/styles/studentStyles';

type ApiBookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'DISPUTED' | 'REFUNDED';

interface BookingSummary {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  expired: number;
}

interface BookingItem {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyImage?: string;
  propertyLocation?: string;
  status: ApiBookingStatus;
  amountDue: number;
  currency: string;
  moveInDate: string;
  paymentDeadline: string | null;
  timeLeftSeconds: number | null;
  paymentInstructions?: {
    method: string;
    walletNumber: string;
    accountName?: string;
    steps: string[];
  } | null;
  whatsappLink?: string | null;
  landlordContact?: {
    name: string;
    phone: string;
  } | null;
  trustPeriodEndsAt?: string | null;
  canReview?: boolean;
  reviewId?: number | null;
  canCancel?: boolean;
  createdAt: string;
}

interface MyBookingsClientProps {
  token: string;
}

// Countdown timer helper component
function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const deadline = new Date(expiresAt).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('EXPIRED');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (expired) {
    return <span className="text-red-400 font-mono font-bold">Expired</span>;
  }

  return (
    <span className={`font-mono font-bold ${timeLeft.startsWith('0') ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
      {timeLeft}
    </span>
  );
}

export function MyBookingsClient({ token }: MyBookingsClientProps) {
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, token]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMyBookings(token, page, 10, statusFilter || undefined);

      if (!response.isSuccess) {
        setError(response.message || 'Failed to load bookings');
        setLoading(false);
        return;
      }

      if (response.data?.items && Array.isArray(response.data.items)) {
        setBookings(response.data.items);
        setTotalPages(response.data.totalPages || 1);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    setCancelLoading(true);

    try {
      const response = await cancelBookingRequest(token, selectedBookingId, cancelReason || undefined);
      if (response.isSuccess) {
        setBookings(bookings.map(b =>
          b.id === selectedBookingId ? { ...b, status: 'CANCELLED' } : b
        ));
        setCancelDialogOpen(false);
        setSelectedBookingId(null);
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status: ApiBookingStatus) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: 'bg-yellow-900/50 border-yellow-600 text-yellow-200',
      CONFIRMED: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
      COMPLETED: 'bg-blue-900/50 border-blue-600 text-blue-200',
      CANCELLED: 'bg-red-900/50 border-red-600 text-red-200',
      EXPIRED: 'bg-slate-700 border-slate-600 text-slate-300',
      DISPUTED: 'bg-orange-900/50 border-orange-600 text-orange-200',
      REFUNDED: 'bg-purple-900/50 border-purple-600 text-purple-200',
    };
    return colors[status] || colors.PENDING_PAYMENT;
  };

  const formatStatus = (status: ApiBookingStatus) => {
    const labels: Record<string, string> = {
      PENDING_PAYMENT: '⏳ Pending Payment',
      CONFIRMED: '✅ Confirmed',
      COMPLETED: '✓ Completed',
      CANCELLED: '✕ Cancelled',
      EXPIRED: '⌛ Expired',
      DISPUTED: '⚠️ Disputed',
      REFUNDED: '↩ Refunded',
    };
    return labels[status] || status;
  };

  return (
    <div className={studentStyles.pageContainer}>
      <div className={studentStyles.mainContent}>
        {/* Header */}
        <div className="mb-8">
          <h1 className={studentStyles.pageTitle}>📅 My Bookings</h1>
          <p className={studentStyles.pageSubtitle}>View and manage your property bookings</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: 'Pending', count: summary.pending, color: 'bg-yellow-600/20 border-yellow-600/30 text-yellow-300' },
              { label: 'Confirmed', count: summary.confirmed, color: 'bg-emerald-600/20 border-emerald-600/30 text-emerald-300' },
              { label: 'Completed', count: summary.completed, color: 'bg-sky-600/20 border-sky-600/30 text-sky-300' },
              { label: 'Cancelled', count: summary.cancelled, color: 'bg-red-600/20 border-red-600/30 text-red-300' },
              { label: 'Expired', count: summary.expired, color: 'bg-slate-600/20 border-slate-600/30 text-slate-300' },
            ].map(item => (
              <div key={item.label} className={`${item.color} border rounded-lg p-3 text-center`}>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs mt-1 opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => { setStatusFilter(''); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === '' 
                ? studentStyles.btnPrimary
                : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {(['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED'] as ApiBookingStatus[]).map(status => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status 
                  ? studentStyles.btnPrimary
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
              }`}
            >
              {formatStatus(status)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`${studentStyles.alertError} mb-6`}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={studentStyles.loadingSpinner}></div>
              <p className="text-slate-300 mt-4">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length === 0 ? (
          <div className={`${studentStyles.emptyState} mb-8`}>
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-300 text-lg mb-6">No bookings found</p>
            <Link href="/properties" className={studentStyles.btnPrimary}>
              Browse Properties →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 mb-8">
            {bookings.map(booking => (
              <div key={booking.id} className={studentStyles.card}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Booking Info */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{booking.propertyTitle}</h3>
                        <p className="text-sm text-slate-400">Booking ID: #{booking.id}</p>
                        {booking.propertyLocation && (
                          <p className="text-sm text-slate-500">📍 {booking.propertyLocation}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    {/* Payment Timer - for PENDING_PAYMENT bookings */}
                    {booking.status === 'PENDING_PAYMENT' && booking.paymentDeadline && (
                      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300 text-sm font-medium">⏳ Payment Deadline:</span>
                          <CountdownTimer expiresAt={booking.paymentDeadline} />
                        </div>
                        {booking.timeLeftSeconds && (
                          <p className="text-yellow-400/60 text-xs mt-1">
                            Complete payment within 48 hours to secure your booking
                          </p>
                        )}
                      </div>
                    )}

                    {/* Trust Period - for CONFIRMED bookings */}
                    {booking.status === 'CONFIRMED' && booking.trustPeriodEndsAt && (
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300 text-sm font-medium">🛡️ Trust Period ends:</span>
                          <CountdownTimer expiresAt={booking.trustPeriodEndsAt} />
                        </div>
                        <p className="text-sky-400/60 text-xs mt-1">
                          You can report issues within the 72-hour trust period
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Move-in Date</p>
                        <p className="font-medium text-white">
                          {new Date(booking.moveInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Amount Due</p>
                        <p className="font-medium text-sky-400">
                          {booking.amountDue.toLocaleString()} {booking.currency}
                        </p>
                      </div>
                    </div>

                    {/* Landlord Contact (after CONFIRMED) */}
                    {booking.landlordContact && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-2">👤 Landlord Contact</p>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-white font-medium">{booking.landlordContact.name}</p>
                          <a href={`tel:${booking.landlordContact.phone}`} className="text-sky-400 hover:text-blue-300 text-sm">
                            📞 {booking.landlordContact.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Payment Instructions */}
                    {booking.paymentInstructions && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-2">💳 Payment Instructions</p>
                        <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                          <p className="text-white text-sm">
                            Method: <span className="font-bold text-yellow-400">{booking.paymentInstructions.method}</span>
                          </p>
                          <p className="text-white text-sm">
                            Wallet: <span className="font-mono text-sky-400">{booking.paymentInstructions.walletNumber}</span>
                          </p>
                          {booking.paymentInstructions.accountName && (
                            <p className="text-white text-sm">
                              Account: <span className="font-medium">{booking.paymentInstructions.accountName}</span>
                            </p>
                          )}
                          {booking.paymentInstructions.steps.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mt-2 mb-1">Steps:</p>
                              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                                {booking.paymentInstructions.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          {booking.whatsappLink && (
                            <a
                              href={booking.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                            >
                              💬 Send via WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Review Section for COMPLETED bookings */}
                    {booking.status === 'COMPLETED' && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        {booking.canReview ? (
                          <Link
                            href={`/properties/${booking.propertyId}/review?bookingId=${booking.id}`}
                            className={`${studentStyles.btnPrimary} inline-flex items-center gap-2 text-sm`}
                          >
                            ⭐ Write a Review
                          </Link>
                        ) : booking.reviewId ? (
                          <p className="text-sm text-sky-400">⭐ Review submitted ✓</p>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1">
                    <div className="bg-sky-600/10 border border-sky-600/30 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-400">Amount Due</p>
                      <p className="text-2xl font-bold text-sky-400">
                        {booking.amountDue.toLocaleString()} {booking.currency}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {booking.status === 'PENDING_PAYMENT' ? 'Payment required to confirm' :
                         booking.status === 'CONFIRMED' ? 'Payment confirmed ✓' :
                         booking.status === 'COMPLETED' ? 'Transaction completed ✓' :
                         booking.status}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className={`${studentStyles.btnSecondary} text-center text-sm`}
                      >
                        View Property
                      </Link>
                      {booking.canCancel && booking.status === 'PENDING_PAYMENT' && (
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className={`${studentStyles.btnDanger} text-sm`}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                page === 1
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    p === page
                      ? studentStyles.btnPrimary
                      : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                page === totalPages
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Cancel Booking Dialog */}
      {cancelDialogOpen && (
        <div className={studentStyles.modalBackdrop}>
          <div className={studentStyles.modal}>
            <div className={studentStyles.modalHeader}>
              <h2 className="text-lg font-bold text-white">⚠️ Cancel Booking</h2>
            </div>

            <div className={studentStyles.modalBody}>
              <p className="text-slate-300 mb-4">
                Are you sure you want to cancel this booking? Your reserved slot will be released.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Optional: Tell us why you're canceling (max 200 characters)"
                maxLength={200}
                className={`${studentStyles.textarea} mb-4`}
                rows={3}
                disabled={cancelLoading}
              />
            </div>

            <div className={studentStyles.modalFooter}>
              <button
                onClick={() => setCancelDialogOpen(false)}
                disabled={cancelLoading}
                className={`${studentStyles.btnSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className={`${studentStyles.btnDanger} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {cancelLoading ? '⏳ Canceling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
