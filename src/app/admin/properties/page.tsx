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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
              <p className="text-gray-600 mt-2">Review and manage property listings</p>
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
