'use client';

import { useState, useEffect } from 'react';
import { adminGetProperties, adminApproveProperty, adminRejectProperty } from '@/lib/api';

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
    // Return minimal styled status with just border and gray colors
    return 'inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{properties.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by title, address, or landlord
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            >
              <option value="">All Status</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {/* Listing Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Mode</label>
            <select
              value={filterListingMode}
              onChange={(e) => {
                setFilterListingMode(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            >
              <option value="">All Modes</option>
              <option value="Bed">Single Bed</option>
              <option value="EntireUnit">Entire Unit</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
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
          className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="border border-gray-300 rounded p-4 text-gray-800 bg-gray-50">
          {error}
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-gray-600"></div>
            <p className="mt-4">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No properties found. Try adjusting your filters.</p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                    {property.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {property.location.address}
                  </p>
                </div>

                {/* Price and Details */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    EGP {property.price.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white">
                    {property.listingMode === 'Bed' ? 'Single Bed' : 'Entire Unit'}
                  </span>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Available: {property.availability.availableSlots}/{property.availability.totalCapacity}
                  </span>
                  <span className="text-gray-600">
                    Active Bookings: {property.activeBookings}
                  </span>
                </div>

                {/* Landlord Info */}
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm font-medium text-gray-900">{property.landlord.fullName}</p>
                  <p className="text-sm text-gray-600">{property.landlord.email}</p>
                  {property.landlord.isVerified && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-900 border border-gray-300 bg-white mt-1">
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
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === property.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(property.id)}
                      disabled={actionLoading === property.id}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === property.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No modal - actions happen directly on cards */}
    </div>
  );
}
