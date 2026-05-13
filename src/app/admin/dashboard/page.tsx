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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-lg">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-300/80 mt-1 text-sm">System overview and management</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Logged in as: <span className="font-semibold text-slate-200">{session.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-linear-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalUsers || 0}</p>
                <p className="text-blue-400/70 text-xs mt-1">Registered accounts</p>
              </div>
              <div className="text-5xl opacity-30">👥</div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="bg-linear-to-br from-emerald-900/50 to-emerald-800/50 border border-emerald-500/30 rounded-lg p-6 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Total Properties</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalProperties || 0}</p>
                <p className="text-emerald-400/70 text-xs mt-1">Listed properties</p>
              </div>
              <div className="text-5xl opacity-30">🏠</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-linear-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Bookings</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalBookings || 0}</p>
                <p className="text-purple-400/70 text-xs mt-1">All time bookings</p>
              </div>
              <div className="text-5xl opacity-30">📅</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-linear-to-br from-amber-900/50 to-amber-800/50 border border-amber-500/30 rounded-lg p-6 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold mt-2 text-white">${(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-amber-400/70 text-xs mt-1">Platform revenue</p>
              </div>
              <div className="text-5xl opacity-30">💰</div>
            </div>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Verifications */}
          <div className="bg-linear-to-br from-orange-900/50 to-orange-800/50 border border-orange-500/30 rounded-lg p-6 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-200">⏳ Pending Verifications</h3>
              <span className="text-3xl font-bold text-orange-400">{stats.pendingVerifications || 0}</span>
            </div>
            <p className="text-orange-300/80 text-sm mb-4">Users awaiting email verification</p>
            <Link href="/admin/users" className="inline-block bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-4 py-2 rounded text-sm font-medium transition-all">
              Review Users →
            </Link>
          </div>

          {/* Active Disputes */}
          <div className="bg-linear-to-br from-red-900/50 to-red-800/50 border border-red-500/30 rounded-lg p-6 hover:border-red-500/60 transition-all hover:shadow-lg hover:shadow-red-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-200">⚖️ Active Disputes</h3>
              <span className="text-3xl font-bold text-red-400">{stats.activeDisputes || 0}</span>
            </div>
            <p className="text-red-300/80 text-sm mb-4">Ongoing booking disputes</p>
            <Link href="/admin/bookings" className="inline-block bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded text-sm font-medium transition-all">
              Handle Disputes →
            </Link>
          </div>

          {/* Fraud Alerts */}
          <div className="bg-linear-to-br from-rose-900/50 to-rose-800/50 border border-rose-500/30 rounded-lg p-6 hover:border-rose-500/60 transition-all hover:shadow-lg hover:shadow-rose-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-rose-200">🚨 Fraud Alerts</h3>
              <span className="text-3xl font-bold text-rose-400">{stats.fraudAlerts || 0}</span>
            </div>
            <p className="text-rose-300/80 text-sm mb-4">Suspicious activities detected</p>
            <Link href="/admin/fraud-detection" className="inline-block bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 px-4 py-2 rounded text-sm font-medium transition-all">
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
