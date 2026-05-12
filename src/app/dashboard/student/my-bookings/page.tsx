'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings, cancelBooking } from '@/lib/api-client';
import { BookingStatus } from '@/lib/types';

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

export default function MyBookingsPage() {
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
  }, [page, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMyBookings(page, 10, statusFilter || undefined);

      if (response.isSuccess && response.data?.items) {
        setBookings(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load bookings');
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
      const response = await cancelBooking(selectedBookingId, cancelReason);

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
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'DISPUTED':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'CONFIRMED':
        return 'text-green-600';
      case 'REFUNDED':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your property bookings</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => { setStatusFilter(''); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <Link href="/properties" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">
              Browse Properties →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Booking Info */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{booking.propertyTitle}</h3>
                        <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className={`text-sm font-medium ${getPaymentColor(booking.paymentStatus)}`}>
                        Payment: {booking.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="md:col-span-1">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {booking.totalPrice.toLocaleString()} EGP
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 text-center text-sm"
                      >
                        View Property
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 text-sm"
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg font-medium ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Cancel Booking Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="border-b p-6">
              <h2 className="text-lg font-bold text-gray-900">Cancel Booking</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Optional: Tell us why you're canceling (max 200 characters)"
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={cancelLoading}
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCancelDialogOpen(false)}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancelLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelLoading ? 'Canceling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
