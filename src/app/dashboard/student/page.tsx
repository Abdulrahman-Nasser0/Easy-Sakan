// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
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
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search location..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty State */}
            <div className="lg:col-span-3 text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-2-2l4-2"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available yet</h3>
                <p className="text-gray-600 mb-4">Properties will appear here once landlords upload them and admins approve them.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">You haven't made any bookings yet</p>
            <p className="text-sm text-gray-500 mt-2">Start by exploring available properties above</p>
          </div>
        </div>
      </div>
    </div>
  );
}
