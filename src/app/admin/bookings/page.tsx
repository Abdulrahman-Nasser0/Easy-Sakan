// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetBookings } from '@/lib/api';
import Link from 'next/link';

export default async function AdminBookings() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load bookings. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetBookings(session.token);
  console.log('📊 Admin Bookings Response:', response);
  const bookings = response.isSuccess ? response.data?.bookings || [] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Bookings Management</h1>
              <p className="text-gray-400 mt-2">Monitor and manage all bookings and disputes</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {bookings.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400">No bookings found</p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Student</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Check-in</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Check-out</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-3 text-sm">{booking.studentName}</td>
                    <td className="px-6 py-3 text-sm">{booking.propertyTitle}</td>
                    <td className="px-6 py-3 text-sm">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm">
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
                    <td className="px-6 py-3 text-sm font-semibold">${booking.totalPrice}</td>
                    <td className="px-6 py-3 text-sm">
                      <button className="text-blue-500 hover:text-blue-400 font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
