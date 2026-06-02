'use client';

import { useState } from 'react';
import { adminConfirmPayment, adminCancelBooking, adminCompleteBooking, adminRefundBooking } from '@/lib/api';
import { adminStyles, statusColors } from '@/styles/adminStyles';

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
      <div className={`${adminStyles.card} text-center p-12`}>
        <p className="text-slate-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className={adminStyles.card}>
      {error && <div className={adminStyles.alertError}>{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={adminStyles.tableHeader}>
            <tr>
              <th className={adminStyles.tableHeaderCell}>Student</th>
              <th className={adminStyles.tableHeaderCell}>Property</th>
              <th className={adminStyles.tableHeaderCell}>Dates</th>
              <th className={adminStyles.tableHeaderCell}>Status</th>
              <th className={adminStyles.tableHeaderCell}>Amount</th>
              <th className={`${adminStyles.tableHeaderCell} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {bookings.map((booking: Booking) => (
              <tr key={booking.id} className={adminStyles.tableRow}>
                <td className={adminStyles.tableCell}>
                  <span className="font-medium text-white">{booking.studentName || 'Student'}</span>
                </td>
                <td className={`${adminStyles.tableCell} text-slate-400`}>
                  {booking.propertyTitle || 'Property'}
                </td>
                <td className={`${adminStyles.tableCell} text-slate-400`}>
                  {new Date(booking.checkInDate).toLocaleDateString()} - <br/>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td className={adminStyles.tableCell}>
                  <span className={`${adminStyles.badge} ${
                    booking.status === 'CONFIRMED' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' :
                    booking.status === 'COMPLETED' ? 'bg-blue-900/50 border-blue-600 text-blue-200' :
                    booking.status === 'CANCELLED' ? 'bg-red-900/50 border-red-600 text-red-200' :
                    booking.hasDispute ? 'bg-orange-900/50 border-orange-600 text-orange-200' :
                    'bg-amber-900/50 border-amber-600 text-amber-200'
                  }`}>
                    {booking.hasDispute ? '⚠️ DISPUTED' : booking.status}
                  </span>
                </td>
                <td className={`${adminStyles.tableCell} font-semibold text-sky-400`}>
                  EGP {booking.totalPrice.toLocaleString()}
                </td>
                <td className={`${adminStyles.tableCell} text-right`}>
                  {loadingAction === booking.id ? (
                    <span className="text-slate-400 text-sm">⏳ Processing...</span>
                  ) : (
                    <div className="flex gap-2 justify-end flex-wrap">
                      {(booking.status === 'PENDING' || booking.status === 'PAYMENT_PENDING') && (
                        <button 
                          onClick={() => handleAction(booking.id, 'CONFIRMED', adminConfirmPayment)} 
                          className={`${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
                        >
                          ✓ Confirm
                        </button>
                      )}
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <button 
                          onClick={() => handleAction(booking.id, 'CANCELLED', adminCancelBooking, "Admin cancelled via Dashboard")} 
                          className={`${adminStyles.btnDanger} ${adminStyles.btnSmall}`}
                        >
                          ✕ Cancel
                        </button>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleAction(booking.id, 'COMPLETED', adminCompleteBooking)} 
                          className={`${adminStyles.btnPrimary} ${adminStyles.btnSmall}`}
                        >
                          ✔ Complete
                        </button>
                      )}
                      {booking.hasDispute && (
                        <button 
                          onClick={() => handleAction(booking.id, 'CANCELLED', adminRefundBooking, booking.totalPrice)} 
                          className={`${adminStyles.btnWarning} ${adminStyles.btnSmall}`}
                        >
                          💰 Refund
                        </button>
                      )}
                    </div>
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