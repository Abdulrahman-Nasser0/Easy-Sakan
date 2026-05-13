'use client';

import { useState, useEffect } from 'react';
import { adminGetUsers, adminGetUserDetails } from '@/lib/api';
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
      <div className={adminStyles.filterContainer}>
        <h2 className="text-lg font-semibold text-white mb-4">Filters & Search</h2>

        <div className={adminStyles.filterGrid}>
          {/* Search */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>
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
              className={adminStyles.input}
            />
          </div>

          {/* Role Filter */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Role</label>
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="">All Roles</option>
              <option value="Student">Student</option>
              <option value="Landlord">Landlord</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Verification Status */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>
              Verification Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="">All Status</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Verified Status */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>
              Verified Status
            </label>
            <select
              value={filterVerified}
              onChange={(e) => {
                setFilterVerified(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="createdAt">Registration Date</option>
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className={`${adminStyles.btnSecondary} mt-4`}
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={adminStyles.alertError}>{error}</div>}

      {/* Users Table */}
      <div className={adminStyles.card}>
        {loading ? (
          <div className={adminStyles.emptyState}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-slate-400"></div>
            <p className={`mt-4 ${adminStyles.emptyStateText}`}>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className={adminStyles.emptyState}>
            <div className={adminStyles.emptyStateIcon}>👥</div>
            <p className={adminStyles.emptyStateText}>No users found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={adminStyles.tableHeader}>
                <tr>
                  <th className={adminStyles.tableHeaderCell}>
                    User
                  </th>
                  <th className={adminStyles.tableHeaderCell}>
                    Role
                  </th>
                  <th className={adminStyles.tableHeaderCell}>
                    Status
                  </th>
                  <th className={adminStyles.tableHeaderCell}>
                    Verification
                  </th>
                  <th className={adminStyles.tableHeaderCell}>
                    Joined
                  </th>
                  <th className={`${adminStyles.tableHeaderCell} text-right`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className={adminStyles.tableRow}>
                    <td className={adminStyles.tableCell}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span className={`${adminStyles.badge} ${user.role === 'Admin' ? 'bg-purple-900/50 border-purple-600 text-purple-200' : user.role === 'Landlord' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-blue-900/50 border-blue-600 text-blue-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span className={`${adminStyles.badge} ${user.isActive ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                        {user.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span className={`${adminStyles.badge} ${user.isVerified ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-amber-900/50 border-amber-600 text-amber-200'}`}>
                        {user.verificationStatus || (user.isVerified ? '✓ Verified' : '○ Not Verified')}
                      </span>
                    </td>
                    <td className={`${adminStyles.tableCell} text-slate-400`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`${adminStyles.tableCell} text-right`}>
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className={`${adminStyles.btnPrimary} ${adminStyles.btnSmall}`}
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
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-slate-400">
            Page <span className="font-semibold text-slate-200">{page}</span> of <span className="font-semibold text-slate-200">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={adminStyles.paginationBtn}
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={adminStyles.paginationBtn}
            >
              Next →
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
