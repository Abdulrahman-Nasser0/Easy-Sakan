'use client';

import { useState, useEffect } from 'react';
import { adminGetUsers } from '@/lib/api';
import UserDetailModal from './UserDetailModal';
import { adminStyles, statusColors } from '@/styles/adminStyles';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isVerified: boolean;
  verificationStatus: string;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Props { token: string; }

const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm';
const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer';

export default function UsersManagement({ token }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => { fetchUsers(); }, [page, pageSize, filterRole, filterVerified, searchTerm, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const response = await adminGetUsers(token, { page, pageSize, role: filterRole || undefined, isVerified: filterVerified ? filterVerified === 'true' : undefined, search: searchTerm || undefined, sortBy, sortOrder });
      if (response.isSuccess) { setUsers(response.data.items || []); setTotalPages(response.data.totalPages || 1); }
      else { setError(response.message || 'Failed to fetch users'); }
    } catch { setError('Error fetching users'); }
    finally { setLoading(false); }
  };

  const handleViewUser = (userId: number) => { setSelectedUser(userId); setShowDetailModal(true); };
  const resetFilters = () => { setFilterRole(''); setFilterVerified(''); setSearchTerm(''); setSortBy('createdAt'); setSortOrder('desc'); setPage(1); };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Search</label>
            <input type="text" placeholder="Search by name, email, or phone" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Role</label>
            <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Roles</option>
              <option value="Student">Student</option>
              <option value="Landlord">Landlord</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Verified</label>
            <select value={filterVerified} onChange={(e) => { setFilterVerified(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Sort By</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className={selectClass}>
              <option value="createdAt">Registration Date</option>
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }} className={`${selectClass} w-40`}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <button onClick={resetFilters} className="border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">
            Reset Filters
          </button>
        </div>
      </div>

      {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
            <p className="text-gray-500 mt-4 text-sm">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-40">👥</div>
            <p className="text-gray-500">No users found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f2f6fc] border-b border-gray-200">
                <tr>
                  {['User', 'Role', 'Status', 'Verification', 'Joined', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[#f2f6fc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0071c2] rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1a2e] text-sm">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-[#f3e5f5] text-[#7b1fa2]' : user.role === 'Landlord' ? 'bg-[#ebf7eb] text-[#008009]' : 'bg-[#ebf3ff] text-[#0071c2]'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-[#ebf7eb] text-[#008009]' : 'bg-gray-100 text-gray-500'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-[#ebf7eb] text-[#008009]' : 'bg-[#fff3e0] text-[#b95000]'}`}>
                        {user.verificationStatus || (user.isVerified ? 'Verified' : 'Not Verified')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button onClick={() => handleViewUser(user.id)}
                        className="bg-[#0071c2] hover:bg-[#005999] text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">Page <span className="font-semibold text-[#1a1a2e]">{page}</span> of <span className="font-semibold text-[#1a1a2e]">{totalPages}</span></div>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">← Previous</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">Next →</button>
          </div>
        </div>
      )}

      {showDetailModal && selectedUser && (
        <UserDetailModal token={token} userId={selectedUser}
          onClose={() => setShowDetailModal(false)}
          onUserUpdated={() => { setShowDetailModal(false); fetchUsers(); }} />
      )}
    </div>
  );
}
