// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyBookings, getAllProperties } from '@/lib/api';
import Link from 'next/link';

export default async function StudentDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load dashboard. Please log in again.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 text-sm">Browse and book premium properties</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{session.name}</span>
              </span>
              <Link href="/profile" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/properties" className="block">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Properties
              </button>
            </Link>
            <Link href="/dashboard/student/my-bookings" className="block">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Bookings
              </button>
            </Link>
            <Link href="/properties" className="block">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved Properties
              </button>
            </Link>
          </div>
        </div>

        {/* Browse Properties CTA */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Find Your Next Home?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Browse our extensive collection of verified properties from trusted landlords. Filter by location, price, amenities, and more to find your perfect match.
          </p>
          <Link href="/properties">
            <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Start Browsing →
            </button>
          </Link>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Properties</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{availableProperties}</p>
              </div>
              <div className="text-4xl text-blue-500 opacity-20">🏠</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{bookingStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">{bookingStats.active} active, {bookingStats.completed} completed</p>
              </div>
              <div className="text-4xl text-green-500 opacity-20">📅</div>
            </div>
          </div>

          <Link href="/dashboard/student/my-bookings" className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{bookingStats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">View details →</p>
                </div>
                <div className="text-4xl text-purple-500 opacity-20">✅</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        {bookingStats.total > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Bookings Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>{bookingStats.active}</strong> active booking(s) - Check in dates upcoming</p>
              <p>• <strong>{bookingStats.completed}</strong> completed booking(s) - Thanks for using Easy Sakan!</p>
              <p className="mt-4">
                <Link href="/dashboard/student/my-bookings" className="text-blue-600 hover:text-blue-700 font-medium">
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
