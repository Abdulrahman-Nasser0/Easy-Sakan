export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetFraudDetection } from '@/lib/api';
import FraudAlertList from './components/FraudAlertList';

export default async function AdminFraudDetection() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load fraud data. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetFraudDetection(session.token);
  const initialAlerts = response.isSuccess ? (response.data?.alerts || response.data || []) : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <span className="text-lg">🔍</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fraud Detection</h1>
              <p className="text-slate-400 mt-1 text-sm">ML-powered fraud analysis and alerts</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8">
        <FraudAlertList token={session.token} initialAlerts={initialAlerts} />
      </div>
    </div>
  );
}
