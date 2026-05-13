'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings, cancelBookingRequest } from '@/lib/api';
import { BookingStatus } from '@/lib/types';
import { studentStyles, bookingStatusColors, paymentStatusColors } from '@/styles/studentStyles';

interface Booking {
  id: number;
  propertyId: number;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: 'PENDING' | 'CONFIRMED' | 'REFUNDED';
  createdAt: string;
}

interface MyBookingsClientProps {
  token: string;
}

export function MyBookingsClient({ token }: MyBookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
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
      console.log('📤 Fetching bookings with token:', token?.substring(0, 20) + '...');
      const response = await getMyBookings(token, page, 10, statusFilter || undefined);
      
      console.log('📥 Bookings response:', response);
      console.log('✅ isSuccess:', response.isSuccess);
      console.log('📊 data:', response.data);

      if (!response.isSuccess) {
        console.log('❌ Response not successful:', response.message);
        setError(response.message || 'Failed to load bookings');
        setLoading(false);
        return;
      }

      // Handle different response data structures
      let bookingsList: Booking[] = [];
      let pages = 1;

      if (response.data?.items && Array.isArray(response.data.items)) {
        // Standard paginated response: { items: [], totalPages: 1 }
        bookingsList = response.data.items;
        pages = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        // Direct array response
        bookingsList = response.data;
        pages = 1;
      } else if (response.data && typeof response.data === 'object') {
        // Response is an object, maybe it's a single booking wrapped
        console.warn('⚠️ Unexpected response data structure:', response.data);
        setError('Unexpected response format from server');
        setLoading(false);
        return;
      }

      console.log('✅ Loaded bookings:', bookingsList.length);
      setBookings(bookingsList);
      setTotalPages(pages);
    } catch (err) {
      console.log('❌ Error fetching bookings:', err);
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
      const response = await cancelBookingRequest(token, selectedBookingId, cancelReason);

      if (response.isSuccess) {
        setBookings(bookings.map(b =>
          b.id === selectedBookingId ? { ...b, status: 'CANCELLED' as BookingStatus } : b
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

  const getStatusColor = (status: BookingStatus) => {
    return bookingStatusColors[status] || bookingStatusColors.PENDING;
  };

  const getPaymentColor = (status: string) => {
    return paymentStatusColors[status as keyof typeof paymentStatusColors] || paymentStatusColors.PENDING;
  };

  return (
    <div className={studentStyles.pageContainer}>
      <div className={studentStyles.mainContent}>
        {/* Header */}
        <div className="mb-8">
          <h1 className={studentStyles.pageTitle}>📅 My Bookings</h1>
          <p className={studentStyles.pageSubtitle}>View and manage your property bookings</p>
        </div>

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
          {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as BookingStatus[]).map(status => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status 
                  ? studentStyles.btnPrimary
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
              }`}
            >
              {status}
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
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Check-in</p>
                        <p className="font-medium text-white">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Check-out</p>
                        <p className="font-medium text-white">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className={`text-sm font-medium ${getPaymentColor(booking.paymentStatus)}`}>
                        Payment: {booking.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="md:col-span-1">
                    <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-400">Total Price</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {booking.totalPrice.toLocaleString()} EGP
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className={`${studentStyles.btnSecondary} flex-1 text-center text-sm`}
                      >
                        View Property
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className={`${studentStyles.btnDanger} flex-1 text-sm`}
                        >
                          Cancel
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
                Are you sure you want to cancel this booking? This action cannot be undone.
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
