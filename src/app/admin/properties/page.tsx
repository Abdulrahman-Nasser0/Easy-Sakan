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
    <div className="min-h-screen bg-slate-950">
      <div className="bg-gradient-to-r from-sky-900/50 via-slate-800 to-slate-900 border-b border-slate-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <span className="text-lg">🏠</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Properties Management</h1>
              <p className="text-slate-400 mt-1 text-sm">Review and manage property listings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8">
        <PropertiesManagement token={session.token} />
      </div>
    </div>
  );
}
