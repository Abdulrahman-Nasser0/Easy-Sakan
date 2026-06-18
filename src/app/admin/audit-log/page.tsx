export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetAuditLog } from '@/lib/api';
import Link from 'next/link';

export default async function AdminAuditLog() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load audit log. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetAuditLog(session.token);
  console.log('📊 Admin Audit Log Response:', response);
  const entries = response.isSuccess ? response.data?.entries || [] : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-[#0071c2]/50 via-[#005999] to-[#004a7d] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ebf3ff] rounded-lg">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Audit Log</h1>
                <p className="text-gray-100 mt-1 text-sm">Track all admin actions and changes</p>
              </div>
            </div>
            <Link href="/admin/dashboard" className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
            <p className="text-gray-600">No audit log entries found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Admin', 'Action', 'Target', 'Details', 'Timestamp'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1a1a2e]">{entry.adminName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1a1a2e]">{entry.action}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex px-2 py-1 rounded text-xs bg-gray-200 text-[#1a1a2e]">
                        {entry.targetType}#{entry.targetId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{entry.details}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
