'use client';

import { useState, useEffect } from 'react';
import { adminGetProperties, adminApproveProperty, adminRejectProperty, adminDeleteProperty } from '@/lib/api';
import { adminStyles, statusColors } from '@/styles/adminStyles';
import { getImageUrl } from '@/lib/utils';
import SafeImage from '@/components/common/SafeImage';

interface Property {
  id: number;
  title: string;
  status: string;
  listingMode: string;
  price: number;
  currency: string;
  location: { address: string; lat: number; lng: number };
  gender: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm?: number;
  images: string[];
  description: string;
  amenities: string[];
  landlord: { id: number; fullName: string; email: string; phone: string; isVerified: boolean };
  availability: { totalCapacity: number; occupiedSlots: number; availableSlots: number };
  isAvailable: boolean;
  activeBookings: number;
  createdAt: string;
  updatedAt: string;
}

interface Props { token: string; }

const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm';
const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer';

export default function PropertiesManagement({ token }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLandlordId] = useState('');
  const [filterListingMode, setFilterListingMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => { fetchProperties(); }, [page, pageSize, filterStatus, filterLandlordId, filterListingMode, searchTerm, sortBy, sortOrder]);

  const fetchProperties = async () => {
    setLoading(true); setError('');
    try {
      const response = await adminGetProperties(token, page, pageSize, { status: filterStatus || undefined, search: searchTerm || undefined, listingMode: filterListingMode || undefined, sortBy, sortOrder });
      if (response.isSuccess) { setProperties(response.data.items || []); setTotalPages(response.data.totalPages || 1); }
      else { setError(response.message || 'Failed to fetch properties'); }
    } catch { setError('Error fetching properties'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (propertyId: number) => {
    setActionLoading(propertyId);
    try {
      const response = await adminApproveProperty(token, propertyId);
      if (response.isSuccess) fetchProperties();
      else setError(response.message || 'Failed to approve property');
    } catch { setError('Error approving property'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (propertyId: number) => {
    setActionLoading(propertyId);
    try {
      const response = await adminRejectProperty(token, propertyId, 'Rejected by admin');
      if (response.isSuccess) fetchProperties();
      else setError(response.message || 'Failed to reject property');
    } catch { setError('Error rejecting property'); }
    finally { setActionLoading(null); }
  };

  const handleDeleteClick = (propertyId: number) => {
    setPropertyToDelete(propertyId); setDeleteReason(''); setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete || !deleteReason.trim()) return;
    setDeleteLoading(true);
    try {
      const response = await adminDeleteProperty(token, propertyToDelete, deleteReason, true);
      if (response.isSuccess) { setShowDeleteModal(false); setPropertyToDelete(null); setDeleteReason(''); fetchProperties(); }
      else { setError(response.message || 'Failed to delete property'); }
    } catch { setError('Error deleting property'); }
    finally { setDeleteLoading(false); }
  };

  const resetFilters = () => { setFilterStatus(''); setFilterListingMode(''); setSearchTerm(''); setSortBy('createdAt'); setSortOrder('desc'); setPage(1); };

  const getStatusColor = (status: string) => {
    if (status === 'PENDING_APPROVAL') return statusColors.PENDING;
    if (status === 'APPROVED') return statusColors.APPROVED;
    if (status === 'REJECTED') return statusColors.REJECTED;
    return statusColors.PENDING;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Search</label>
            <input type="text" placeholder="Search by title, address, or landlord" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Status</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Listing Mode</label>
            <select value={filterListingMode} onChange={(e) => { setFilterListingMode(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Modes</option>
              <option value="Bed">Single Bed</option>
              <option value="EntireUnit">Entire Unit</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Sort By</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className={selectClass}>
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        <button onClick={resetFilters} className="mt-4 border border-[#0071c2] text-[#0071c2] hover:bg-[#ebf3ff] px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">
          Reset Filters
        </button>
      </div>

      {/* Error */}
      {error && <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm">{error}</div>}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 px-6 bg-white rounded-lg border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0071c2]"></div>
            <p className="text-gray-500 mt-4 text-sm">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="col-span-full text-center py-12 px-6 bg-white rounded-lg border border-gray-200">
            <div className="text-5xl mb-4 opacity-40">🏢</div>
            <p className="text-gray-500">No properties found. Try adjusting your filters.</p>
          </div>
        ) : (
          properties.map((property) => {
            const sc = getStatusColor(property.status);
            return (
              <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:border-[#0071c2] hover:shadow-md transition-all">
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <SafeImage
                    src={property.images?.length > 0 ? getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any).url) : null}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.border} ${sc.text}`}>
                      {property.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] text-lg line-clamp-2">{property.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{property.location.address}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#0071c2]">{property.currency} {property.price.toLocaleString()}</span>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf3ff] text-[#0071c2]">
                      {property.listingMode === 'Bed' ? 'Single Bed' : 'Entire Unit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Available: {property.availability.availableSlots}/{property.availability.totalCapacity}</span>
                    <span>Bookings: {property.activeBookings}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-auto">
                    <p className="text-sm font-medium text-[#1a1a2e]">{property.landlord.fullName}</p>
                    <p className="text-sm text-gray-500">{property.landlord.email}</p>
                    {property.landlord.isVerified && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ebf7eb] text-[#008009] mt-2">Verified</span>
                    )}
                  </div>

                  {property.status === 'PENDING_APPROVAL' && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleApprove(property.id)} disabled={actionLoading === property.id}
                        className="flex-1 bg-[#008009] hover:bg-[#006600] text-white px-3 py-1.5 text-xs rounded-md font-medium transition-colors disabled:opacity-50">
                        {actionLoading === property.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button onClick={() => handleReject(property.id)} disabled={actionLoading === property.id}
                        className="flex-1 bg-[#cc0000] hover:bg-[#aa0000] text-white px-3 py-1.5 text-xs rounded-md font-medium transition-colors disabled:opacity-50">
                        {actionLoading === property.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  )}
                  {property.status !== 'DELETED' && (
                    <div className="mt-2">
                      <button onClick={() => handleDeleteClick(property.id)} disabled={actionLoading === property.id}
                        className="w-full border border-gray-200 text-gray-500 hover:text-[#cc0000] hover:border-[#cc0000] px-3 py-1.5 text-xs rounded-md font-medium transition-colors bg-white disabled:opacity-50">
                        Force Delete
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
          <div className="text-sm text-gray-500">Page <span className="font-semibold text-[#1a1a2e]">{page}</span> of <span className="font-semibold text-[#1a1a2e]">{totalPages}</span></div>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">← Previous</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="px-3 py-2 rounded-md border border-gray-200 hover:border-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600">Next →</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Force Delete Property</h3>
            </div>
            <div className="px-6 py-6">
              <div className="bg-[#fff0f0] border border-[#f5c6c6] rounded-md p-4 mb-6">
                <p className="text-sm text-[#cc0000] font-medium">Warning</p>
                <p className="text-sm text-[#cc0000]/80 mt-1">
                  This action will permanently delete this property and cancel all active bookings. This cannot be undone.
                </p>
              </div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Reason for deletion</label>
              <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Specify the reason for force deletion..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm resize-none mb-4 min-h-24"
                rows={4} />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDeleteModal(false)}
                  className="border border-gray-200 text-gray-600 hover:border-gray-300 px-4 py-2 rounded-md font-medium transition-all bg-white text-sm">
                  Cancel
                </button>
                <button onClick={handleConfirmDelete} disabled={deleteLoading || !deleteReason.trim()}
                  className="bg-[#cc0000] hover:bg-[#aa0000] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {deleteLoading ? 'Deleting...' : 'Force Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
