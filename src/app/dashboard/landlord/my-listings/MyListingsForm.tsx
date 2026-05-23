'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyListings, deleteProperty, togglePropertyAvailability } from '@/lib/api';
import { Property } from '@/lib/types';
import { landlordStyles, propertyStatusColors } from '@/styles/landlordStyles';

interface MyListingsProps {
  token: string;
}

export default function MyListings({ token }: MyListingsProps) {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchListings();
  }, [page, statusFilter]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');

    try {
      if (!token) {
        setError('Authentication failed. Please login again.');
        setLoading(false);
        return;
      }

      const response = await getMyListings(token, page, 10, statusFilter || undefined);

      if (response.isSuccess && response.data?.items) {
        // Filter out deleted/soft-deleted properties so they don't reappear after refresh
        const activeListings = response.data.items.filter(
          (item: any) => item.status !== 'DELETED' && item.status !== 'DELETED_BY_ADMIN'
        );
        setListings(activeListings);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load listings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: number) => {
    try {
      if (!token) {
        setError('Authentication failed');
        return;
      }

      const response = await deleteProperty(token, propertyId);

      if (response.isSuccess) {
        setListings(listings.filter(l => l.id !== propertyId));
        setDeleteConfirm(null);
      } else {
        setError(response.message || 'Failed to delete property');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const handleToggleAvailability = async (propertyId: number, currentStatus: boolean) => {
    try {
      if (!token) {
        setError('Authentication failed');
        return;
      }

      const newAvailability = !currentStatus;
      const response = await togglePropertyAvailability(token, propertyId, newAvailability);

      console.log('🔁 Toggle availability response:', response);

      if (response.isSuccess) {
        setListings(
          listings.map(l =>
            l.id === propertyId ? { ...l, isAvailable: newAvailability } : l
          )
        );
      } else {
        setError(response.message || 'Failed to update availability');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availability');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return propertyStatusColors[status as keyof typeof propertyStatusColors] || propertyStatusColors.DRAFT;
  };

  return (
    <div className={landlordStyles.pageContainer}>
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">📋 My Listings</h1>
            <p className="text-slate-400">Manage your properties and track their status</p>
          </div>
          <Link href="/dashboard/landlord/properties/new">
            <button className={`${landlordStyles.btnPrimary} flex items-center gap-2`}>
              <span>➕</span> Upload New Property
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className={`${landlordStyles.alertError} mb-6`}>
            <p>{error}</p>
          </div>
        )}

        {/* Filter */}
        <div className={`${landlordStyles.filterContainer} mb-8`}>
          <button
            onClick={() => {
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === ''
                ? landlordStyles.btnPrimary
                : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setStatusFilter('APPROVED');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'APPROVED'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
            }`}
          >
            ✅ Approved
          </button>
          <button
            onClick={() => {
              setStatusFilter('PENDING_APPROVAL');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
            }`}
          >
            ⏳ Pending
          </button>
        </div>

        {/* Listings Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className={landlordStyles.loadingSpinner}></div>
          </div>
        ) : listings.length === 0 ? (
          <div className={landlordStyles.emptyState}>
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-300 text-lg mb-6">No listings found</p>
            <Link href="/dashboard/landlord/properties/new">
              <button className={landlordStyles.btnPrimary}>
                Create Your First Listing
              </button>
            </Link>
          </div>
        ) : (
          <div className={`${landlordStyles.card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className={landlordStyles.table}>
                <thead className={landlordStyles.tableHeader}>
                  <tr>
                    <th className={landlordStyles.tableHeaderCell}>
                      Property
                    </th>
                    <th className={landlordStyles.tableHeaderCell}>
                      Status
                    </th>
                    <th className={landlordStyles.tableHeaderCell}>
                      Price
                    </th>
                    <th className={landlordStyles.tableHeaderCell}>
                      Availability
                    </th>
                    <th className={landlordStyles.tableHeaderCell}>
                      Bookings
                    </th>
                    <th className={`${landlordStyles.tableHeaderCell} text-right`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {listings.map(listing => (
                    <tr key={listing.id} className={landlordStyles.tableRow}>
                      <td className={landlordStyles.tableCell}>
                        <Link href={`/properties/${listing.id}`} className="text-emerald-400 hover:text-emerald-300 font-medium">
                          {listing.title}
                        </Link>
                      </td>
                      <td className={landlordStyles.tableCell}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(listing.status || '')}`}>
                          {listing.status || 'Unknown'}
                        </span>
                      </td>
                      <td className={landlordStyles.tableCell}>
                        <span className="text-emerald-400 font-medium">
                          {listing.price.toLocaleString()} EGP
                        </span>
                      </td>
                      <td className={landlordStyles.tableCell}>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-300">
                            {listing.availability?.availableSlots || 0} / {listing.availability?.totalCapacity}
                          </span>
                          {!listing.isAvailable && (
                            <span className="inline-block px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={landlordStyles.tableCell}>
                        <span className="font-medium text-slate-300">
                          {listing.availability?.occupiedSlots || 0}
                        </span>
                      </td>
                      <td className={`${landlordStyles.tableCell} text-right`}>
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/landlord/properties/${listing.id}/edit`}>
                            <button className={`${landlordStyles.btnSecondary} text-sm`}>
                              ✏️ Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleToggleAvailability(listing.id, listing.isAvailable ?? true)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              listing.isAvailable ?? true
                                ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                            }`}
                          >
                            {listing.isAvailable ?? true ? '👁️ Hide' : '👁️‍🗨️ Show'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(listing.id)}
                            className={`${landlordStyles.btnDanger} text-sm`}
                          >
                            🗑️ Delete
                          </button>
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
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                page === 1
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === i + 1
                      ? landlordStyles.btnPrimary
                      : 'bg-slate-800/50 text-slate-300 border border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                page === totalPages
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className={landlordStyles.modalBackdrop}>
          <div className={landlordStyles.modal}>
            <div className={landlordStyles.modalHeader}>
              <h2 className="text-xl font-bold text-white">⚠️ Delete Listing?</h2>
            </div>
            <div className={landlordStyles.modalBody}>
              <p className="text-slate-300">Are you sure you want to delete this listing? This action cannot be undone.</p>
            </div>
            <div className={landlordStyles.modalFooter}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className={landlordStyles.btnSecondary}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className={landlordStyles.btnDanger}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
