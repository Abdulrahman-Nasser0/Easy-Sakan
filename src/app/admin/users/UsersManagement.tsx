'use client';

import { useState, useEffect } from 'react';
import { adminGetUsers, adminGetUserDetails } from '@/lib/api';
import UserDetailModal from './UserDetailModal';

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

interface UsersManagementProps {
  token: string;
}

export default function UsersManagement({ token }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, filterRole, filterVerified, filterStatus, searchTerm, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminGetUsers(token, page, pageSize);

      if (response.isSuccess) {
        setUsers(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId: number) => {
    setSelectedUser(userId);
    setShowDetailModal(true);
  };

  const resetFilters = () => {
    setFilterRole('');
    setFilterVerified('');
    setFilterStatus('');
    setSearchTerm('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search by name, email, or phone
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900 bg-white"
            >
              <option value="">All Roles</option>
              <option value="Student">Student</option>
              <option value="Landlord">Landlord</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Verification Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900 bg-white"
            >
              <option value="">All Status</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Verified Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Verified Status
            </label>
            <select
              value={filterVerified}
              onChange={(e) => {
                setFilterVerified(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900 bg-white"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900 bg-white"
            >
              <option value="createdAt">Registration Date</option>
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900 bg-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="border border-gray-300 rounded p-4 text-gray-800 bg-gray-50">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="border border-gray-200 rounded overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-gray-600"></div>
            <p className="mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No users found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white">
                        {user.verificationStatus || (user.isVerified ? 'Verified' : 'Not Verified')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
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
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          token={token}
          userId={selectedUser}
          onClose={() => setShowDetailModal(false)}
          onUserUpdated={() => {
            setShowDetailModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
