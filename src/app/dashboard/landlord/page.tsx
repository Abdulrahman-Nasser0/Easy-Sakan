// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyListings } from '@/lib/api';
import Link from 'next/link';
import { propertyStatusColors } from '@/styles/landlordStyles';
import { getImageUrl } from '@/lib/utils';

export default async function LandlordDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-[#cc0000]">
        <p>Unable to load dashboard. Please log in again.</p>
      </div>
    );
  }

  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className="p-6 text-center text-[#cc0000]">
        <p>Access Denied. Only Landlords can view this page.</p>
      </div>
    );
  }

  // Fetch properties stats
  let totalProperties = 0;
  let pendingApproval = 0;
  let activeBookings = 0;
  let totalRevenue = 0;
  let properties: any[] = [];

  try {
    const listingsRes = await getMyListings(session.token, 1, 100);
    if (listingsRes.isSuccess && listingsRes.data?.items) {
      properties = listingsRes.data.items;
      totalProperties = listingsRes.data.totalCount || properties.length;
      
      properties.forEach(p => {
        if (p.status === 'PENDING_APPROVAL') pendingApproval++;
        activeBookings += (p.availability?.occupiedSlots || 0);
        totalRevenue += (p.availability?.occupiedSlots || 0) * (p.price || 0);
      });
    }
  } catch(e) {
    console.error('Failed to load listings', e);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0071c2] via-[#005999] to-[#004a7d] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">🏠 Landlord Dashboard</h1>
              <p className="text-white/80">Manage your properties and bookings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">
                Welcome, <span className="font-semibold text-white">{session.name}</span>
              </span>
              <Link href="/profile" className="text-white hover:text-white/80 text-sm font-medium transition-colors">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Properties</p>
                <p className="text-3xl font-bold text-[#0071c2] mt-2">{totalProperties}</p>
              </div>
              <div className="text-4xl opacity-20">🏠</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-[#b95000] mt-2">{pendingApproval}</p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-[#0071c2] mt-2">{activeBookings}</p>
              </div>
              <div className="text-4xl opacity-20">📅</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-[#0071c2] mt-2">{totalRevenue.toLocaleString()} EGP</p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/landlord/properties/new" className="block">
              <button className="w-full px-4 py-3 bg-[#0071c2] text-white rounded-md hover:bg-[#005999] font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                ➕ Upload New Property
              </button>
            </Link>
            <Link href="/dashboard/landlord/my-listings" className="block">
              <button className="w-full px-4 py-3 border border-[#0071c2] text-[#0071c2] rounded-md hover:bg-[#ebf3ff] font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                📋 View My Listings
              </button>
            </Link>
            <button className="w-full px-4 py-3 border border-[#0071c2] text-[#0071c2] rounded-md hover:bg-[#ebf3ff] font-medium transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              📊 View Analytics
            </button>
          </div>
        </div>

        {/* Properties Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1a1a2e]">📦 Your Properties</h2>
            <Link href="/dashboard/landlord/my-listings" className="text-[#0071c2] hover:text-[#005999] transition-colors">
              View All →
            </Link>
          </div>
          {properties.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg text-center p-12 shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-2-2l4-2"
              />
            </svg>
            <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-4">Start uploading properties to attract students and generate bookings</p>
            <Link href="/dashboard/landlord/properties/new">
              <button className="px-6 py-2 bg-[#0071c2] text-white rounded-md hover:bg-[#005999] font-medium transition-colors">
                ➕ Upload Property
              </button>
            </Link>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, 3).map(property => (
                <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-[#0071c2]/50 transition-all">
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img src={getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url)} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">📷 No Image</div>
                    )}
                    <div className="absolute top-3 right-3">
                       <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                        propertyStatusColors[property.status] || 'bg-gray-100 border-gray-300 text-gray-700'
                      }`}>
                        {property.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1a1a2e] text-lg truncate">{property.title}</h3>
                    <p className="text-2xl font-bold text-[#0071c2] mt-2">{property.price?.toLocaleString()} EGP <span className="text-sm text-gray-500 font-normal">/ month</span></p>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
                      <span className="text-gray-600">📅 {property.availability?.occupiedSlots || 0} Bookings</span>
                      <Link href={`/dashboard/landlord/properties/${property.id}/edit`} className="text-[#0071c2] hover:text-[#005999] transition-colors font-medium">
                        Edit →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
