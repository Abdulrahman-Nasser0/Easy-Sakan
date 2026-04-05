// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { adminGetProperties } from '@/lib/api';
import Link from 'next/link';

export default async function AdminProperties() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load properties. Please log in again.</p>
      </div>
    );
  }

  const response = await adminGetProperties(session.token);
  console.log('📊 Admin Properties Response:', response);
  const properties = response.isSuccess ? response.data?.properties || [] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Properties Management</h1>
              <p className="text-gray-400 mt-2">Review and approve property listings</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {properties.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <div key={property.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
                {property.images && property.images[0] && (
                  <div className="h-40 bg-gray-700 overflow-hidden">
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{property.address}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-400">${property.price}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      property.status === 'APPROVED' ? 'bg-green-900 text-green-200' :
                      property.status === 'REJECTED' ? 'bg-red-900 text-red-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                      View
                    </button>
                    {property.status === 'PENDING_REVIEW' && (
                      <>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                          Approve
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
