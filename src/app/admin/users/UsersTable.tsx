'use client';

import { useState } from 'react';
import { adminApproveUser } from '@/lib/api';
import { adminStyles } from '@/styles/adminStyles';

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
      console.log('Full response data:', JSON.stringify(response, null, 2));

      if (response.isSuccess) {
        setSuccess(`✓ ${userName} has been approved!`);
        // Update the user in the list
        setUsersList(prevUsers =>
          prevUsers.map(u =>
            u.id === userId ? { ...u, emailConfirmed: true } : u
          )
        );
      } else {
        const errorMessage = response.message || response.errors?.join(', ') || 'Failed to approve user.';
        console.error('Approval failed:', errorMessage);
        setError(errorMessage);
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
      {error && <div className={adminStyles.alertError}>{error}</div>}
      {success && <div className={adminStyles.alertSuccess}>{success}</div>}

      {/* Users Table */}
      <div className={adminStyles.card}>
        <table className="w-full">
          <thead className={adminStyles.tableHeader}>
            <tr>
              <th className={adminStyles.tableHeaderCell}>Name</th>
              <th className={adminStyles.tableHeaderCell}>Email</th>
              <th className={adminStyles.tableHeaderCell}>Role</th>
              <th className={adminStyles.tableHeaderCell}>Phone</th>
              <th className={adminStyles.tableHeaderCell}>Status</th>
              <th className={adminStyles.tableHeaderCell}>Joined</th>
              <th className={`${adminStyles.tableHeaderCell} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {usersList.map((user) => (
              <tr key={user.id} className={adminStyles.tableRow}>
                <td className={adminStyles.tableCell}>
                  <span className="font-medium text-white">{user.fullName || 'N/A'}</span>
                </td>
                <td className={adminStyles.tableCell}>
                  <span className="text-slate-400">{user.email}</span>
                </td>
                <td className={adminStyles.tableCell}>
                  <span className={`${adminStyles.badge} ${
                    user.role === 'Admin' ? 'bg-purple-900/50 border-purple-600 text-purple-200' :
                    user.role === 'Landlord' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' :
                    'bg-blue-900/50 border-blue-600 text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className={`${adminStyles.tableCell} text-slate-400`}>
                  {user.phone || 'N/A'}
                </td>
                <td className={adminStyles.tableCell}>
                  <span className={`${adminStyles.badge} ${
                    user.emailConfirmed ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-amber-900/50 border-amber-600 text-amber-200'
                  }`}>
                    {user.emailConfirmed ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td className={`${adminStyles.tableCell} text-slate-400`}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className={`${adminStyles.tableCell} text-right`}>
                  {!user.emailConfirmed ? (
                    <button
                      onClick={() => handleApproveUser(user.id, user.fullName)}
                      disabled={approving === user.id}
                      className={`${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
                    >
                      {approving === user.id ? '⏳ Approving...' : '✓ Approve'}
                    </button>
                  ) : (
                    <span className="text-slate-500 text-xs">Verified</span>
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
