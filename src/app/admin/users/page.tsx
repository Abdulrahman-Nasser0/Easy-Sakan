// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import UsersManagement from './UsersManagement';

export default async function AdminUsers() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Unable to load users. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-blue-500/30 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white">Users Management</h1>
              <p className="text-blue-300/80 mt-1 text-sm">Manage user accounts and verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <UsersManagement token={session.token} />
      </div>
    </div>
  );
}
