'use client';

import { useState } from 'react';
import { adminConfirmPayment, adminCancelBooking, adminCompleteBooking, adminRefundBooking } from '@/lib/api';

interface Booking {
  id: number;
  studentName: string;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  hasDispute: boolean;
  totalPrice: number;
}

interface BookingsTableProps {
  initialBookings: Booking[];
  token: string;
}

export default function BookingsTable({ initialBookings, token }: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const refreshBookingStatus = (id: number, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleAction = async (id: number, actionName: string, actionFn: (t: string, i: number, ...args: any[]) => Promise<any>, ...args: any[]) => {
    setError('');
    setLoadingAction(id);
    try {
      const res = await actionFn(token, id, ...args);
      if (res.isSuccess) {
        refreshBookingStatus(id, actionName); // Just optimistic UI update
      } else {
        setError(res.message || `Failed to perform ${actionName}`);
      }
    } catch (e) {
      setError('Network error details unavailable');
    } finally {
      setLoadingAction(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <p className="text-gray-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {error && <div className="p-4 bg-red-900/50 text-red-200 border-b border-red-500">{error}</div>}
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-700 border-b border-gray-600">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Student</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Property</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Dates</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">Amount</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {bookings.map((booking: Booking) => (
            <tr key={booking.id} className="hover:bg-gray-700 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-300">{booking.studentName || 'Student'}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{booking.propertyTitle || 'Property'}</td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {new Date(booking.checkInDate).toLocaleDateString()} - <br/>
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === 'CONFIRMED' ? 'bg-green-900 text-green-200' :
                  booking.status === 'COMPLETED' ? 'bg-blue-900 text-blue-200' :
                  booking.status === 'CANCELLED' ? 'bg-red-900 text-red-200' :
                  booking.hasDispute ? 'bg-orange-900 text-orange-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {booking.hasDispute ? 'DISPUTED' : booking.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-300">${booking.totalPrice}</td>
              <td className="px-4 py-3 text-sm text-right space-x-2">
                {loadingAction === booking.id ? (
                  <span className="text-gray-400">Processing...</span>
                ) : (
                  <>
                    {(booking.status === 'PENDING' || booking.status === 'PAYMENT_PENDING') && (
                      <button onClick={() => handleAction(booking.id, 'CONFIRMED', adminConfirmPayment)} className="text-green-500 hover:text-green-400 font-medium">Confirm</button>
                    )}
                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                      <button onClick={() => handleAction(booking.id, 'CANCELLED', adminCancelBooking, "Admin cancelled via Dashboard")} className="text-red-500 hover:text-red-400 font-medium">Cancel</button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button onClick={() => handleAction(booking.id, 'COMPLETED', adminCompleteBooking)} className="text-blue-500 hover:text-blue-400 font-medium">Complete</button>
                    )}
                    {booking.hasDispute && (
                      <button onClick={() => handleAction(booking.id, 'CANCELLED', adminRefundBooking, booking.totalPrice)} className="text-orange-500 hover:text-orange-400 font-medium">Refund</button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}