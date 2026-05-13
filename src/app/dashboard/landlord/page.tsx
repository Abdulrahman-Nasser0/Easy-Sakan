// This route uses cookies, so it must be dynamic
export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/session';
import { getMyListings } from '@/lib/api';
import Link from 'next/link';
import { landlordStyles, propertyStatusColors } from '@/styles/landlordStyles';

export default async function LandlordDashboard() {
  const session = await getSession();

  if (!session?.token) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Unable to load dashboard. Please log in again.</p>
      </div>
    );
  }

  if (session.role !== 'Landlord' && session.role !== 'Admin') {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Access Default. Only Landlords can view this page.</p>
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
    <div className={landlordStyles.pageContainer}>
      {/* Header */}
      <div className={landlordStyles.headerContainer}>
        <div className={landlordStyles.headerContent}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">🏠 Landlord Dashboard</h1>
              <p className={landlordStyles.pageSubtitle}>Manage your properties and bookings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">
                Welcome, <span className="font-semibold text-emerald-400">{session.name}</span>
              </span>
              <Link href="/profile" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={landlordStyles.mainContent}>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className={landlordStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className={landlordStyles.statLabel}>Total Properties</p>
                <p className={`${landlordStyles.statNumber} mt-2`}>{totalProperties}</p>
              </div>
              <div className="text-4xl opacity-20">🏠</div>
            </div>
          </div>

          <div className={landlordStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className={landlordStyles.statLabel}>Pending Approval</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">{pendingApproval}</p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
          </div>

          <div className={landlordStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className={landlordStyles.statLabel}>Active Bookings</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{activeBookings}</p>
              </div>
              <div className="text-4xl opacity-20">📅</div>
            </div>
          </div>

          <div className={landlordStyles.statCard}>
            <div className="flex items-center justify-between">
              <div>
                <p className={landlordStyles.statLabel}>Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{totalRevenue.toLocaleString()} EGP</p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={landlordStyles.card + ' mb-12'}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/landlord/properties/new" className="block">
              <button className={`${landlordStyles.btnPrimary} w-full flex items-center justify-center gap-2`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                ➕ Upload New Property
              </button>
            </Link>
            <Link href="/dashboard/landlord/my-listings" className="block">
              <button className={`${landlordStyles.btnSecondary} w-full flex items-center justify-center gap-2`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                📋 View My Listings
              </button>
            </Link>
            <button className={`${landlordStyles.btnSecondary} w-full flex items-center justify-center gap-2`}>
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
            <h2 className={`${landlordStyles.sectionHeader}`}>📦 Your Properties</h2>
            <Link href="/dashboard/landlord/my-listings" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              View All →
            </Link>
          </div>
          {properties.length === 0 ? (
          <div className={`${landlordStyles.card} text-center p-12`}>
            <svg
              className="mx-auto h-12 w-12 text-slate-500 mb-4"
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
            <h3 className="text-lg font-medium text-white mb-2">No properties yet</h3>
            <p className="text-slate-400 mb-4">Start uploading properties to attract students and generate bookings</p>
            <Link href="/dashboard/landlord/properties/new">
              <button className={landlordStyles.btnPrimary}>
                ➕ Upload Property
              </button>
            </Link>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, 3).map(property => (
                <div key={property.id} className={landlordStyles.propertyCard}>
                  <div className={landlordStyles.propertyImage}>
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">📷 No Image</div>
                    )}
                    <div className="absolute top-3 right-3">
                       <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                        propertyStatusColors[property.status] || 'bg-slate-700 border-slate-600 text-slate-300'
                      }`}>
                        {property.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className={landlordStyles.propertyContent}>
                    <h3 className={landlordStyles.propertyTitle}>{property.title}</h3>
                    <p className={`${landlordStyles.propertyPrice}`}>{property.price?.toLocaleString()} EGP <span className="text-sm text-slate-400 font-normal">/ month</span></p>
                    <div className="mt-4 pt-4 border-t border-slate-600 flex justify-between items-center text-sm">
                      <span className={landlordStyles.propertyMeta}>📅 {property.availability?.occupiedSlots || 0} Bookings</span>
                      <Link href={`/dashboard/landlord/properties/${property.id}/edit`} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
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
