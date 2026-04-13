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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and verification</p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <UsersManagement token={session.token} />
      </div>
    </div>
  );
}
