// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetUsers } from '@/lib/api';
import Link from 'next/link';

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
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{user.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'Admin' ? 'bg-blue-900 text-blue-200' :
                          user.role === 'Landlord' ? 'bg-purple-900 text-purple-200' :
                          'bg-green-900 text-green-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.emailConfirmed ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                        }`}>
                          {user.emailConfirmed ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
