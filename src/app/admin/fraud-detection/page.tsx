// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetFraudDetection } from '@/lib/api';
import Link from 'next/link';

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

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-900 text-red-200';
      case 'HIGH': return 'bg-orange-900 text-orange-200';
      case 'MEDIUM': return 'bg-yellow-900 text-yellow-200';
      default: return 'bg-blue-900 text-blue-200';
    }
  };

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
        {alerts.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No fraud alerts</p>
            <p className="text-gray-500 text-sm mt-2">✅ System is operating normally</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="bg-gray-800 border-l-4 border-red-500 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{alert.alertType.replace(/_/g, ' ')}</h3>
                    <p className="text-gray-400 text-sm">User: {alert.userName}</p>
                    <p className="text-gray-500 text-xs mt-1">Detected: {new Date(alert.detectedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{alert.description}</p>
                {alert.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                      Resolve
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors">
                      Investigate
                    </button>
                  </div>
                )}
                {alert.status === 'RESOLVED' && (
                  <p className="text-green-400 text-sm font-medium">✅ Resolved</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
