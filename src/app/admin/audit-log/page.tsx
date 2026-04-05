// This route uses cookies, so it must be dynamic
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
  const entries = response.isSuccess ? response.data?.entries || [] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Audit Log</h1>
              <p className="text-gray-400 mt-2">Track all admin actions and changes</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400">No audit log entries found</p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Admin</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Target</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Details</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-3 text-sm">{entry.adminName}</td>
                    <td className="px-6 py-3 text-sm font-medium">{entry.action}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-gray-700">
                        {entry.targetType}#{entry.targetId}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-300">{entry.details}</td>
                    <td className="px-6 py-3 text-sm text-gray-400">
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
