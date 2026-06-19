// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyListings } from '@/lib/api';
import Link from 'next/link';
import { propertyStatusColors } from '@/styles/landlordStyles';
import { getImageUrl } from '@/lib/utils';

const btnPrimary = 'inline-block px-5 py-2.5 bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm rounded-md transition-colors text-center';
const btnOutline = 'inline-block px-5 py-2.5 border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] font-semibold text-sm rounded-md transition-colors text-center bg-white';

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
  } catch { /* noop */ }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Landlord Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your properties and bookings</p>
            </div>
            <Link href="/profile" className="text-[#0071c2] hover:text-[#005999] text-sm font-medium transition-colors">
              {session.name} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm">Total Properties</p>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{totalProperties}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm">Pending Approval</p>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{pendingApproval}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm">Active Bookings</p>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{activeBookings}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{totalRevenue.toLocaleString()} <span className="text-lg">EGP</span></p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link href="/dashboard/landlord/properties/new" className={btnPrimary}>
            Upload New Property
          </Link>
          <Link href="/dashboard/landlord/my-listings" className={btnOutline}>
            View My Listings
          </Link>
          <button className={btnOutline}>
            View Analytics
          </button>
        </div>

        {/* Properties Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Your Properties</h2>
            <Link href="/dashboard/landlord/my-listings" className="text-[#0071c2] hover:text-[#005999] text-sm font-medium transition-colors">
              View All &rarr;
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg text-center p-12">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">No properties yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start uploading properties to attract students and generate bookings</p>
              <Link href="/dashboard/landlord/properties/new" className={btnPrimary}>
                Upload Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, 3).map(property => {
                const firstImage = property.images?.[0];
                const imgUrl = firstImage
                  ? getImageUrl(typeof firstImage === 'string' ? firstImage : firstImage.url)
                  : null;

                return (
                  <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#0071c2] hover:shadow-md transition-all">
                    <div className="relative h-48 bg-gray-100">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        {!imgUrl && 'No Image'}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border-0 ${
                          propertyStatusColors[property.status] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {property.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1a1a2e] text-lg truncate">{property.title}</h3>
                      <p className="text-2xl font-bold text-[#0071c2] mt-2">{property.price?.toLocaleString()} EGP <span className="text-sm text-gray-500 font-normal">/ month</span></p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                        <span className="text-gray-500">{property.availability?.occupiedSlots || 0} Bookings</span>
                        <Link href={`/dashboard/landlord/properties/${property.id}/edit`} className="text-[#0071c2] hover:text-[#005999] font-medium">
                          Edit &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
