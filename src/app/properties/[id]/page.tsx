'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPropertyById } from '@/lib/api';
import { Property } from '@/lib/types';
import { useParams } from 'next/navigation';
import BookingModal from '@/components/common/BookingModal';
import { getImageUrl } from '@/lib/utils';
import { layout, header, card, alert as alertStyle, loading as loadingStyle, badge } from '@/styles/designTokens';

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className={loadingStyle.spinner}></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/properties" className="text-sky-400 hover:text-sky-300 font-medium mb-4 inline-block">
            ← Back to Properties
          </Link>
          <div className={alertStyle.error}><p>{error || 'Property not found'}</p></div>
        </div>
      </div>
    );
  }

  const isSoldOut = property.availability?.isSoldOut || false;

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={header.base}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/properties" className="text-sky-400 hover:text-sky-300 text-sm font-medium mb-3 inline-block">
            ← Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-white">🏠 Property Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images + Description */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className={card.base}>
              <div className="relative w-full h-96 bg-slate-700 rounded-lg overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(typeof property.images[selectedImageIdx] === 'string' ? (property.images[selectedImageIdx] as any) : property.images[selectedImageIdx].url)}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold">🚫 SOLD OUT</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">📸 No image available</div>
                )}
              </div>

              {property.images && property.images.length > 1 && (
                <div className="p-4 border-t border-slate-700 grid grid-cols-6 gap-2">
                  {property.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIdx === idx ? 'border-sky-500' : 'border-slate-600'
                      }`}
                    >
                      <img src={getImageUrl(typeof image === 'string' ? image : (image as any).url)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className={`${card.base} mt-6`}>
              <h1 className="text-3xl font-bold text-white mb-4">✨ {property.title}</h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">🛏️ Bedrooms</p>
                  <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">🚿 Bathrooms</p>
                  <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">📐 Area</p>
                  <p className="text-2xl font-bold text-white">{property.areaSqm}m²</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">🎯 Available</p>
                  <p className="text-2xl font-bold text-sky-400">{property.availability?.availableSlots || 0}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">📝 Description</h2>
                <p className="text-slate-300 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-3">✨ Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-600/30 p-3 rounded-lg">
                        <span className="text-emerald-400">✓</span>
                        <span className="text-slate-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">📍 Location</h2>
                <p className="text-slate-300 mb-2">{property.location.address}</p>
                {property.location.nearestUniversity && (
                  <p className="text-sm text-slate-400">
                    🎓 Near: <strong className="text-sky-400">{property.location.nearestUniversity}</strong>
                  </p>
                )}
              </div>

              {property.reviews && property.reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">⭐ Reviews ({property.reviewCount})</h2>
                  <div className="space-y-4">
                    {property.reviews.map(review => (
                      <div key={review.id} className="border-t border-slate-700 pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-slate-300">{review.studentName}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm">{review.comment}</p>
                        <p className="text-xs text-slate-600 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={card.base}>
              <div className="mb-6">
                <p className="text-slate-400 text-sm mb-1">💰 Monthly Price</p>
                <p className="text-4xl font-bold text-sky-400">{property.price.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">EGP per month</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">👥 Capacity</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 font-medium">
                    {property.availability?.occupiedSlots || 0} / {property.availability?.totalCapacity}
                  </span>
                  <span className="text-sm text-sky-400 font-bold">
                    {property.availability?.availableSlots || 0} Available
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isSoldOut ? 'bg-red-600' : 'bg-sky-500'}`}
                    style={{
                      width: `${((property.availability?.occupiedSlots || 0) / (property.availability?.totalCapacity || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">📋 Type</p>
                  <p className="font-medium text-slate-300">{property.listingMode}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">👤 Gender</p>
                  <p className="font-medium text-slate-300">{property.gender}</p>
                </div>
              </div>

              {property.rating > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(property.rating) ? 'text-yellow-400 text-lg' : 'text-slate-600 text-lg'}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    {property.rating.toFixed(1)} based on {property.reviewCount} reviews
                  </p>
                </div>
              )}

              <button
                onClick={() => setBookingModalOpen(true)}
                disabled={isSoldOut || !property.canBook}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                  isSoldOut || !property.canBook
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-600 active:scale-[0.98]'
                }`}
              >
                {isSoldOut ? '🚫 Sold Out' : !property.canBook ? '❌ Cannot Book' : '📅 Book Now'}
              </button>

              {property.mlInsights && property.mlInsights.predictedFairPrice && property.mlInsights.priceDifferencePercentage !== undefined && (
                <div className="mt-6 bg-amber-900/30 border border-amber-600/30 rounded-lg p-4">
                  <p className="text-sm font-bold text-amber-400 mb-2">💡 Deal Rating</p>
                  <p className="text-lg font-bold text-amber-300 mb-1">{property.mlInsights.dealRating}</p>
                  <p className="text-xs text-amber-200">
                    Fair price: {property.mlInsights.predictedFairPrice.toLocaleString()} EGP<br />
                    {property.mlInsights.priceDifferencePercentage > 0 ? '📈 Higher' : '📉 Lower'} than market by {Math.abs(property.mlInsights.priceDifferencePercentage).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {property.landlord && (
              <div className={`${card.base} mt-6`}>
                <h3 className="text-lg font-bold text-white mb-4">🏠 Landlord</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
                    {property.landlord.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-300">{property.landlord.fullName}</p>
                    {property.landlord.isVerified && (
                      <p className="text-xs text-emerald-400 font-medium">✓ Verified</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-400 mb-4">
                  <p>📅 Member since: {new Date(property.landlord.memberSince).getFullYear()}</p>
                  {property.landlord.totalListings && <p>📋 Listings: {property.landlord.totalListings}</p>}
                  {property.landlord.averageRating && <p>⭐ Average rating: {property.landlord.averageRating.toFixed(1)}</p>}
                </div>
                <button className="bg-slate-700 hover:bg-slate-600 text-white w-full py-2 rounded-lg font-medium transition-colors">
                  💬 Contact Landlord
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {property && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          monthlyPrice={property.price}
        />
      )}
    </div>
  );
}
