'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminGetReports, adminUpdateReportStatus } from '@/lib/api';

interface ReportItem {
  id: number;
  type: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  relatedBookingId?: number;
  relatedPropertyId?: number;
  adminNotes?: string;
  assignedTo?: number;
}

interface AdminReportsClientProps {
  token: string;
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-yellow-900/50 border-yellow-600 text-yellow-200',
  IN_PROGRESS: 'bg-blue-900/50 border-blue-600 text-blue-200',
  RESOLVED: 'bg-emerald-900/50 border-emerald-600 text-emerald-200',
  CLOSED: 'bg-slate-700 border-slate-600 text-slate-300',
};

const TYPE_LABELS: Record<string, string> = {
  BUG: '🐛 Bug',
  PAYMENT: '💰 Payment',
  BOOKING: '📅 Booking',
  PROPERTY: '🏠 Property',
  ACCOUNT: '👤 Account',
  OTHER: '📝 Other',
};

export default function AdminReportsClient({ token }: AdminReportsClientProps) {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminGetReports(token, page, 20, typeFilter || undefined, statusFilter || undefined);

      if (response.isSuccess) {
        setReports(response.data?.items || []);
        setTotalPages(response.data?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Error fetching reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, typeFilter, statusFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async () => {
    if (!selectedReport || !newStatus) return;
    setActionLoading(true);

    try {
      const response = await adminUpdateReportStatus(token, selectedReport.id, {
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });

      if (response.isSuccess) {
        fetchReports();
        setShowStatusModal(false);
        setShowDetailModal(false);
        setSelectedReport(null);
        setAdminNotes('');
      } else {
        setError(response.message || 'Failed to update report status');
      }
    } catch (err) {
      setError('Error updating report status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_STYLES[status] || STATUS_STYLES.OPEN;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resetFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Types</option>
              <option value="BUG">Bug Report</option>
              <option value="PAYMENT">Payment Issue</option>
              <option value="BOOKING">Booking Problem</option>
              <option value="PROPERTY">Property Issue</option>
              <option value="ACCOUNT">Account Issue</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={resetFilters}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">{error}</div>
      )}

      {/* Reports Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-slate-400 mb-4"></div>
            <p className="text-slate-400">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-50">📊</div>
            <p className="text-slate-400">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{report.id}</td>
                    <td className="px-6 py-4 text-sm">{TYPE_LABELS[report.type] || report.type}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium max-w-[200px] truncate">
                      {report.subject}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="text-white">{report.userName || 'Anonymous'}</p>
                        {report.userEmail && <p className="text-xs text-slate-400">{report.userEmail}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status === 'IN_PROGRESS' ? '🔄 In Progress' :
                         report.status === 'RESOLVED' ? '✅ Resolved' :
                         report.status === 'CLOSED' ? '🔒 Closed' :
                         '📂 Open'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowDetailModal(true);
                        }}
                        className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 py-1 text-xs rounded font-medium transition-all"
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
      {totalPages > 1 && !loading && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-slate-400">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {TYPE_LABELS[selectedReport.type] || selectedReport.type} Report #{selectedReport.id}
              </h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Status & Type */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status === 'IN_PROGRESS' ? '🔄 In Progress' :
                   selectedReport.status === 'RESOLVED' ? '✅ Resolved' :
                   selectedReport.status === 'CLOSED' ? '🔒 Closed' :
                   '📂 Open'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-slate-700 text-slate-300">
                  {TYPE_LABELS[selectedReport.type] || selectedReport.type}
                </span>
              </div>

              {/* Subject */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Subject</p>
                <p className="text-white font-medium text-lg">{selectedReport.subject}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <div className="bg-slate-700/50 rounded-lg p-4 text-slate-200 whitespace-pre-wrap text-sm">
                  {selectedReport.description}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Submitted By</p>
                  <p className="text-white font-medium">{selectedReport.userName || 'Anonymous'}</p>
                  {selectedReport.userEmail && <p className="text-sm text-sky-400">{selectedReport.userEmail}</p>}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Date Submitted</p>
                  <p className="text-white">{formatDate(selectedReport.createdAt)}</p>
                </div>
                {selectedReport.relatedBookingId && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Related Booking</p>
                    <p className="text-white font-mono">#{selectedReport.relatedBookingId}</p>
                  </div>
                )}
                {selectedReport.relatedPropertyId && (
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Related Property</p>
                    <p className="text-white font-mono">#{selectedReport.relatedPropertyId}</p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              {selectedReport.adminNotes && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Admin Notes</p>
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 text-amber-200 text-sm">
                    {selectedReport.adminNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setNewStatus(selectedReport.status);
                  setShowStatusModal(true);
                }}
                className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                📝 Update Status
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">📝 Update Report Status</h3>
              <p className="text-sm text-slate-400 mt-1">Report #{selectedReport.id}</p>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="OPEN">📂 Open</option>
                  <option value="IN_PROGRESS">🔄 In Progress</option>
                  <option value="RESOLVED">✅ Resolved</option>
                  <option value="CLOSED">🔒 Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this report..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 min-h-[100px]"
                  rows={4}
                />
              </div>
            </div>

            <div className="border-t border-slate-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={actionLoading || !newStatus}
                className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? '⏳ Updating...' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
