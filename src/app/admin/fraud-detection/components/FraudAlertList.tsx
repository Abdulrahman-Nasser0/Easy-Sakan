'use client';

import { useState } from 'react';
import { adminResolveFraudAlert } from '@/lib/api';

interface FraudItem {
  id: string;
  type: string;
  userId: number;
  userEmail: string;
  userName: string;
  documentType: string;
  fraudScore: number;
  status: string;
  createdAt?: string;
  uploadedAt?: string;
  uploaded_at?: string;
  documentUrl?: string;
  document_url?: string;
  fileType?: string;
  file_type?: string;
  isFlagged?: boolean;
}

interface FraudAlertListProps {
  initialAlerts: FraudItem[];
  token: string;
}

export default function FraudAlertList({ initialAlerts, token }: FraudAlertListProps) {
  const [alerts, setAlerts] = useState<FraudItem[]>(
    initialAlerts.filter((item) => {
      if (item.type !== 'DOCUMENT') return false;
      const fScore = item.fraudScore || (item as any).fraud_score || 0;
      return item.isFlagged === true || fScore >= 0.7;
    })
  );
  const [loading, setLoading] = useState<string | null>(null);

  const handleResolve = async (id: string, resolution: string) => {
    setLoading(id);
    try {
      const response = await adminResolveFraudAlert(token, id, resolution);
      if (response.isSuccess) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: resolution } : a))
        );
      } else {
        alert(response.message || 'Failed to resolve alert');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setLoading(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl mb-4">✅</span>
          <p className="font-bold text-xl text-[#1a1a2e]">All clear!</p>
          <p className="text-gray-500 mt-2">No fraudulent documents detected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fraud Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alerts.map((item) => {
              const docType = item.fileType || item.file_type || item.documentType || 'Unknown';
              const fScore = item.fraudScore || (item as any).fraud_score || 0;
              const dateRaw = item.uploadedAt || item.uploaded_at || item.createdAt;
              const dateFormatted = dateRaw ? new Date(dateRaw).toLocaleDateString() : 'N/A';
              const docUrl = item.documentUrl || item.document_url || '#';

              return (
              <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.status === 'APPROVED' || item.status === 'REJECTED' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#1a1a2e] text-sm">{item.userName}</p>
                  <p className="text-xs text-gray-500">{item.userEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-[#ebf3ff] text-[#0071c2]">
                    {docType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-[#cc0000]">
                    {(fScore * 100).toFixed(1)}% Risk
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {dateFormatted}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'APPROVED' ? 'bg-[#ebf7eb] text-[#008009]' : item.status === 'REJECTED' ? 'bg-[#fff0f0] text-[#cc0000]' : 'bg-[#fff3e0] text-[#b95000]'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={docUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-white border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] px-3 py-1.5 rounded text-xs font-medium transition-colors">
                      Review Case
                    </a>
                    {item.status === 'PENDING_REVIEW' && (
                      <>
                        <button onClick={() => handleResolve(item.id, 'APPROVED')} disabled={loading === item.id}
                          className="text-[#008009] hover:bg-[#ebf7eb] px-2 py-1.5 text-xs rounded font-medium border border-[#008009] transition-colors disabled:opacity-50">
                          {loading === item.id ? '...' : 'Approve'}
                        </button>
                        <button onClick={() => handleResolve(item.id, 'REJECTED')} disabled={loading === item.id}
                          className="text-[#cc0000] hover:bg-[#fff0f0] px-2 py-1.5 text-xs rounded font-medium border border-[#cc0000] transition-colors disabled:opacity-50">
                          {loading === item.id ? '...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}