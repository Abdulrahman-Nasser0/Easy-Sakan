'use client';

import { useState, useEffect } from 'react';
import { adminGetProperties } from '@/lib/api';
import PropertyDetailModal from './PropertyDetailModal';

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
  images: string[];
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
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleViewProperty = (propertyId: number) => {
    setSelectedProperty(propertyId);
    setShowDetailModal(true);
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
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DELETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
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
                  <span className="text-2xl font-bold text-blue-600">
                    EGP {property.price.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewProperty(property.id)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Details
                </button>
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

      {/* Property Detail Modal */}
      {showDetailModal && selectedProperty && (
        <PropertyDetailModal
          token={token}
          propertyId={selectedProperty}
          onClose={() => setShowDetailModal(false)}
          onPropertyUpdated={() => {
            setShowDetailModal(false);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
}
