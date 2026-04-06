'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPropertyById } from '@/lib/api';
import { Property } from '@/lib/types';
import { useParams } from 'next/navigation';

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getPropertyById(propertyId);

      if (response.isSuccess && response.data) {
        setProperty(response.data);
      } else {
        setError(response.message || 'Property not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/properties" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Back to Properties
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 text-lg">{error || 'Property not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isSoldOut = property.availability?.isSoldOut || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/properties" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Properties
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Main Image */}
              <div className="relative w-full h-96 bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[selectedImageIdx].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold">SOLD OUT</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 bg-white grid grid-cols-6 gap-2">
                  {property.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIdx === idx ? 'border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      <img src={image.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-2xl font-bold text-gray-900">{property.areaSqm}m²</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{property.availability?.availableSlots || 0}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
                <p className="text-gray-700 mb-2">{property.location.address}</p>
                {property.location.nearestUniversity && (
                  <p className="text-sm text-gray-600">
                    📍 Near: <strong>{property.location.nearestUniversity}</strong>
                  </p>
                )}
              </div>

              {/* Reviews */}
              {property.reviews && property.reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Reviews ({property.reviewCount})</h2>
                  <div className="space-y-4">
                    {property.reviews.map(review => (
                      <div key={review.id} className="border-t pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900">{review.studentName}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-1">Monthly Price</p>
                <p className="text-4xl font-bold text-blue-600">{property.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">EGP per month</p>
              </div>

              {/* Availability */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Capacity</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-900 font-medium">
                    {property.availability?.occupiedSlots || 0} / {property.availability?.totalCapacity}
                  </span>
                  <span className="text-sm text-blue-600 font-bold">
                    {property.availability?.availableSlots || 0} Available
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isSoldOut ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{
                      width: `${
                        ((property.availability?.occupiedSlots || 0) /
                          (property.availability?.totalCapacity || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Listing Mode & Gender */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="font-medium text-gray-900">{property.listingMode}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Gender</p>
                  <p className="font-medium text-gray-900">{property.gender}</p>
                </div>
              </div>

              {/* Rating */}
              {property.rating > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.round(property.rating) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {property.rating.toFixed(1)} based on {property.reviewCount} reviews
                  </p>
                </div>
              )}

              {/* Booking Button */}
              <button
                disabled={isSoldOut || !property.canBook}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  isSoldOut || !property.canBook
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSoldOut ? 'Sold Out' : !property.canBook ? 'Cannot Book' : 'Book Now'}
              </button>

              {/* ML Insights */}
              {property.mlInsights && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-bold text-amber-900 mb-2">💡 Deal Rating</p>
                  <p className="text-lg font-bold text-amber-600 mb-1">{property.mlInsights.dealRating}</p>
                  <p className="text-xs text-amber-700">
                    Fair price: {property.mlInsights.predictedFairPrice.toLocaleString()} EGP
                    <br />
                    {property.mlInsights.priceDifferencePercentage > 0 ? 'Higher' : 'Lower'} than market by{' '}
                    {Math.abs(property.mlInsights.priceDifferencePercentage).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {/* Landlord Card */}
            {property.landlord && (
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Landlord</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {property.landlord.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{property.landlord.fullName}</p>
                    {property.landlord.isVerified && (
                      <p className="text-xs text-green-600 font-medium">✓ Verified</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Member since: {new Date(property.landlord.memberSince).getFullYear()}</p>
                  {property.landlord.totalListings && <p>Listings: {property.landlord.totalListings}</p>}
                  {property.landlord.averageRating && (
                    <p>Average rating: {property.landlord.averageRating.toFixed(1)} ⭐</p>
                  )}
                </div>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  Contact Landlord
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
