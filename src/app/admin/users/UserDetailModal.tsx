'use client';

import { useState, useEffect } from 'react';
import {
  adminGetUserDetails,
  adminApproveUser,
  adminRejectUser,
  adminDeactivateUser,
  adminReactivateUser,
} from '@/lib/api';

interface Props {
  token: string;
  userId: number;
  onClose: () => void;
  onUserUpdated: () => void;
}

const roleColors: Record<string, string> = {
  Admin: 'bg-[#f3e5f5] text-[#7b1fa2]',
  Landlord: 'bg-[#ebf7eb] text-[#008009]',
  Student: 'bg-[#ebf3ff] text-[#0071c2]',
};

const statusBadge = (active: boolean) => active
  ? 'bg-[#ebf7eb] text-[#008009]'
  : 'bg-gray-100 text-gray-500';

export default function UserDetailModal({ token, userId, onClose, onUserUpdated }: Props) {
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

  useEffect(() => { fetchUserDetails(); }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await adminGetUserDetails(token, userId);
      if (response.isSuccess) { setUser(response.data); setError(''); }
      else { setError(response.message || 'Failed to fetch user details'); }
    } catch { setError('Error fetching user details'); }
    finally { setLoading(false); }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await adminApproveUser(token, userId);
      if (response.isSuccess) { setShowApproveModal(false); onUserUpdated(); }
      else { setError(response.message || 'Failed to approve user'); }
    } catch { setError('Error approving user'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setError('Rejection reason is required'); return; }
    setActionLoading(true);
    try {
      const response = await adminRejectUser(token, userId, rejectReason);
      if (response.isSuccess) { setShowRejectModal(false); setRejectReason(''); onUserUpdated(); }
      else { setError(response.message || 'Failed to reject user'); }
    } catch { setError('Error rejecting user'); }
    finally { setActionLoading(false); }
  };

  const handleDeactivate = async () => {
    if (!deactivateReason.trim()) { setError('Deactivation reason is required'); return; }
    setActionLoading(true);
    try {
      const response = await adminDeactivateUser(token, userId, deactivateReason);
      if (response.isSuccess) { setShowDeactivateModal(false); setDeactivateReason(''); onUserUpdated(); }
      else { setError(response.message || 'Failed to deactivate user'); }
    } catch { setError('Error deactivating user'); }
    finally { setActionLoading(false); }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      const response = await adminReactivateUser(token, userId);
      if (response.isSuccess) { onUserUpdated(); }
      else { setError(response.message || 'Failed to reactivate user'); }
    } catch { setError('Error reactivating user'); }
    finally { setActionLoading(false); }
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">User Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-[#1a1a2e] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
                <p className="mt-4 text-gray-500 text-sm">Loading user details...</p>
              </div>
            ) : error ? (
              <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">{error}</div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-[#0071c2] rounded-full flex items-center justify-center text-white text-2xl font-semibold shrink-0">
                    {user.fullName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#1a1a2e]">{user.fullName}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-sm">{user.phone}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || roleColors.Student}`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(user.isActive)}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-[#ebf7eb] text-[#008009]' : 'bg-[#fff3e0] text-[#b95000]'}`}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-100 -mx-6 px-6">
                  <div className="flex gap-6">
                    {['info', 'documents', 'bookings'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-0 py-3 border-b-2 font-medium text-sm transition-colors capitalize ${
                          activeTab === tab ? 'border-[#0071c2] text-[#0071c2]' : 'border-transparent text-gray-500 hover:text-[#1a1a2e]'
                        }`}>
                        {tab === 'info' ? 'Information' : tab === 'documents' ? `Documents (${user.documents?.length || 0})` : `Bookings (${user.bookings?.length || 0})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab: Info */}
                {activeTab === 'info' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Registration Date', value: new Date(user.createdAt).toLocaleString() },
                      { label: 'Last Login', value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never' },
                      { label: 'Verification Status', value: user.verificationStatus || 'N/A' },
                      { label: 'University', value: user.university || 'N/A' },
                    ].map(item => (
                      <div key={item.label} className="bg-white border border-gray-200 rounded-md p-4">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                        <p className="font-medium text-[#1a1a2e] mt-1 text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Documents */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {user.documents?.length > 0 ? user.documents.map((doc: any) => (
                      <div key={doc.id} className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-[#1a1a2e] text-sm">{doc.fileType}</p>
                            <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(doc.uploadedAt).toLocaleString()}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${doc.status === 'APPROVED' ? 'bg-[#ebf7eb] text-[#008009]' : doc.status === 'REJECTED' ? 'bg-[#fff0f0] text-[#cc0000]' : 'bg-[#fff3e0] text-[#b95000]'}`}>
                            {doc.status}
                          </span>
                        </div>
                        {doc.mlInsights && (
                          <div className="bg-white border border-gray-200 rounded-md p-3 space-y-2 mt-3">
                            <p className="text-xs font-semibold text-gray-500">ML Insights</p>
                            <p className="text-xs text-gray-600">Fraud Score: <span className="font-semibold text-[#1a1a2e]">{doc.mlInsights.fraudScore}</span></p>
                            {doc.mlInsights.riskFactors && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Risk Factors:</p>
                                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                  {doc.mlInsights.riskFactors.map((factor: string, idx: number) => <li key={idx}>{factor}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {doc.rejectionReason && (
                          <div className="mt-3 bg-[#fff0f0] border border-[#f5c6c6] rounded-md p-3">
                            <p className="text-xs font-semibold text-[#cc0000]">Rejection Reason:</p>
                            <p className="text-xs text-[#cc0000]/80 mt-1">{doc.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    )) : <p className="text-gray-500 text-sm">No documents uploaded</p>}
                  </div>
                )}

                {/* Tab: Bookings */}
                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    {user.bookings?.length > 0 ? user.bookings.map((booking: any) => (
                      <div key={booking.id} className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-[#1a1a2e] text-sm">{booking.propertyTitle}</p>
                            <p className="text-xs text-gray-500 mt-1">Booking ID: #{booking.id}</p>
                            <p className="text-xs text-gray-500">Amount Due: EGP {booking.amountDue?.toFixed(2)}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${booking.status === 'PENDING_PAYMENT' ? 'bg-[#fff3e0] text-[#b95000]' : booking.status === 'CONFIRMED' ? 'bg-[#ebf7eb] text-[#008009]' : booking.status === 'COMPLETED' ? 'bg-[#ebf3ff] text-[#0071c2]' : 'bg-[#fff0f0] text-[#cc0000]'}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    )) : <p className="text-gray-500">No bookings</p>}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-3">Admin Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {user.verificationStatus === 'PENDING_REVIEW' && (
                      <>
                        <button onClick={() => setShowApproveModal(true)} disabled={actionLoading}
                          className="bg-[#008009] hover:bg-[#006600] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded font-medium transition-colors">
                          Approve Verification
                        </button>
                        <button onClick={() => setShowRejectModal(true)} disabled={actionLoading}
                          className="bg-[#cc0000] hover:bg-[#aa0000] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded font-medium transition-colors">
                          Reject Verification
                        </button>
                      </>
                    )}
                    { (
                      <button onClick={() => setShowApproveModal(true)} disabled={actionLoading}
                        className="bg-[#008009] hover:bg-[#006600] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded font-medium transition-colors">
                        Approve User
                      </button>
                    )}
                    {user.isActive ? (
                      <button onClick={() => setShowDeactivateModal(true)} disabled={actionLoading}
                        className="bg-[#cc0000] hover:bg-[#aa0000] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded font-medium transition-colors">
                        Deactivate Account
                      </button>
                    ) : (
                      <button onClick={handleReactivate} disabled={actionLoading}
                        className="bg-[#008009] hover:bg-[#006600] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded font-medium transition-colors">
                        Reactivate Account
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
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Approve User Verification?</h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600 text-sm">Are you sure you want to approve verification for <strong>{user?.fullName}</strong>?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowApproveModal(false)} className="border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">Cancel</button>
                <button onClick={handleApprove} disabled={actionLoading} className="bg-[#008009] hover:bg-[#006600] disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  {actionLoading ? 'Processing...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Reject User Verification</h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600 text-sm">Provide a reason for rejection. The user will be notified and can resubmit.</p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (min 10 characters)..."
                className={inputClass} rows={3} />
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setRejectReason(''); setShowRejectModal(false); }} className="border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">Cancel</button>
                <button onClick={handleReject} disabled={actionLoading || rejectReason.length < 10}
                  className="bg-[#cc0000] hover:bg-[#aa0000] disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Deactivate User Account</h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600 text-sm">Provide a reason for deactivation. The user will be notified.</p>
              <textarea value={deactivateReason} onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="Deactivation reason..."
                className={inputClass} rows={3} />
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setDeactivateReason(''); setShowDeactivateModal(false); }} className="border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">Cancel</button>
                <button onClick={handleDeactivate} disabled={actionLoading || !deactivateReason.trim()}
                  className="bg-[#cc0000] hover:bg-[#aa0000] disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
                  {actionLoading ? 'Processing...' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
