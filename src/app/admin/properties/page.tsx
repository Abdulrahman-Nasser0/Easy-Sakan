export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import PropertiesManagement from './PropertiesManagement';

export default async function AdminProperties() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load properties. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-lg">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Properties Management</h1>
                <p className="text-emerald-300/80 mt-1 text-sm">Review and manage property listings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PropertiesManagement token={session.token} />
      </div>
    </div>
  );
}
