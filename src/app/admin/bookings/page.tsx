// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminBookingsClient from './AdminBookingsClient';
export default async function AdminBookings() {
  const session = await getSession();

  if (!session?.token) {
    redirect('/login');
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-purple-400 to-purple-600 rounded-lg">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Bookings Management</h1>
                <p className="text-purple-300/80 mt-1 text-sm">View and manage all bookings and payments</p>
              </div>
            </div>
          </div>
        </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdminBookingsClient token={session.token} />
          </div>
          </div>
  );
}

