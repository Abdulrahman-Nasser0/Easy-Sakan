// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyBookings, getAllProperties } from '@/lib/api';
import Link from 'next/link';
import RecommendedProperties from '@/components/home/RecommendedProperties';

export default async function StudentDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center max-w-md">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-600">Unable to load. Please log in again.</p>
        </div>
      </div>
    );
  }

  // Fetch student's booking stats
  let bookingStats = { total: 0, active: 0, completed: 0 };
  try {
    const bookingsResponse = await getMyBookings(session.token, 1, 100);
    if (bookingsResponse.isSuccess && bookingsResponse.data?.items) {
      const items = bookingsResponse.data.items;
      bookingStats.total = items.length;
      bookingStats.active = items.filter((b: any) => b.status === 'CONFIRMED').length;
      bookingStats.completed = items.filter((b: any) => b.status === 'COMPLETED').length;
    }
  } catch (err) {
    console.log('Error fetching bookings stats:', err);
  }

  // Fetch available properties count
  let availableProperties = 0;
  try {
    const propsResponse = await getAllProperties(1, 1);
    if (propsResponse.isSuccess && propsResponse.data) {
      availableProperties = propsResponse.data.totalCount || 0;
    }
  } catch (err) {
    console.log('Error fetching properties:', err);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0071c2] via-[#005999] to-[#004a7d] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">🎓 Student Dashboard</h1>
              <p className="text-white/80">Browse and book premium properties</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/80">
                Welcome, <span className="font-semibold text-white">{session.name}</span>
              </span>
              <Link href="/profile" className="text-white hover:text-white/80 text-sm font-medium transition-colors">
                👤 Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/properties" className="block">
              <button className="w-full py-3 px-4 bg-[#0071c2] text-white rounded-md hover:bg-[#005999] font-medium transition-colors flex items-center justify-center gap-2">
                🔍 Browse Properties
              </button>
            </Link>
            <Link href="/dashboard/student/my-bookings" className="block">
              <button className="w-full py-3 px-4 border border-[#0071c2] text-[#0071c2] rounded-md hover:bg-[#ebf3ff] font-medium transition-colors flex items-center justify-center gap-2">
                📅 My Bookings
              </button>
            </Link>
            <Link href="/properties" className="block">
              <button className="w-full py-3 px-4 border border-[#0071c2] text-[#0071c2] rounded-md hover:bg-[#ebf3ff] font-medium transition-colors flex items-center justify-center gap-2">
                ❤️ Saved Properties
              </button>
            </Link>
          </div>
        </div>

        {/* Recommended Properties */}
        <RecommendedProperties token={session.token} />

        {/* Browse Properties CTA */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 text-center border-l-4 border-l-[#0071c2] shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">🏡 Ready to Find Your Next Home?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Browse our extensive collection of verified properties from trusted landlords. Filter by location, price, amenities, and more to find your perfect match.
          </p>
          <Link href="/properties">
            <button className="px-6 py-3 bg-[#0071c2] text-white rounded-md hover:bg-[#005999] font-medium transition-colors inline-block">
              Start Browsing →
            </button>
          </Link>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Properties</p>
                <p className="text-3xl font-bold text-[#0071c2] mt-2">{availableProperties}</p>
              </div>
              <div className="text-4xl opacity-10">🏠</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-[#0071c2] mt-2">{bookingStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">{bookingStats.active} active, {bookingStats.completed} completed</p>
              </div>
              <div className="text-4xl opacity-10">📅</div>
            </div>
          </div>

          <Link href="/dashboard/student/my-bookings" className="block">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0071c2]/50 transition-all shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-[#0071c2] mt-2">{bookingStats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">View details →</p>
                </div>
                <div className="text-4xl opacity-10">✅</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        {bookingStats.total > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">📊 Your Bookings Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• <span className="font-semibold text-[#0071c2]">{bookingStats.active}</span> active booking(s) - Check in dates upcoming</p>
              <p>• <span className="font-semibold text-[#0071c2]">{bookingStats.completed}</span> completed booking(s) - Thanks for using Easy Sakan!</p>
              <p className="mt-4">
                <Link href="/dashboard/student/my-bookings" className="text-[#0071c2] hover:text-[#005999] font-medium transition-colors">
                  View all bookings →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
