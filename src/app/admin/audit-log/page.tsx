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
    <div className="min-h-screen bg-slate-950">
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/20 rounded-lg">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Audit Log</h1>
                <p className="text-slate-400 mt-1 text-sm">Track all admin actions and changes</p>
              </div>
            </div>
            <Link href="/admin/dashboard" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400">No audit log entries found</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  {['Admin', 'Action', 'Target', 'Details', 'Timestamp'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-200">{entry.adminName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{entry.action}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">
                        {entry.targetType}#{entry.targetId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{entry.details}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
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
