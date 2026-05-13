// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetFraudDetection } from '@/lib/api';
import Link from 'next/link';
import FraudAlertList from './components/FraudAlertList';

export default async function AdminFraudDetection() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load fraud alerts. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetFraudDetection(session.token);
  console.log('📊 Admin Fraud Detection Response:', response);
  const alerts = response.isSuccess ? response.data?.alerts || [] : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-red-400 to-red-600 rounded-lg">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Fraud Detection</h1>
                <p className="text-red-300/80 mt-1 text-sm">Monitor and resolve fraud alerts</p>
              </div>
            </div>
            <Link href="/admin/dashboard" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FraudAlertList initialAlerts={alerts} token={session.token} />
      </div>
    </div>
  );
}
