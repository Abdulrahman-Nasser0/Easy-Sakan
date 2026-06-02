'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUserDetails,
  adminApproveUser,
  adminRejectUser,
  adminDeactivateUser,
  adminReactivateUser,
} from '@/lib/api';
import { adminStyles } from '@/styles/adminStyles';

interface UserDetailModalProps {
  token: string;
  userId: number;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function UserDetailModal({
  token,
  userId,
  onClose,
  onUserUpdated,
}: UserDetailModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // info, documents, bookings

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await adminGetUserDetails(token, userId);
      if (response.isSuccess) {
        setUser(response.data);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch user details');
      }
    } catch (err) {
      setError('Error fetching user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await adminApproveUser(token, userId);
      if (response.isSuccess) {
        setShowApproveModal(false);
        onUserUpdated();
      } else {
        setError(response.message || 'Failed to approve user');
      }
    } catch (err) {
      setError('Error approving user');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    try {
      const response = await adminRejectUser(token, userId, rejectReason);
      if (response.isSuccess) {
        setShowRejectModal(false);
        setRejectReason('');
        onUserUpdated();
      } else {
        setError(response.message || 'Failed to reject user');
      }
    } catch (err) {
      setError('Error rejecting user');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateReason.trim()) {
      setError('Deactivation reason is required');
      return;
    }
    setActionLoading(true);
    try {
      const response = await adminDeactivateUser(token, userId, deactivateReason);
      if (response.isSuccess) {
        setShowDeactivateModal(false);
        setDeactivateReason('');
        onUserUpdated();
      } else {
        setError(response.message || 'Failed to deactivate user');
      }
    } catch (err) {
      setError('Error deactivating user');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      const response = await adminReactivateUser(token, userId);
      if (response.isSuccess) {
        onUserUpdated();
      } else {
        setError(response.message || 'Failed to reactivate user');
      }
    } catch (err) {
      setError('Error reactivating user');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`${adminStyles.modal} max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
          {/* Header */}
          <div className={adminStyles.modalHeader}>
            <h2 className="text-xl font-semibold text-white">👤 User Details</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className={adminStyles.modalBody}>
            {loading ? (
              <div className={adminStyles.emptyState}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-slate-400"></div>
                <p className={`mt-4 ${adminStyles.emptyStateText}`}>Loading user details...</p>
              </div>
            ) : error ? (
              <div className={adminStyles.alertError}>{error}</div>
            ) : user ? (
              <div className="space-y-6">
                {/* User Info Card */}
                <div className="flex items-start gap-6 pb-6 border-b border-slate-700">
                  <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{user.fullName}</h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    <p className="text-slate-400 text-sm">{user.phone}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className={`${adminStyles.badge} ${user.role === 'Admin' ? 'bg-purple-900/50 border-purple-600 text-purple-200' : user.role === 'Landlord' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-sky-900/50 border-sky-600 text-sky-200'}`}>
                        {user.role}
                      </span>
                      <span className={`${adminStyles.badge} ${user.isActive ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                        {user.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                      <span className={`${adminStyles.badge} ${user.isVerified ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 'bg-amber-900/50 border-amber-600 text-amber-200'}`}>
                        {user.isVerified ? '✓ Verified' : '○ Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-700">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-0 py-3 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'info'
                          ? 'border-sky-500 text-sky-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Information
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`px-0 py-3 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'documents'
                          ? 'border-sky-500 text-sky-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Documents ({user.documents?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`px-0 py-3 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'bookings'
                          ? 'border-sky-500 text-sky-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Bookings ({user.bookings?.length || 0})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registration Date</p>
                        <p className="font-medium text-white mt-1">
                          {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Last Login</p>
                        <p className="font-medium text-white mt-1">
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleString()
                            : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verification Status</p>
                        <p className="font-medium text-white mt-1">{user.verificationStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">University</p>
                        <p className="font-medium text-white mt-1">{user.university || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {user.documents && user.documents.length > 0 ? (
                      user.documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className={`${adminStyles.card} space-y-3`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white text-sm">{doc.fileType}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                            <span className={`${adminStyles.badge} ${doc.status === 'APPROVED' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : doc.status === 'REJECTED' ? 'bg-red-900/50 border-red-600 text-red-200' : 'bg-amber-900/50 border-amber-600 text-amber-200'}`}>
                              {doc.status}
                            </span>
                          </div>
                          {doc.mlInsights && (
                            <div className="bg-slate-800/50 rounded p-3 space-y-2 border border-slate-700">
                              <p className="text-xs font-semibold text-slate-300">ML Insights</p>
                              <p className="text-xs text-slate-400">
                                Fraud Score: <span className="font-semibold text-white">{doc.mlInsights.fraudScore}</span>
                              </p>
                              {doc.mlInsights.riskFactors && (
                                <div>
                                  <p className="text-xs font-semibold text-slate-300 mb-2">Risk Factors:</p>
                                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                    {doc.mlInsights.riskFactors.map((factor: string, idx: number) => (
                                      <li key={idx}>{factor}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {doc.rejectionReason && (
                            <div className="rounded p-3 border border-red-600/30 bg-red-900/20">
                              <p className="text-xs font-semibold text-red-300">Rejection Reason:</p>
                              <p className="text-xs text-red-200 mt-1">{doc.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No documents uploaded</p>
                    )}
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    {user.bookings && user.bookings.length > 0 ? (
                      user.bookings.map((booking: any) => (
                        <div
                          key={booking.id}
                          className={adminStyles.card}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white text-sm">{booking.propertyTitle}</p>
                              <p className="text-xs text-slate-400 mt-1">Booking ID: #{booking.id}</p>
                              <p className="text-xs text-slate-400">
                                Amount Due: EGP {booking.amountDue.toFixed(2)}
                              </p>
                            </div>
                            <span className={`${adminStyles.badge} ${
                              booking.status === 'PENDING_PAYMENT'
                                ? 'bg-amber-900/50 border-amber-600 text-amber-200'
                                : booking.status === 'CONFIRMED'
                                ? 'bg-sky-900/50 border-sky-600 text-sky-200'
                                : booking.status === 'COMPLETED'
                                ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200'
                                : 'bg-red-900/50 border-red-600 text-red-200'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No bookings</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`${adminStyles.card} space-y-3 mt-6`}>
                  <p className="text-sm font-semibold text-white mb-3">Admin Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {user.verificationStatus === 'PENDING_REVIEW' && (
                      <>
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={actionLoading}
                          className={`${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
                        >
                          ✓ Approve Verification
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          disabled={actionLoading}
                          className={`${adminStyles.btnDanger} ${adminStyles.btnSmall}`}
                        >
                          ✕ Reject Verification
                        </button>
                      </>
                    )}

                    {user.isActive ? (
                      <button
                        onClick={() => setShowDeactivateModal(true)}
                        disabled={actionLoading}
                        className={`${adminStyles.btnDanger} ${adminStyles.btnSmall}`}
                      >
                        🔒 Deactivate Account
                      </button>
                    ) : (
                      <button
                        onClick={handleReactivate}
                        disabled={actionLoading}
                        className={`${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
                      >
                        🔓 Reactivate Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className={`${adminStyles.modal} max-w-md w-full`}>
            <div className={adminStyles.modalHeader}>
              <h3 className="text-lg font-semibold text-white">Approve User Verification?</h3>
            </div>
            <div className={adminStyles.modalBody}>
              <p className="text-slate-300 text-sm mb-6">
                Are you sure you want to approve verification for <span className="font-semibold text-white">{user?.fullName}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className={adminStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className={adminStyles.btnSuccess}
                >
                  {actionLoading ? '⏳ Approving...' : '✓ Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className={`${adminStyles.modal} max-w-md w-full`}>
            <div className={adminStyles.modalHeader}>
              <h3 className="text-lg font-semibold text-white">Reject User Verification</h3>
            </div>
            <div className={adminStyles.modalBody}>
              <p className="text-slate-300 text-sm mb-4">
                Provide a reason for rejection. The user will be notified and can resubmit.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (min 10 characters)..."
                className={`${adminStyles.input} mb-4 min-h-24`}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className={adminStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || rejectReason.length < 10}
                  className={adminStyles.btnDanger}
                >
                  {actionLoading ? '⏳ Rejecting...' : '✕ Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className={`${adminStyles.modal} max-w-md w-full`}>
            <div className={adminStyles.modalHeader}>
              <h3 className="text-lg font-semibold text-white">Deactivate User Account</h3>
            </div>
            <div className={adminStyles.modalBody}>
              <p className="text-slate-300 text-sm mb-4">
                Provide a reason for deactivation. The user will be notified.
              </p>
              <textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="Deactivation reason..."
                className={`${adminStyles.input} mb-4 min-h-24`}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeactivateModal(false);
                    setDeactivateReason('');
                  }}
                  className={adminStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={actionLoading || !deactivateReason.trim()}
                  className={adminStyles.btnDanger}
                >
                  {actionLoading ? '⏳ Deactivating...' : '🔒 Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
