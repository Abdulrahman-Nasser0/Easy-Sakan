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

const badgeClass = (role: string) => {
  const colors: Record<string, string> = {
    Admin: 'bg-[#f3e5f5] text-[#7b1fa2]',
    Landlord: 'bg-[#ebf7eb] text-[#008009]',
    Student: 'bg-[#ebf3ff] text-[#0071c2]',
  };
  return `inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors[role] || colors.Student}`;
};

export default function UsersTable({ users, token }: UsersTableProps) {
  const [approving, setApproving] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usersList, setUsersList] = useState(users);

  const handleApproveUser = async (userId: number, userName: string) => {
    setApproving(userId); setError(''); setSuccess('');
    try {
      const response = await adminApproveUser(token, userId);
      if (response.isSuccess) {
        setSuccess(`${userName} has been approved!`);
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, emailConfirmed: true } : u));
      } else {
        setError(response.message || 'Failed to approve user.');
      }
    } catch {
      setError('Error approving user.');
    } finally { setApproving(null); }
  };

  return (
    <>
      {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 mb-4 text-sm">{error}</div>}
      {success && <div className="bg-[#ebf7eb] border border-[#c3e6c3] text-[#008009] rounded-md p-4 mb-4 text-sm">{success}</div>}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f2f6fc] border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Role', 'Phone', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map(user => (
                <tr key={user.id} className="hover:bg-[#f2f6fc] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a2e]">{user.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm"><span className={badgeClass(user.role)}>{user.role}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.emailConfirmed ? 'bg-[#ebf7eb] text-[#008009]' : 'bg-[#fff3e0] text-[#b95000]'}`}>
                      {user.emailConfirmed ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    {!user.emailConfirmed ? (
                      <button onClick={() => handleApproveUser(user.id, user.fullName)} disabled={approving === user.id}
                        className="bg-[#008009] hover:bg-[#006600] text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50">
                        {approving === user.id ? 'Approving...' : 'Approve'}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
