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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Fraud Detection</h1>
              <p className="text-gray-400 mt-2">Monitor and resolve fraud alerts</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
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
