'use client';

import { useState } from 'react';
import {
  adminApproveProperty,
  adminRejectProperty,
  adminDeleteProperty,
} from '@/lib/api';

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

interface PropertyDetailModalProps {
  token: string;
  property: Property;
  onClose: () => void;
  onPropertyUpdated: () => void;
}

export default function PropertyDetailModal({
  token,
  property,
  onClose,
  onPropertyUpdated,
}: PropertyDetailModalProps) {
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [cancelActiveBookings, setCancelActiveBookings] = useState(true);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await adminApproveProperty(token, property.id);
      if (response.isSuccess) {
        setShowApproveModal(false);
        onPropertyUpdated();
      } else {
        setError(response.message || 'Failed to approve property');
      }
    } catch (err) {
      setError('Error approving property');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    try {
      const response = await adminRejectProperty(token, property.id, rejectReason);
      if (response.isSuccess) {
        setShowRejectModal(false);
        setRejectReason('');
        onPropertyUpdated();
      } else {
        setError(response.message || 'Failed to reject property');
      }
    } catch (err) {
      setError('Error rejecting property');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Deletion reason is required');
      return;
    }
    setActionLoading(true);
    try {
      const response = await adminDeleteProperty(token, property.id, deleteReason, cancelActiveBookings);
      if (response.isSuccess) {
        setShowDeleteModal(false);
        setDeleteReason('');
        onPropertyUpdated();
      } else {
        setError(response.message || 'Failed to delete property');
      }
    } catch (err) {
      setError('Error deleting property');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && !showApproveModal && !showRejectModal && !showDeleteModal ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <>
                        <img
                          src={property.images[currentImageIndex] || '/img/placeholder.jpg'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        {property.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                              ←
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                            >
                              →
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                              {currentImageIndex + 1} / {property.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Images
                      </div>
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  {property.images && property.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {property.images.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            idx === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                          }`}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{property.title}</h3>
                      <p className="text-gray-600 mt-1">{property.location.address}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'PENDING_APPROVAL'
                        ? 'bg-yellow-100 text-yellow-800'
                        : property.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Price and Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-blue-600">EGP {property.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Listing Mode</p>
                      <p className="font-semibold text-gray-900">
                        {property.listingMode === 'Bed' ? 'Single Bed' : 'Entire Unit'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                    <p className="text-gray-600">{property.description}</p>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-900 mb-3">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Capacity</p>
                        <p className="font-semibold text-gray-900">{property.availability.totalCapacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Available Slots</p>
                        <p className="font-semibold text-green-600">{property.availability.availableSlots}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Bookings</p>
                        <p className="font-semibold text-gray-900">{property.activeBookings}</p>
                      </div>
                    </div>
                  </div>

                  {/* Landlord Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm font-medium text-gray-900 mb-4">Landlord Information</p>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                        {property.landlord.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{property.landlord.fullName}</p>
                        <p className="text-sm text-gray-600">{property.landlord.email}</p>
                        <p className="text-sm text-gray-600">{property.landlord.phone}</p>
                        {property.landlord.isVerified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                            ✓ Verified Landlord
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {new Date(property.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(property.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {property.status === 'PENDING_APPROVAL' && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Admin Actions</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowApproveModal(true)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Action (Always Available) */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium"
                  >
                    Delete Property (Policy Violation)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && property && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Approve Property?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve "{property.title}" for listing?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && property && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Property</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for rejection. The landlord will be notified and can resubmit.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason (min 10 characters)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 min-h-24 text-black"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || rejectReason.length < 10}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && property && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Property</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for deletion. This action will cancel all active bookings.
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Deletion reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-4 min-h-24 text-black"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={cancelActiveBookings}
                onChange={(e) => setCancelActiveBookings(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Cancel all active bookings</span>
            </label>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading || !deleteReason.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
