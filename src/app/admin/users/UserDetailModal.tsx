'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUserDetails,
  adminApproveUser,
  adminRejectUser,
  adminDeactivateUser,
  adminReactivateUser,
} from '@/lib/api';

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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500">Loading user details...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* User Info Card */}
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone}</p>
                    <div className="flex gap-3 mt-3 flex-wrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Landlord'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'info'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Information
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'documents'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Documents ({user.documents?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'bookings'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
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
                        <p className="text-sm text-gray-600">Registration Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Login</p>
                        <p className="font-medium text-gray-900">
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleString()
                            : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <p className="font-medium text-gray-900">{user.verificationStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">University</p>
                        <p className="font-medium text-gray-900">{user.university || 'N/A'}</p>
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
                          className="border border-gray-200 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{doc.fileType}</p>
                              <p className="text-sm text-gray-600">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              doc.status === 'PENDING_REVIEW'
                                ? 'bg-yellow-100 text-yellow-800'
                                : doc.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                          {doc.mlInsights && (
                            <div className="bg-gray-50 rounded p-3 space-y-2">
                              <p className="text-sm font-medium text-gray-900">ML Insights</p>
                              <p className="text-sm text-gray-600">
                                Fraud Score: <span className="font-semibold">{doc.mlInsights.fraudScore}</span>
                              </p>
                              {doc.mlInsights.riskFactors && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-1">Risk Factors:</p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {doc.mlInsights.riskFactors.map((factor: string, idx: number) => (
                                      <li key={idx}>{factor}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {doc.rejectionReason && (
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                              <p className="text-sm text-red-700">{doc.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No documents uploaded</p>
                    )}
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    {user.bookings && user.bookings.length > 0 ? (
                      user.bookings.map((booking: any) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{booking.propertyTitle}</p>
                              <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                              <p className="text-sm text-gray-600">
                                Amount Due: EGP {booking.amountDue.toFixed(2)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'PENDING_PAYMENT'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'CONFIRMED'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No bookings</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border-t border-gray-200 mt-6">
                  <p className="text-sm font-medium text-gray-900 mb-3">Admin Actions</p>
                  <div className="flex flex-wrap gap-3">
                    {user.verificationStatus === 'PENDING_REVIEW' && (
                      <>
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Approve Verification
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          Reject Verification
                        </button>
                      </>
                    )}

                    {user.isActive ? (
                      <button
                        onClick={() => setShowDeactivateModal(true)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        Deactivate Account
                      </button>
                    ) : (
                      <button
                        onClick={handleReactivate}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        Reactivate Account
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Approve User Verification?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve verification for {user?.fullName}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject User Verification</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for rejection. The user will be notified and can resubmit.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (min 10 characters)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 min-h-24"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || rejectReason.length < 10}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Deactivate User Account</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for deactivation. The user will be notified.
            </p>
            <textarea
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              placeholder="Deactivation reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4 min-h-24"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  setDeactivateReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={actionLoading || !deactivateReason.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
