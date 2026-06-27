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
  // The backend returns { items: [...], summary: {...} }
  const initialAlerts = response.isSuccess ? (response.data?.items || []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fff0f0] text-[#cc0000] rounded-lg">
              <span className="text-lg">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Fraud Detection</h1>
              <p className="text-gray-500 mt-1 text-sm">Review AI-flagged documents and listings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <FraudAlertList token={session.token} initialAlerts={initialAlerts} />
      </div>
    </div>
  );
}
