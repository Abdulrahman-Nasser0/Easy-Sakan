// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetUsers } from '@/lib/api';
import Link from 'next/link';
import UsersTable from './UsersTable';

export default async function AdminUsers() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load users. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetUsers(session.token);
  console.log('📊 Admin Users Response:', response);
  console.log('👥 Total Users:', response.data?.totalCount);
  console.log('📋 Users Details:', JSON.stringify(response.data?.items, null, 2));
  const users = response.isSuccess ? response.data?.items || [] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Users Management</h1>
              <p className="text-gray-400 mt-2">Manage and verify user accounts</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {users.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Admins</p>
                <p className="text-2xl font-bold text-blue-400">{users.filter((u: any) => u.role === 'Admin').length}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Landlords</p>
                <p className="text-2xl font-bold text-purple-400">{users.filter((u: any) => u.role === 'Landlord').length}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Students</p>
                <p className="text-2xl font-bold text-green-400">{users.filter((u: any) => u.role === 'Student').length}</p>
              </div>
            </div>

            {/* Users Table */}
            <UsersTable users={users} token={session.token} />
          </div>
        )}
      </div>
    </div>
  );
}
