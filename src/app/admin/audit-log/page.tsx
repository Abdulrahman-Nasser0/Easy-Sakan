export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetAuditLog } from '@/lib/api';
import Link from 'next/link';

export default async function AdminAuditLog() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-[#cc0000]">
        <p>Unable to load audit log. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetAuditLog(session.token);
  const entries = response.isSuccess ? response.data?.entries || [] : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Audit Log</h1>
              <p className="text-gray-500 mt-1 text-sm">Track all admin actions and changes</p>
            </div>
            <Link href="/admin/dashboard" className="bg-[#0071c2] hover:bg-[#005999] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500">No audit log entries found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f2f6fc] border-b border-gray-200">
                  {['Admin', 'Action', 'Target', 'Details', 'Timestamp'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-[#f2f6fc] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1a1a2e]">{entry.adminName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1a1a2e]">{entry.action}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex px-2 py-1 rounded text-xs bg-gray-100 text-[#1a1a2e]">
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
