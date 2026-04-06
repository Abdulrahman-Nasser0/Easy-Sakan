// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetDashboardStats } from '@/lib/api';
import Link from 'next/link';

async function AdminDashboard() {
  const session = await getSession();
  
  if (!session?.token) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Unable to load dashboard. Please log in again.</p>
      </div>
    );
  }

  const statsResponse = await adminGetDashboardStats(session.token);
  console.log('📊 Admin Dashboard Stats Response:', statsResponse);
  console.log('📈 Dashboard Data:', JSON.stringify(statsResponse.data, null, 2));
  
  // Extract stats from nested structure
  const dashboardData = statsResponse.data || {};
  
  const stats = statsResponse.isSuccess ? {
    totalUsers: dashboardData.users?.totalUsers || 0,
    totalProperties: dashboardData.properties?.totalListings || 0,
    totalBookings: dashboardData.bookings?.totalBookings || 0,
    totalRevenue: dashboardData.financials?.totalRevenue || 0,
    pendingVerifications: dashboardData.users?.pendingVerification || 0,
    activeDisputes: dashboardData.bookings?.disputed || 0,
    fraudAlerts: dashboardData.alerts?.length || 0,
  } : {
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
    fraudAlerts: 0,
  };
  console.log('📊 Processed Dashboard Stats:', stats);
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-gray-400">
              Logged in as: <span className="font-semibold">{session.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-linear-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-6 hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalUsers || 0}</p>
                <p className="text-blue-300 text-xs mt-1">Registered accounts</p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="bg-linear-to-br from-green-900 to-green-800 border border-green-700 rounded-lg p-6 hover:border-green-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Properties</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalProperties || 0}</p>
                <p className="text-green-300 text-xs mt-1">Listed properties</p>
              </div>
              <div className="text-5xl opacity-20">🏠</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-linear-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-6 hover:border-purple-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Bookings</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalBookings || 0}</p>
                <p className="text-purple-300 text-xs mt-1">All time bookings</p>
              </div>
              <div className="text-5xl opacity-20">📅</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-linear-to-br from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg p-6 hover:border-yellow-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold mt-2 text-white">${(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-yellow-300 text-xs mt-1">Platform revenue</p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Verifications */}
          <div className="bg-linear-to-br from-orange-900 to-orange-800 border border-orange-700 rounded-lg p-6 hover:border-orange-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-100">⏳ Pending Verifications</h3>
              <span className="text-3xl font-bold text-orange-300">{stats.pendingVerifications || 0}</span>
            </div>
            <p className="text-orange-200 text-sm mb-4">Users awaiting email verification</p>
            <Link href="/admin/users" className="inline-block bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm font-medium transition-colors">
              Review Users →
            </Link>
          </div>

          {/* Active Disputes */}
          <div className="bg-linear-to-br from-red-900 to-red-800 border border-red-700 rounded-lg p-6 hover:border-red-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-100">⚖️ Active Disputes</h3>
              <span className="text-3xl font-bold text-red-300">{stats.activeDisputes || 0}</span>
            </div>
            <p className="text-red-200 text-sm mb-4">Ongoing booking disputes</p>
            <Link href="/admin/bookings" className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">
              Handle Disputes →
            </Link>
          </div>

          {/* Fraud Alerts */}
          <div className="bg-linear-to-br from-red-900 to-red-800 border border-red-700 rounded-lg p-6 hover:border-red-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-100">🚨 Fraud Alerts</h3>
              <span className="text-3xl font-bold text-red-300">{stats.fraudAlerts || 0}</span>
            </div>
            <p className="text-red-200 text-sm mb-4">Suspicious activities detected</p>
            <Link href="/admin/fraud-detection" className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">
              Review Alerts →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/users"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Users</div>
            </Link>
            <Link
              href="/admin/properties"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm font-medium">Properties</div>
            </Link>
            <Link
              href="/admin/bookings"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium">Bookings</div>
            </Link>
            <Link
              href="/admin/fraud-detection"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🚨</div>
              <div className="text-sm font-medium">Fraud</div>
            </Link>
            <Link
              href="/admin/audit-log"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">Audit Log</div>
            </Link>
            <Link
              href="/profile"
              className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
