'use client';

import { useState, useEffect } from 'react';
import { adminGetProperties, adminApproveProperty, adminRejectProperty, adminDeleteProperty } from '@/lib/api';
import { adminStyles, statusColors } from '@/styles/adminStyles';
import { getImageUrl } from '@/lib/utils';

interface Property {
  id: number;
  title: string;
  status: string;
  listingMode: string;
  price: number;
  currency: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  gender: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm?: number;
  images: string[];
  description: string;
  amenities: string[];
  landlord: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    isVerified: boolean;
  };
  availability: {
    totalCapacity: number;
    occupiedSlots: number;
    availableSlots: number;
  };
  isAvailable: boolean;
  activeBookings: number;
  createdAt: string;
  updatedAt: string;
}

interface PropertiesManagementProps {
  token: string;
}

export default function PropertiesManagement({ token }: PropertiesManagementProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLandlordId, setFilterLandlordId] = useState('');
  const [filterListingMode, setFilterListingMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchProperties();
  }, [page, pageSize, filterStatus, filterLandlordId, filterListingMode, searchTerm, sortBy, sortOrder]);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminGetProperties(token, page, pageSize, {
        status: filterStatus || undefined,
        landlordId: filterLandlordId ? parseInt(filterLandlordId) : undefined,
        search: searchTerm || undefined,
        listingMode: filterListingMode || undefined,
        sortBy,
        sortOrder,
      });

      if (response.isSuccess) {
        setProperties(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Error fetching properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (property: Property) => {
    // Validate property has required fields
    if (!property || !property.id || !property.title) {
      setError('Invalid property data');
      return;
    }
    // No modal anymore - just approve/reject buttons on card
  };

  const handleApprove = async (propertyId: number) => {
    setActionLoading(propertyId);
    try {
      console.log('🟢 handleApprove - Starting approval for property:', propertyId);
      const response = await adminApproveProperty(token, propertyId);
      console.log('🟢 handleApprove - Response:', response);
      if (response.isSuccess) {
        console.log('✅ Approval successful');
        fetchProperties();
      } else {
        console.log('❌ Approval failed:', response.message || response);
        setError(response.message || 'Failed to approve property');
      }
    } catch (err) {
      console.error('❌ handleApprove - Error:', err);
      setError('Error approving property');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (propertyId: number) => {
    setActionLoading(propertyId);
    try {
      console.log('🔴 handleReject - Starting rejection for property:', propertyId);
      const response = await adminRejectProperty(token, propertyId, 'Rejected by admin');
      console.log('🔴 handleReject - Response:', response);
      if (response.isSuccess) {
        console.log('✅ Rejection successful');
        fetchProperties();
      } else {
        console.log('❌ Rejection failed:', response.message || response);
        setError(response.message || 'Failed to reject property');
      }
    } catch (err) {
      console.error('❌ handleReject - Error:', err);
      setError('Error rejecting property');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (propertyId: number) => {
    setPropertyToDelete(propertyId);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete || !deleteReason.trim()) return;
    setDeleteLoading(true);
    try {
      const response = await adminDeleteProperty(token, propertyToDelete, deleteReason, true);
      if (response.isSuccess) {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
        setDeleteReason('');
        fetchProperties();
      } else {
        setError(response.message || 'Failed to delete property');
      }
    } catch (err) {
      setError('Error deleting property');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterStatus('');
    setFilterLandlordId('');
    setFilterListingMode('');
    setSearchTerm('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase().replace('_', '');
    if (status === 'PENDING_APPROVAL') return statusColors.PENDING;
    if (status === 'APPROVED') return statusColors.APPROVED;
    if (status === 'REJECTED') return statusColors.REJECTED;
    return statusColors.PENDING;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={adminStyles.sectionHeader}>🏠 Properties Management</h1>
        <div className="text-sm text-slate-400">
          Total: <span className="font-semibold text-slate-200">{properties.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className={adminStyles.filterContainer}>
        <h2 className="text-lg font-semibold text-white mb-4">Filters & Search</h2>

        <div className={adminStyles.filterGrid}>
          {/* Search */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Search by title, address, or landlord</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className={adminStyles.input}
            />
          </div>

          {/* Status Filter */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="">All Status</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {/* Listing Mode */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Listing Mode</label>
            <select
              value={filterListingMode}
              onChange={(e) => {
                setFilterListingMode(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="">All Modes</option>
              <option value="Bed">Single Bed</option>
              <option value="EntireUnit">Entire Unit</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.inputLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className={adminStyles.select}
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className={`${adminStyles.btnSecondary} mt-4`}
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={adminStyles.alertError}>{error}</div>}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className={adminStyles.emptyState}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-slate-600 border-t-slate-400"></div>
            <p className={`mt-4 ${adminStyles.emptyStateText}`}>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className={adminStyles.emptyState}>
            <div className={`${adminStyles.emptyStateIcon}`}>🏢</div>
            <p className={adminStyles.emptyStateText}>No properties found. Try adjusting your filters.</p>
          </div>
        ) : (
          properties.map((property) => {
            const statusColor = getStatusColor(property.status);
            return (
              <div
                key={property.id}
                className={`${adminStyles.card} overflow-hidden flex flex-col`}
              >
                {/* Property Image */}
                <div className="relative h-48 bg-slate-700 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any).url)}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      📷 No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`${adminStyles.badge} ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                      {property.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-semibold text-white text-lg line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-1">
                      📍 {property.location.address}
                    </p>
                  </div>

                  {/* Price and Details */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-sky-400">
                      {property.currency} {property.price.toLocaleString()}
                    </span>
                    <span className={`${adminStyles.badge} ${adminStyles.badgeInfo}`}>
                      {property.listingMode === 'Bed' ? 'Single Bed' : 'Entire Unit'}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>
                      ✓ Available: {property.availability.availableSlots}/{property.availability.totalCapacity}
                    </span>
                    <span>
                      📅 Bookings: {property.activeBookings}
                    </span>
                  </div>

                  {/* Landlord Info */}
                  <div className="border-t border-slate-700 pt-3 mt-auto">
                    <p className="text-sm font-medium text-slate-200">{property.landlord.fullName}</p>
                    <p className="text-sm text-slate-400">{property.landlord.email}</p>
                    {property.landlord.isVerified && (
                      <span className={`${adminStyles.badge} ${adminStyles.badgeSuccess} mt-2`}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {property.status === 'PENDING_APPROVAL' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApprove(property.id)}
                        disabled={actionLoading === property.id}
                        className={`flex-1 ${adminStyles.btnSuccess} ${adminStyles.btnSmall}`}
                      >
                        {actionLoading === property.id ? '⏳ Approving...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        disabled={actionLoading === property.id}
                        className={`flex-1 ${adminStyles.btnDanger} ${adminStyles.btnSmall}`}
                      >
                        {actionLoading === property.id ? '⏳ Rejecting...' : '✕ Reject'}
                      </button>
                    </div>
                  )}
                  {property.status !== 'DELETED' && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleDeleteClick(property.id)}
                        disabled={actionLoading === property.id}
                        className={`w-full ${adminStyles.btnDanger} ${adminStyles.btnSmall} opacity-60 hover:opacity-100`}
                      >
                        🗑️ Force Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-slate-400">
            Page <span className="font-semibold text-slate-200">{page}</span> of <span className="font-semibold text-slate-200">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={adminStyles.paginationBtn}
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={adminStyles.paginationBtn}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Delete Property Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full">
            <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">🗑️ Force Delete Property</h3>
            </div>
            <div className="px-6 py-6">
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-300 font-medium">⚠️ Warning</p>
                <p className="text-sm text-red-200/80 mt-1">
                  This action will permanently delete this property and cancel all active bookings. This cannot be undone.
                </p>
              </div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Reason for deletion</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Specify the reason for force deletion..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 mb-4 min-h-24"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteModal(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading || !deleteReason.trim()}
                  className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? '⏳ Deleting...' : '🗑️ Force Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
