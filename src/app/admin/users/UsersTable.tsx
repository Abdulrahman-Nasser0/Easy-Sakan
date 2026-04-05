'use client';

import { useState } from 'react';
import { adminApproveUser } from '@/lib/api';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Landlord' | 'Student';
  phone: string;
  emailConfirmed: boolean;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  token: string;
}

export default function UsersTable({ users, token }: UsersTableProps) {
  const [approving, setApproving] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [usersList, setUsersList] = useState(users);

  const handleApproveUser = async (userId: number, userName: string) => {
    setApproving(userId);
    setError('');
    setSuccess('');

    try {
      const response = await adminApproveUser(token, userId);
      console.log('Approve user response:', response);

      if (response.isSuccess) {
        setSuccess(`✓ ${userName} has been approved!`);
        // Update the user in the list
        setUsersList(prevUsers =>
          prevUsers.map(u =>
            u.id === userId ? { ...u, emailConfirmed: true } : u
          )
        );
      } else {
        setError(response.message || 'Failed to approve user.');
      }
    } catch (err) {
      console.error('Approve user error:', err);
      setError('Error approving user. Please try again.');
    } finally {
      setApproving(null);
    }
  };

  return (
    <>
      {/* Alert Messages */}
      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900 border border-green-700 rounded-lg p-4">
          <p className="text-sm text-green-200">{success}</p>
        </div>
      )}

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
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {usersList.map((user) => (
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
                    {user.emailConfirmed ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {!user.emailConfirmed ? (
                    <button
                      onClick={() => handleApproveUser(user.id, user.fullName)}
                      disabled={approving === user.id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      {approving === user.id ? 'Approving...' : 'Approve'}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">Already Verified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
