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
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-[#0071c2]/50 via-[#005999] to-[#004a7d] border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ebf3ff] rounded-lg">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Users Management</h1>
              <p className="text-gray-100 mt-1 text-sm">Manage user accounts and verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <UsersManagement token={session.token} />
      </div>
    </div>
  );
}
