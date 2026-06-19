'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyListings, deleteProperty, togglePropertyAvailability } from '@/lib/api';
import { Property } from '@/lib/types';
import { landlordStyles, propertyStatusColors } from '@/styles/landlordStyles';

interface Props { token: string; }

const btnPrimary = 'px-5 py-2.5 bg-[#0071c2] hover:bg-[#005999] text-white font-semibold text-sm rounded-md transition-colors';
const btnSecondary = 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] px-4 py-2 rounded-md font-medium transition-colors bg-white text-sm';
const btnDanger = 'bg-white border border-gray-200 text-[#cc0000] hover:bg-[#fff0f0] hover:border-[#cc0000] px-4 py-2 rounded-md font-medium transition-colors text-sm';

export default function MyListingsForm({ token }: Props) {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => { fetchListings(); }, [page, statusFilter]);

  const fetchListings = async () => {
    setLoading(true); setError('');
    try {
      if (!token) { setError('Authentication failed.'); setLoading(false); return; }
      const response = await getMyListings(token, page, 10, statusFilter || undefined);
      if (response.isSuccess && response.data?.items) {
        const activeListings = response.data.items.filter(
          (item: any) => item.status !== 'DELETED' && item.status !== 'DELETED_BY_ADMIN'
        );
        setListings(activeListings);
        setTotalPages(response.data.totalPages || 1);
      } else { setError(response.message || 'Failed to load listings'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (propertyId: number) => {
    try {
      if (!token) { setError('Authentication failed'); return; }
      const response = await deleteProperty(token, propertyId);
      if (response.isSuccess) { setListings(listings.filter(l => l.id !== propertyId)); setDeleteConfirm(null); }
      else { setError(response.message || 'Failed to delete property'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to delete property'); }
  };

  const handleToggleAvailability = async (propertyId: number, currentStatus: boolean) => {
    try {
      if (!token) { setError('Authentication failed'); return; }
      const newAvailability = !currentStatus;
      const response = await togglePropertyAvailability(token, propertyId, newAvailability);
      if (response.isSuccess) { setListings(listings.map(l => l.id === propertyId ? { ...l, isAvailable: newAvailability } : l)); }
      else { setError(response.message || 'Failed to update availability'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to update availability'); }
  };

  const getStatusBadgeColor = (status: string) => {
    return propertyStatusColors[status as keyof typeof propertyStatusColors] || propertyStatusColors.DRAFT;
  };

  const filterBtn = (label: string, value: string, color: string, activeColor: string) => (
    <button onClick={() => { setStatusFilter(value); setPage(1); }}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        statusFilter === value ? activeColor : 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] bg-white'
      }`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">My Listings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your properties and track their status</p>
          </div>
          <Link href="/dashboard/landlord/properties/new">
            <button className={btnPrimary}>Upload New Property</button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 mb-6 text-sm">{error}</div>}

        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filterBtn('All', '', 'bg-gray-100', 'bg-[#0071c2] text-white')}
          {filterBtn('Approved', 'APPROVED', 'bg-gray-100', 'bg-[#008009] text-white')}
          {filterBtn('Pending', 'PENDING_APPROVAL', 'bg-gray-100', 'bg-[#b95000] text-white')}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg text-center p-12">
            <div className="text-5xl mb-4 opacity-40">📭</div>
            <p className="text-gray-500 text-lg mb-6">No listings found</p>
            <Link href="/dashboard/landlord/properties/new">
              <button className={btnPrimary}>Create Your First Listing</button>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f2f6fc] border-b border-gray-200">
                  <tr>
                    {['Property', 'Status', 'Price', 'Availability', 'Bookings', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map(listing => (
                    <tr key={listing.id} className="hover:bg-[#f2f6fc] transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/properties/${listing.id}`} className="text-[#0071c2] hover:text-[#005999] font-medium">
                          {listing.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(listing.status || '')}`}>
                          {listing.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#0071c2]">{listing.price.toLocaleString()} EGP</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-[#1a1a2e]">{listing.availability?.availableSlots || 0} / {listing.availability?.totalCapacity}</span>
                          {!listing.isAvailable && (
                            <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Hidden</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1a1a2e]">{listing.availability?.occupiedSlots || 0}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/landlord/properties/${listing.id}/edit`}>
                            <button className={btnSecondary}>Edit</button>
                          </Link>
                          <button
                            onClick={() => handleToggleAvailability(listing.id, listing.isAvailable ?? true)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              listing.isAvailable ?? true
                                ? 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] bg-white'
                                : 'bg-[#008009]/10 text-[#008009] hover:bg-[#008009]/20'
                            }`}
                          >
                            {listing.isAvailable ?? true ? 'Hide' : 'Show'}
                          </button>
                          <button onClick={() => setDeleteConfirm(listing.id)} className={btnDanger}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                page === 1 ? 'border border-gray-200 text-gray-300 cursor-not-allowed' : 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] bg-white'
              }`}>
              &larr; Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i + 1} onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    page === i + 1 ? 'bg-[#0071c2] text-white' : 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] bg-white'
                  }`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                page === totalPages ? 'border border-gray-200 text-gray-300 cursor-not-allowed' : 'border border-gray-200 text-gray-600 hover:border-[#0071c2] hover:text-[#0071c2] bg-white'
              }`}>
              Next &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Delete Listing?</h2>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className={btnSecondary}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className={btnDanger}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
