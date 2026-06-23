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

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const deadline = new Date(expiresAt).getTime();
      const diff = deadline - now;
      if (diff <= 0) { setExpired(true); setTimeLeft('EXPIRED'); return; }
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

  if (expired) return <span className="text-[#cc0000] font-mono font-bold">Expired</span>;
  return (
    <span className={`font-mono font-bold ${timeLeft.startsWith('0') ? 'text-[#cc0000] animate-pulse' : 'text-[#b95000]'}`}>
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

  useEffect(() => { fetchBookings(); }, [page, statusFilter, token]);

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
        if (response.data.summary) setSummary(response.data.summary);
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
        setBookings(bookings.map(b => b.id === selectedBookingId ? { ...b, status: 'CANCELLED' } : b));
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
      PENDING_PAYMENT: 'bg-[#fff3e0] text-[#b95000]',
      CONFIRMED: 'bg-[#ebf7eb] text-[#008009]',
      COMPLETED: 'bg-[#ebf3ff] text-[#0071c2]',
      CANCELLED: 'bg-[#fff0f0] text-[#cc0000]',
      EXPIRED: 'bg-gray-100 text-gray-500',
      DISPUTED: 'bg-[#fff3e0] text-[#b95000]',
      REFUNDED: 'bg-[#ebf3ff] text-[#0071c2]',
    };
    return colors[status] || colors.PENDING_PAYMENT;
  };

  const formatStatus = (status: ApiBookingStatus) => {
    const labels: Record<string, string> = {
      PENDING_PAYMENT: 'Pending Payment',
      CONFIRMED: 'Confirmed',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      EXPIRED: 'Expired',
      DISPUTED: 'Disputed',
      REFUNDED: 'Refunded',
    };
    return labels[status] || status;
  };

  const activeBtn = 'bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm';
  const inactiveBtn = 'bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2] hover:text-[#0071c2] px-4 py-2 rounded-md font-medium transition-colors text-sm';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your property bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: 'Pending', count: summary.pending, color: 'bg-[#fff3e0] text-[#b95000]' },
              { label: 'Confirmed', count: summary.confirmed, color: 'bg-[#ebf7eb] text-[#008009]' },
              { label: 'Completed', count: summary.completed, color: 'bg-[#ebf3ff] text-[#0071c2]' },
              { label: 'Cancelled', count: summary.cancelled, color: 'bg-[#fff0f0] text-[#cc0000]' },
              { label: 'Expired', count: summary.expired, color: 'bg-gray-100 text-gray-500' },
            ].map(item => (
              <div key={item.label} className={`${item.color} border border-gray-200 rounded-lg p-3 text-center`}>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs mt-1 opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => { setStatusFilter(''); setPage(1); }} className={statusFilter === '' ? activeBtn : inactiveBtn}>All</button>
          {(['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED'] as ApiBookingStatus[]).map(status => (
            <button key={status} onClick={() => { setStatusFilter(status); setPage(1); }} className={statusFilter === status ? activeBtn : inactiveBtn}>
              {formatStatus(status)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm mb-6">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
              <p className="text-gray-500 mt-4 text-sm">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-lg border border-gray-200 mb-8">
            <div className="text-4xl mb-4 opacity-40">📭</div>
            <p className="text-[#1a1a2e] text-lg mb-6">No bookings found</p>
            <Link href="/properties" className={activeBtn}>
              Browse Properties →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 mb-8">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Info */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a2e]">{booking.propertyTitle}</h3>
                        <p className="text-sm text-gray-500">Booking ID: #{booking.id}</p>
                        {booking.propertyLocation && (
                          <p className="text-sm text-gray-500">📍 {booking.propertyLocation}</p>
                        )}
                      </div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    {/* Payment Timer */}
                    {booking.status === 'PENDING_PAYMENT' && booking.paymentDeadline && (
                      <div className="bg-[#fff3e0] border border-[#f5d6a3] rounded-md p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#b95000] text-sm font-medium">Payment Deadline:</span>
                          <CountdownTimer expiresAt={booking.paymentDeadline} />
                        </div>
                        {booking.timeLeftSeconds && (
                          <p className="text-[#b95000]/60 text-xs mt-1">
                            Complete payment within 48 hours to secure your booking
                          </p>
                        )}
                      </div>
                    )}

                    {/* Trust Period */}
                    {booking.status === 'CONFIRMED' && booking.trustPeriodEndsAt && (
                      <div className="bg-[#ebf3ff] border border-[#b3d4f5] rounded-md p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#0071c2] text-sm font-medium">Trust Period ends:</span>
                        </div>
                        <p className="text-[#0071c2]/60 text-xs mt-1">
                          You can report issues within the 72-hour trust period
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Move-in Date</p>
                        <p className="font-medium text-[#1a1a2e]">{new Date(booking.moveInDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount Due</p>
                        <p className="font-medium text-[#0071c2]">{booking.amountDue.toLocaleString()} {booking.currency}</p>
                      </div>
                    </div>

                    {/* Landlord Contact */}
                    {booking.landlordContact && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">👤 Landlord Contact</p>
                        <div className="bg-white border border-gray-200 rounded-md p-3">
                          <p className="text-[#1a1a2e] font-medium">{booking.landlordContact.name}</p>
                          <a href={`tel:${booking.landlordContact.phone}`} className="text-[#0071c2] hover:text-[#005999] text-sm">
                            📞 {booking.landlordContact.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Payment Instructions */}
                    {booking.paymentInstructions && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">💳 Payment Instructions</p>
                        <div className="bg-white border border-gray-200 rounded-md p-3 space-y-2">
                          <p className="text-[#1a1a2e] text-sm">
                            Method: <span className="font-bold text-[#b95000]">{booking.paymentInstructions.method}</span>
                          </p>
                          <p className="text-[#1a1a2e] text-sm">
                            Wallet: <span className="font-mono text-[#0071c2]">{booking.paymentInstructions.walletNumber}</span>
                          </p>
                          {booking.paymentInstructions.accountName && (
                            <p className="text-[#1a1a2e] text-sm">
                              Account: <span className="font-medium">{booking.paymentInstructions.accountName}</span>
                            </p>
                          )}
                          {booking.paymentInstructions.steps.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mt-2 mb-1">Steps:</p>
                              <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                                {booking.paymentInstructions.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          {booking.whatsappLink && (
                            <a href={booking.whatsappLink} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#008009] hover:bg-[#006600] text-white text-sm rounded-md transition-colors">
                              💬 Send via WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Review */}
                    {booking.status === 'COMPLETED' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {booking.canReview ? (
                          <Link href={`/properties/${booking.propertyId}/review?bookingId=${booking.id}`}
                            className={`${activeBtn} inline-flex items-center gap-2`}>
                            ⭐ Write a Review
                          </Link>
                        ) : booking.reviewId ? (
                          <p className="text-sm text-[#0071c2]">⭐ Review submitted ✓</p>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Amount + Actions */}
                  <div className="md:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
                      <p className="text-sm text-gray-500">Amount Due</p>
                      <p className="text-2xl font-bold text-[#0071c2]">{booking.amountDue.toLocaleString()} {booking.currency}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.status === 'PENDING_PAYMENT' ? 'Payment required to confirm' :
                         booking.status === 'CONFIRMED' ? 'Payment confirmed ✓' :
                         booking.status === 'COMPLETED' ? 'Transaction completed ✓' : booking.status}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/properties/${booking.propertyId}`}
                        className="border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] px-4 py-2 rounded-md font-medium transition-colors bg-white text-sm text-center">
                        View Property
                      </Link>
                      {booking.canCancel && booking.status === 'PENDING_PAYMENT' && (
                        <button onClick={() => handleCancelClick(booking.id)}
                          className="bg-[#cc0000] hover:bg-[#aa0000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
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
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${page === 1 ? 'bg-white text-gray-300 border border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2] hover:text-[#0071c2]'}`}>
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-md font-medium transition-colors text-sm ${p === page ? activeBtn : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2] hover:text-[#0071c2]'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${page === totalPages ? 'bg-white text-gray-300 border border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0071c2] hover:text-[#0071c2]'}`}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#1a1a2e]">Cancel Booking</h2>
            </div>
            <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-600 mb-4 text-sm">
                Are you sure you want to cancel this booking? Your reserved slot will be released.
              </p>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Optional: Tell us why you're canceling (max 200 characters)"
                maxLength={200}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none mb-4"
                rows={3} disabled={cancelLoading} />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setCancelDialogOpen(false)} disabled={cancelLoading}
                className="border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Keep Booking
              </button>
              <button onClick={handleConfirmCancel} disabled={cancelLoading}
                className="bg-[#cc0000] hover:bg-[#aa0000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {cancelLoading ? 'Canceling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
