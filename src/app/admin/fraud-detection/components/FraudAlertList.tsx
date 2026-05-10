'use client';

import { useState } from 'react';
import { adminResolveFraudAlert } from '@/lib/api';

interface FraudAlertListProps {
  initialAlerts: any[];
  token: string;
}

export default function FraudAlertList({ initialAlerts, token }: FraudAlertListProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [loading, setLoading] = useState<number | null>(null);

  const handleResolve = async (id: number, resolution: string) => {
    setLoading(id);
    try {
      const response = await adminResolveFraudAlert(token, id, resolution);
      if (response.isSuccess) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED', resolution } : a))
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-900 text-red-200';
      case 'HIGH': return 'bg-orange-900 text-orange-200';
      case 'MEDIUM': return 'bg-yellow-900 text-yellow-200';
      default: return 'bg-blue-900 text-blue-200';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-lg">No fraud alerts</p>
        <p className="text-gray-500 text-sm mt-2">✅ System is operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert: any) => (
        <div key={alert.id} className={`border-l-4 rounded-lg p-6 ${alert.status === 'RESOLVED' ? 'bg-gray-800/50 border-gray-500' : 'bg-gray-800 border-red-500'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">{alert.alertType?.replace(/_/g, ' ') || 'Unknown Alert'}</h3>
              <p className="text-gray-400 text-sm">User: {alert.userName}</p>
              <p className="text-gray-500 text-xs mt-1">Detected: {new Date(alert.detectedAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-gray-300 mb-4">{alert.description}</p>
          
          {alert.status === 'PENDING' && (
            <div className="flex gap-4">
              <button
                disabled={loading === alert.id}
                onClick={() => handleResolve(alert.id, 'Confirmed Fraud')}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {loading === alert.id ? 'Processing...' : 'Confirm Fraud'}
              </button>
              <button
                disabled={loading === alert.id}
                onClick={() => handleResolve(alert.id, 'False Alarm')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                 {loading === alert.id ? 'Processing...' : 'Mark as False Alarm'}
              </button>
            </div>
          )}
          {alert.status === 'RESOLVED' && (
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm font-medium">✅ Resolved ({alert.resolution})</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}