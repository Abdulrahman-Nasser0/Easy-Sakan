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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">System overview and management</p>
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
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-400 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalUsers || 0}</p>
                <p className="text-slate-500 text-xs mt-1">Registered accounts</p>
              </div>
              <div className="text-5xl opacity-30">👥</div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-400 text-sm font-medium">Total Properties</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalProperties || 0}</p>
                <p className="text-slate-500 text-xs mt-1">Listed properties</p>
              </div>
              <div className="text-5xl opacity-30">🏠</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-400 text-sm font-medium">Total Bookings</p>
                <p className="text-4xl font-bold mt-2 text-white">{stats.totalBookings || 0}</p>
                <p className="text-slate-500 text-xs mt-1">All time bookings</p>
              </div>
              <div className="text-5xl opacity-30">📅</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-400 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold mt-2 text-white">${(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">Platform revenue</p>
              </div>
              <div className="text-5xl opacity-30">💰</div>
            </div>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Verifications */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-300">⏳ Pending Verifications</h3>
              <span className="text-3xl font-bold text-amber-400">{stats.pendingVerifications || 0}</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">Users awaiting email verification</p>
            <Link href="/admin/users" className="inline-block bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors">
              Review Users →
            </Link>
          </div>

          {/* Active Disputes */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-300">⚖️ Active Disputes</h3>
              <span className="text-3xl font-bold text-red-400">{stats.activeDisputes || 0}</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">Ongoing booking disputes</p>
            <Link href="/admin/bookings" className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors">
              Handle Disputes →
            </Link>
          </div>

          {/* Fraud Alerts */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-rose-300">🚨 Fraud Alerts</h3>
              <span className="text-3xl font-bold text-rose-400">{stats.fraudAlerts || 0}</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">Suspicious activities detected</p>
            <Link href="/admin/fraud-detection" className="inline-block bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors">
              Review Alerts →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/users"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium text-slate-200">Users</div>
            </Link>
            <Link
              href="/admin/properties"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm font-medium text-slate-200">Properties</div>
            </Link>
            <Link
              href="/admin/bookings"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium text-slate-200">Bookings</div>
            </Link>
            <Link
              href="/admin/fraud-detection"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🚨</div>
              <div className="text-sm font-medium text-slate-200">Fraud</div>
            </Link>
            <Link
              href="/admin/reports"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-slate-200">Reports</div>
            </Link>
            <Link
              href="/admin/audit-log"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-slate-200">Audit Log</div>
            </Link>
            <Link
              href="/profile"
              className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-slate-200">Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
