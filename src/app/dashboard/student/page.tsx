// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyBookings, getAllProperties } from '@/lib/api';
import Link from 'next/link';
import { studentStyles } from '@/styles/studentStyles';

export default async function StudentDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className={`${studentStyles.pageContainer} flex items-center justify-center`}>
        <div className={studentStyles.emptyState}>
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-slate-300">Unable to load. Please log in again.</p>
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
    <div className={studentStyles.pageContainer}>
      {/* Header */}
      <div className={studentStyles.headerContainer}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`${studentStyles.pageTitle} mb-1`}>🎓 Student Dashboard</h1>
              <p className={studentStyles.pageSubtitle}>Browse and book premium properties</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-300">
                Welcome, <span className="font-semibold text-blue-400">{session.name}</span>
              </span>
              <Link href="/profile" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                👤 Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={studentStyles.mainContent}>
        {/* Quick Actions */}
        <div className={`${studentStyles.card} mb-8`}>
          <h2 className={studentStyles.sectionHeader}>⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/properties" className="block">
              <button className={`${studentStyles.btnPrimary} w-full py-3 flex items-center justify-center gap-2`}>
                🔍 Browse Properties
              </button>
            </Link>
            <Link href="/dashboard/student/my-bookings" className="block">
              <button className={`${studentStyles.btnSecondary} w-full py-3 flex items-center justify-center gap-2`}>
                📅 My Bookings
              </button>
            </Link>
            <Link href="/properties" className="block">
              <button className={`${studentStyles.btnSecondary} w-full py-3 flex items-center justify-center gap-2`}>
                ❤️ Saved Properties
              </button>
            </Link>
          </div>
        </div>

        {/* Browse Properties CTA */}
        <div className={`${studentStyles.card} mb-12 text-center border-l-4 border-l-blue-500`}>
          <h2 className="text-2xl font-bold text-white mb-3">🏡 Ready to Find Your Next Home?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Browse our extensive collection of verified properties from trusted landlords. Filter by location, price, amenities, and more to find your perfect match.
          </p>
          <Link href="/properties">
            <button className={`${studentStyles.btnPrimary} inline-block`}>
              Start Browsing →
            </button>
          </Link>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={studentStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Available Properties</p>
                <p className={`${studentStyles.statNumber} mt-2`}>{availableProperties}</p>
              </div>
              <div className="text-4xl opacity-10">🏠</div>
            </div>
          </div>

          <div className={studentStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{bookingStats.total}</p>
                <p className="text-xs text-slate-500 mt-1">{bookingStats.active} active, {bookingStats.completed} completed</p>
              </div>
              <div className="text-4xl opacity-10">📅</div>
            </div>
          </div>

          <Link href="/dashboard/student/my-bookings" className="block">
            <div className={studentStyles.cardWithHover}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">{bookingStats.active}</p>
                  <p className="text-xs text-slate-500 mt-1">View details →</p>
                </div>
                <div className="text-4xl opacity-10">✅</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        {bookingStats.total > 0 && (
          <div className={studentStyles.card}>
            <h3 className={studentStyles.sectionHeader}>📊 Your Bookings Summary</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>• <span className="font-semibold text-blue-400">{bookingStats.active}</span> active booking(s) - Check in dates upcoming</p>
              <p>• <span className="font-semibold text-green-400">{bookingStats.completed}</span> completed booking(s) - Thanks for using Easy Sakan!</p>
              <p className="mt-4">
                <Link href="/dashboard/student/my-bookings" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
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
