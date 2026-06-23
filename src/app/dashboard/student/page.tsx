// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyBookings, getAllProperties } from '@/lib/api';
import Link from 'next/link';

const btnPrimary = 'inline-block px-5 py-2.5 bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm rounded-md transition-colors text-center';
const btnOutline = 'inline-block px-5 py-2.5 border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] font-semibold text-sm rounded-md transition-colors text-center bg-white';

function extractStats(data: any) {
  // Try different response shapes
  if (!data) return { total: 0, active: 0, completed: 0 };
  
  // Direct items array
  if (Array.isArray(data)) {
    const items = data;
    return {
      total: items.length,
      active: items.filter((b: any) => b.status === 'CONFIRMED').length,
      completed: items.filter((b: any) => b.status === 'COMPLETED').length,
    };
  }
  
  // Paginated: { items: [...] }
  const items = data.items || data.bookings || data.data || [];
  if (!Array.isArray(items)) return { total: 0, active: 0, completed: 0 };
  
  return {
    total: items.length,
    active: items.filter((b: any) => b.status === 'CONFIRMED').length,
    completed: items.filter((b: any) => b.status === 'COMPLETED').length,
  };
}

export default async function StudentDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4 opacity-40">🔐</div>
          <p className="text-gray-600">Unable to load. Please log in again.</p>
        </div>
      </div>
    );
  }

  let bookingStats = { total: 0, active: 0, completed: 0 };
  let availableProperties = 0;

  try {
    const bookingsResponse = await getMyBookings(session.token, 1, 100);
    if (bookingsResponse.isSuccess && bookingsResponse.data) {
      bookingStats = extractStats(bookingsResponse.data);
    }
  } catch { /* noop */ }

  try {
    const propsResponse = await getAllProperties(1, 1);
    if (propsResponse.isSuccess && propsResponse.data) {
      availableProperties = propsResponse.data.totalCount || (Array.isArray(propsResponse.data.items) ? propsResponse.data.items.length : 0);
    }
  } catch { /* noop */ }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Student Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Browse and book premium properties</p>
            </div>
            <Link href="/profile" className="text-[#0071c2] hover:text-[#005999] text-sm font-medium transition-colors">
              {session.name} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm mb-1">Available Properties</p>
            <p className="text-3xl font-bold text-[#1a1a2e]">{availableProperties}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-[#1a1a2e]">{bookingStats.total}</p>
            <p className="text-xs text-gray-500 mt-1">{bookingStats.active} active &middot; {bookingStats.completed} completed</p>
          </div>
          <Link href="/dashboard/student/my-bookings" className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0071c2] transition-all h-full">
              <p className="text-gray-500 text-sm mb-1">Active Bookings</p>
              <p className="text-3xl font-bold text-[#1a1a2e]">{bookingStats.active}</p>
              <p className="text-xs text-[#0071c2] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View details &rarr;</p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/properties" className={btnPrimary}>
            Browse Properties
          </Link>
          <Link href="/dashboard/student/my-bookings" className={btnOutline}>
            My Bookings
          </Link>
          
        </div>

        {/* Summary */}
        {bookingStats.total > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Your Bookings Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>&bull; <span className="font-semibold text-[#1a1a2e]">{bookingStats.active}</span> active booking{bookingStats.active !== 1 ? 's' : ''} &mdash; check-in dates upcoming</p>
              <p>&bull; <span className="font-semibold text-[#1a1a2e]">{bookingStats.completed}</span> completed booking{bookingStats.completed !== 1 ? 's' : ''}</p>
              <p className="mt-4">
                <Link href="/dashboard/student/my-bookings" className="text-[#0071c2] hover:text-[#005999] font-medium transition-colors text-sm">
                  View all bookings &rarr;
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">Ready to Find Your Next Home?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm">
              Browse our collection of verified properties from trusted landlords. Filter by location, price, and amenities to find your perfect match.
            </p>
            <Link href="/properties">
              <button className="px-6 py-3 bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm rounded-md transition-colors">
                Start Browsing &rarr;
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
