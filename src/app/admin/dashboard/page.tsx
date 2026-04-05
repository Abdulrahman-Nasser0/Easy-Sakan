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
  
  const stats = statsResponse.isSuccess ? statsResponse.data : {
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
    fraudAlerts: 0,
  };

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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl text-blue-500">👥</div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Properties</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProperties}</p>
              </div>
              <div className="text-4xl text-green-500">🏠</div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
              </div>
              <div className="text-4xl text-purple-500">📅</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${stats.totalRevenue}</p>
              </div>
              <div className="text-4xl text-yellow-500">💰</div>
            </div>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Verifications */}
          <div className="bg-gray-800 border border-orange-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400">Pending Verifications</h3>
              <span className="text-2xl font-bold text-orange-400">{stats.pendingVerifications}</span>
            </div>
            <Link href="/admin/users" className="text-orange-500 hover:text-orange-400 text-sm font-medium">
              Review Users →
            </Link>
          </div>

          {/* Active Disputes */}
          <div className="bg-gray-800 border border-red-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-400">Active Disputes</h3>
              <span className="text-2xl font-bold text-red-400">{stats.activeDisputes}</span>
            </div>
            <Link href="/admin/bookings" className="text-red-500 hover:text-red-400 text-sm font-medium">
              Handle Disputes →
            </Link>
          </div>

          {/* Fraud Alerts */}
          <div className="bg-gray-800 border border-red-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-400">Fraud Alerts</h3>
              <span className="text-2xl font-bold text-red-400">{stats.fraudAlerts}</span>
            </div>
            <Link href="/admin/fraud-detection" className="text-red-500 hover:text-red-400 text-sm font-medium">
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
