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

interface AdminReportsClientProps { token: string; }

const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm';
const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer';
const ghostBtn = 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] px-4 py-2 rounded-md font-medium transition-colors bg-white text-sm';

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-[#fff3e0] text-[#b95000]',
  IN_PROGRESS: 'bg-[#ebf3ff] text-[#0071c2]',
  RESOLVED: 'bg-[#ebf7eb] text-[#008009]',
  CLOSED: 'bg-gray-100 text-gray-500',
};

const TYPE_LABELS: Record<string, string> = {
  BUG: '🐛 Bug', PAYMENT: '💰 Payment', BOOKING: '📅 Booking',
  PROPERTY: '🏠 Property', ACCOUNT: '👤 Account', OTHER: '📝 Other',
};

const STATUS_OPTIONS: Record<string, string> = {
  OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved', CLOSED: 'Closed',
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
    setLoading(true); setError('');
    try {
      const response = await adminGetReports(token, page, 20, typeFilter || undefined, statusFilter || undefined);
      if (response.isSuccess) { setReports(response.data?.items || []); setTotalPages(response.data?.totalPages || 1); }
      else { setError(response.message || 'Failed to fetch reports'); }
    } catch { setError('Error fetching reports'); }
    finally { setLoading(false); }
  }, [token, page, typeFilter, statusFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleUpdateStatus = async () => {
    if (!selectedReport || !newStatus) return;
    setActionLoading(true);
    try {
      const response = await adminUpdateReportStatus(token, selectedReport.id, { status: newStatus, adminNotes: adminNotes || undefined });
      if (response.isSuccess) { fetchReports(); setShowStatusModal(false); setShowDetailModal(false); setSelectedReport(null); setAdminNotes(''); }
      else { setError(response.message || 'Failed to update report status'); }
    } catch { setError('Error updating report status'); }
    finally { setActionLoading(false); }
  };

  const getStatusColor = (status: string) => STATUS_STYLES[status] || STATUS_STYLES.OPEN;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const resetFilters = () => { setTypeFilter(''); setStatusFilter(''); setPage(1); };

  return (
    <>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className={selectClass}>
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
            <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button onClick={resetFilters} className={ghostBtn}>Reset Filters</button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 mb-6 text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2] mb-4"></div>
            <p className="text-gray-500 text-sm">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-40">📊</div>
            <p className="text-gray-500">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f2f6fc] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-[#f2f6fc] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1a1a2e] font-mono">#{report.id}</td>
                    <td className="px-6 py-4 text-sm">{TYPE_LABELS[report.type] || report.type}</td>
                    <td className="px-6 py-4 text-sm text-[#1a1a2e] font-medium max-w-[200px] truncate">{report.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="text-[#1a1a2e]">{report.userName || 'Anonymous'}</p>
                        {report.userEmail && <p className="text-xs text-gray-500">{report.userEmail}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {STATUS_OPTIONS[report.status] || report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button onClick={() => { setSelectedReport(report); setShowDetailModal(true); }}
                        className="bg-[#0071c2] hover:bg-[#005999] text-white px-3 py-1 text-xs rounded font-medium transition-colors">View</button>
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
          <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">← Previous</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">Next →</button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-[#1a1a2e]">{TYPE_LABELS[selectedReport.type] || selectedReport.type} Report #{selectedReport.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-[#1a1a2e] text-xl">&times;</button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedReport.status)}`}>
                  {STATUS_OPTIONS[selectedReport.status] || selectedReport.status}
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {TYPE_LABELS[selectedReport.type] || selectedReport.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-[#1a1a2e] font-medium text-lg">{selectedReport.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <div className="bg-white border border-gray-200 rounded-md p-4 text-gray-600 whitespace-pre-wrap text-sm">{selectedReport.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Submitted By', value: selectedReport.userName || 'Anonymous', sub: selectedReport.userEmail },
                  { label: 'Date Submitted', value: formatDate(selectedReport.createdAt) },
                  ...(selectedReport.relatedBookingId ? [{ label: 'Related Booking', value: `#${selectedReport.relatedBookingId}`, mono: true }] : []),
                  ...(selectedReport.relatedPropertyId ? [{ label: 'Related Property', value: `#${selectedReport.relatedPropertyId}`, mono: true }] : []),
                ].map(item => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-md p-4">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-medium text-[#1a1a2e] ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                    {item.sub && <p className="text-sm text-[#0071c2]">{item.sub}</p>}
                  </div>
                ))}
              </div>
              {selectedReport.adminNotes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                  <div className="bg-[#fff3e0] border border-[#f5d6a3] rounded-md p-4 text-[#b95000] text-sm">{selectedReport.adminNotes}</div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setNewStatus(selectedReport.status); setShowStatusModal(true); }}
                className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">Update Status</button>
              <button onClick={() => setShowDetailModal(false)} className={ghostBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Update Report Status</h3>
              <p className="text-sm text-gray-500 mt-1">Report #{selectedReport.id}</p>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={selectClass}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this report..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none min-h-[100px]"
                  rows={4} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowStatusModal(false)} className={ghostBtn}>Cancel</button>
              <button onClick={handleUpdateStatus} disabled={actionLoading || !newStatus}
                className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
