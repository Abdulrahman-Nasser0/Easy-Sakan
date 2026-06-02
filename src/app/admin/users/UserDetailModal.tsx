'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUserDetails,
  adminApproveUser,
  adminRejectUser,
  adminDeactivateUser,
  adminReactivateUser,
} from '@/lib/api';
import { modal, form, alert as alertStyle, badge, card } from '@/styles/designTokens';

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
  const [activeTab, setActiveTab] = useState('info');
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose}></div>

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800">
            <h2 className="text-xl font-semibold text-white">👤 User Details</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-sky-400"></div>
                <p className="mt-4 text-slate-400">Loading user details...</p>
              </div>
            ) : error ? (
              <div className={alertStyle.error}>{error}</div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="flex items-start gap-6 pb-6 border-b border-slate-700">
                  <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white">{user.fullName}</h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    <p className="text-slate-400 text-sm">{user.phone}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className={`
                        inline-flex px-3 py-1 rounded-full text-xs font-semibold border
                        ${user.role === 'Admin' ? 'bg-purple-900/50 border-purple-600 text-purple-200' : 
                          user.role === 'Landlord' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 
                          'bg-sky-900/50 border-sky-600 text-sky-200'}
                      `}>
                        {user.role}
                      </span>
                      <span className={
                        user.isActive 
                          ? badge.success 
                          : 'inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 border border-slate-600 text-slate-300'
                      }>
                        {user.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                      <span className={
                        user.isVerified 
                          ? badge.success 
                          : badge.warning
                      }>
                        {user.isVerified ? '✓ Verified' : '○ Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-700 -mx-6 px-6">
                  <div className="flex gap-6">
                    {['info', 'documents', 'bookings'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-0 py-3 border-b-2 font-medium text-sm transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-sky-500 text-sky-400'
                            : 'border-transparent text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {tab === 'info' ? 'Information' : tab === 'documents' ? `Documents (${user.documents?.length || 0})` : `Bookings (${user.bookings?.length || 0})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Registration Date', value: new Date(user.createdAt).toLocaleString() },
                      { label: 'Last Login', value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never' },
                      { label: 'Verification Status', value: user.verificationStatus },
                      { label: 'University', value: user.university || 'N/A' },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.label}</p>
                        <p className="font-medium text-white mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {user.documents?.length > 0 ? (
                      user.documents.map((doc: any) => (
                        <div key={doc.id} className={card.base}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white text-sm">{doc.fileType}</p>
                              <p className="text-xs text-slate-400 mt-1">Uploaded: {new Date(doc.uploadedAt).toLocaleString()}</p>
                            </div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                              doc.status === 'APPROVED' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' : 
                              doc.status === 'REJECTED' ? 'bg-red-900/50 border-red-600 text-red-200' : 
                              'bg-amber-900/50 border-amber-600 text-amber-200'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                          {doc.mlInsights && (
                            <div className="bg-slate-800/50 rounded p-3 space-y-2 border border-slate-700 mt-3">
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
                            <div className="mt-3 rounded p-3 border border-red-600/30 bg-red-900/20">
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
                    {user.bookings?.length > 0 ? (
                      user.bookings.map((booking: any) => (
                        <div key={booking.id} className={card.base}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white text-sm">{booking.propertyTitle}</p>
                              <p className="text-xs text-slate-400 mt-1">Booking ID: #{booking.id}</p>
                              <p className="text-xs text-slate-400">Amount Due: EGP {booking.amountDue.toFixed(2)}</p>
                            </div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                              booking.status === 'PENDING_PAYMENT' ? 'bg-amber-900/50 border-amber-600 text-amber-200' :
                              booking.status === 'CONFIRMED' ? 'bg-sky-900/50 border-sky-600 text-sky-200' :
                              booking.status === 'COMPLETED' ? 'bg-emerald-900/50 border-emerald-600 text-emerald-200' :
                              'bg-red-900/50 border-red-600 text-red-200'
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

                {/* Admin Actions */}
                <div className={card.base}>
                  <p className="text-sm font-semibold text-white mb-3">Admin Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {user.verificationStatus === 'PENDING_REVIEW' && (
                      <>
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={actionLoading}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1 text-xs rounded font-medium transition-colors"
                        >
                          ✓ Approve Verification
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          disabled={actionLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 text-xs rounded font-medium transition-colors"
                        >
                          ✕ Reject Verification
                        </button>
                      </>
                    )}
                    {user.isActive ? (
                      <button
                        onClick={() => setShowDeactivateModal(true)}
                        disabled={actionLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 text-xs rounded font-medium transition-colors"
                      >
                        🔒 Deactivate Account
                      </button>
                    ) : (
                      <button
                        onClick={handleReactivate}
                        disabled={actionLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1 text-xs rounded font-medium transition-colors"
                      >
                        🔓 Reactivate Account
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {[
        { id: 'approve', show: showApproveModal, setShow: setShowApproveModal, title: 'Approve User Verification?', 
          text: (user: any) => `Are you sure you want to approve verification for ${user?.fullName}?`,
          action: handleApprove, btnClass: 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50', label: '✓ Approve',
          loading: actionLoading },
        { id: 'reject', show: showRejectModal, setShow: setShowRejectModal, title: 'Reject User Verification',
          text: () => 'Provide a reason for rejection. The user will be notified and can resubmit.',
          action: handleReject, btnClass: 'bg-red-600 hover:bg-red-700 disabled:opacity-50', label: '✕ Reject', 
          loading: actionLoading, hasInput: true, inputValue: rejectReason, setInput: setRejectReason,
          placeholder: 'Rejection reason (min 10 characters)...', minLen: 10 },
        { id: 'deactivate', show: showDeactivateModal, setShow: setShowDeactivateModal, title: 'Deactivate User Account',
          text: () => 'Provide a reason for deactivation. The user will be notified.',
          action: handleDeactivate, btnClass: 'bg-red-600 hover:bg-red-700 disabled:opacity-50', label: '🔒 Deactivate',
          loading: actionLoading, hasInput: true, inputValue: deactivateReason, setInput: setDeactivateReason,
          placeholder: 'Deactivation reason...', minLen: 1 },
      ].map(confirm => confirm.show && (
        <div key={confirm.id} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">{confirm.title}</h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-slate-300 text-sm">
                {confirm.hasInput ? confirm.text() : confirm.text(user)}
              </p>
              {confirm.hasInput && (
                <textarea
                  value={confirm.inputValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => confirm.setInput(e.target.value)}
                  placeholder={confirm.placeholder}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors min-h-24"
                />
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { confirm.setInput?.(''); confirm.setShow(false); }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 text-sm rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirm.action}
                  disabled={confirm.loading || (confirm.hasInput && confirm.inputValue.length < (confirm.minLen || 0))}
                  className={`${confirm.btnClass} text-white px-4 py-2 text-sm rounded-lg font-medium transition-colors`}
                >
                  {confirm.loading ? '⏳...' : confirm.label}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
