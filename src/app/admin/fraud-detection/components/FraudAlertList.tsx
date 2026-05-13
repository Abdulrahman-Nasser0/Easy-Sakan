'use client';

import { useState } from 'react';
import { adminResolveFraudAlert } from '@/lib/api';
import { adminStyles } from '@/styles/adminStyles';

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
      case 'CRITICAL': return 'bg-red-900/50 border-red-600 text-red-200';
      case 'HIGH': return 'bg-orange-900/50 border-orange-600 text-orange-200';
      case 'MEDIUM': return 'bg-yellow-900/50 border-yellow-600 text-yellow-200';
      default: return 'bg-blue-900/50 border-blue-600 text-blue-200';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className={`${adminStyles.card} text-center p-12`}>
        <p className="text-slate-400 text-lg">✅ No fraud alerts</p>
        <p className="text-slate-500 text-sm mt-2">System is operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert: any) => (
        <div key={alert.id} className={`border-l-4 rounded-lg p-6 transition-all ${alert.status === 'RESOLVED' ? 'bg-slate-800/50 border-l-slate-600 border-slate-700' : 'bg-slate-800/80 border-l-red-600 border border-slate-700'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                ⚠️ {alert.alertType?.replace(/_/g, ' ') || 'Unknown Alert'}
              </h3>
              <p className="text-slate-400 text-sm">👤 User: <span className="text-white font-medium">{alert.userName}</span></p>
              <p className="text-slate-500 text-xs mt-1">📅 Detected: {new Date(alert.detectedAt).toLocaleDateString()}</p>
            </div>
            <span className={`${adminStyles.badge} ${getSeverityColor(alert.severity)}`}>
              {alert.severity === 'CRITICAL' && '🔴'}
              {alert.severity === 'HIGH' && '🟠'}
              {alert.severity === 'MEDIUM' && '🟡'}
              {alert.severity === 'LOW' && '🔵'}
              {' '}{alert.severity}
            </span>
          </div>
          <p className="text-slate-300 mb-4">{alert.description}</p>
          
          {alert.status === 'PENDING' && (
            <div className="flex gap-4 flex-wrap">
              <button
                disabled={loading === alert.id}
                onClick={() => handleResolve(alert.id, 'Confirmed Fraud')}
                className={`${adminStyles.btnDanger} ${adminStyles.btnSmall}`}
              >
                {loading === alert.id ? '⏳ Processing...' : '🚫 Confirm Fraud'}
              </button>
              <button
                disabled={loading === alert.id}
                onClick={() => handleResolve(alert.id, 'False Alarm')}
                className={`${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
              >
                 {loading === alert.id ? '⏳ Processing...' : '✓ Mark as False Alarm'}
              </button>
            </div>
          )}
          {alert.status === 'RESOLVED' && (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm font-medium">✅ Resolved ({alert.resolution})</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}