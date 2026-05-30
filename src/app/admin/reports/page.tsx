// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetReports } from '@/lib/api';
import Link from 'next/link';
import AdminReportsClient from './AdminReportsClient';

export default async function AdminReportsPage() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load reports. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-amber-400 to-amber-600 rounded-lg">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Reports & Issues</h1>
                <p className="text-amber-300/80 mt-1 text-sm">Manage user-submitted reports and system issues</p>
              </div>
            </div>
            <Link href="/admin/dashboard" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdminReportsClient token={session.token} />
      </div>
    </div>
  );
}
