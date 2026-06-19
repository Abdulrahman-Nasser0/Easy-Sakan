'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Heating',
  'Parking',
  'Laundry',
  'Gym',
  'Pool',
  'Security',
  'Elevator',
  'Furnished',
  'Kitchen',
  'Balcony',
];

const UNIVERSITIES = [
  'Cairo University',
  'AUC',
  'GUC',
  'BUE',
  'MSA',
  'Helwan University',
  'Ain Shams University',
  'German Academy',
  'MIU',
  'MTI',
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    university: '',
    minPrice: '',
    maxPrice: '',
    gender: 'Any',
    rentalType: '',
    amenities: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    includeSoldOut: false,
    minRating: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [page, filters]);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAllProperties(page, 12, {
        search: filters.search || undefined,
        location: filters.location || undefined,
        university: filters.university || undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        gender: filters.gender !== 'Any' ? filters.gender : undefined,
        rentalType: filters.rentalType || undefined,
        amenities: filters.amenities || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder as 'asc' | 'desc' | undefined,
        includeSoldOut: filters.includeSoldOut || undefined,
        minRating: filters.minRating ? parseInt(filters.minRating) : undefined,
      });

      if (response.isSuccess && response.data?.items) {
        setProperties(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load properties');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      university: '',
      minPrice: '',
      maxPrice: '',
      gender: 'Any',
      rentalType: '',
      amenities: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      includeSoldOut: false,
      minRating: '',
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-linear-to-r from-[#0071c2]/50 via-[#005999] to-[#004a7d] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">🏠 Available Properties</h1>
          <p className="text-white/80 mt-1">Browse and filter properties near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-24 shadow-sm">
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-4 p-6 border-b border-gray-200">🔍 Filters</h2>

              <div className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search properties..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g., New Cairo"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nearby University</label>
                  <select
                    name="university"
                    value={filters.university}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="">Any University</option>
                    {UNIVERSITIES.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Price</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Price</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rental Type</label>
                  <select
                    name="rentalType"
                    value={filters.rentalType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Bed">Bed (Shared Room)</option>
                    <option value="EntireUnit">Entire Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Rating</label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amenities</label>
                  <select
                    name="amenities"
                    value={filters.amenities}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="">Any Amenities</option>
                    {COMMON_AMENITIES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="createdAt">Latest</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm"
                  >
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="includeSoldOut"
                    checked={filters.includeSoldOut}
                    onChange={handleFilterChange}
                    className="w-4 h-4 rounded bg-white border-gray-300 text-[#0071c2] focus:ring-[#0071c2]"
                  />
                  <label className="text-sm text-gray-600">Show Sold Out</label>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2.5 bg-white border border-[#0071c2] text-[#0071c2] rounded-md hover:bg-[#ebf3ff] font-medium transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0071c2] rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-lg p-4">
                <p>{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">No properties found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map(property => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#0071c2]/50 transition-all cursor-pointer shadow-sm">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url)}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                              📸 No image
                            </div>
                          )}
                          {property.availability?.isSoldOut && (
                            <div className="absolute top-2 right-2 bg-[#cc0000]/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Sold Out
                            </div>
                          )}
                          {property.mlInsights?.dealRating && property.mlInsights.dealRating === 'Excellent' && (
                            <div className="absolute top-2 left-2 bg-[#0071c2]/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                              🔥 Best Deal
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-[#1a1a2e] truncate">{property.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{property.location.address}</p>
                          {property.location.nearestUniversity && (
                            <p className="text-xs text-[#0071c2] mb-2">🎓 Near {property.location.nearestUniversity}</p>
                          )}

                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-2xl font-bold text-[#0071c2]">{property.price.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">EGP/month</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">
                                {property.availability?.availableSlots || 0} slots
                              </p>
                              <p className="text-xs text-gray-500">Available</p>
                            </div>
                          </div>

                          {/* Rating */}
                          {property.rating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < Math.round(property.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">({property.reviewCount})</span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex gap-4 text-sm text-gray-600 mb-3">
                            <span>🛏️ {property.bedrooms} bed</span>
                            <span>🚿 {property.bathrooms} bath</span>
                            <span>📐 {property.areaSqm}m²</span>
                            {property.listingMode && (
                              <span className="text-[#0071c2]">
                                {property.listingMode === 'Bed' ? '🛌 Bed' : '🏠 Unit'}
                              </span>
                            )}
                          </div>

                          {/* Amenities Preview */}
                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {property.amenities.slice(0, 3).map(amenity => (
                                <span key={amenity} className="inline-block bg-[#ebf3ff] text-[#0071c2] text-xs px-2 py-1 rounded border border-[#0071c2]/20">
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 3 && (
                                <span className="inline-block text-xs text-gray-500">+{property.amenities.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* ML Price Insight */}
                          {property.mlInsights && (
                            <div className="mb-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                property.mlInsights.dealRating === 'Excellent' ? 'bg-[#ebf7eb] text-[#008009]' :
                                property.mlInsights.dealRating === 'Good' ? 'bg-[#ebf3ff] text-[#0071c2]' :
                                'bg-[#fff3e0] text-[#b95000]'
                              }`}>
                                💰 {property.mlInsights.dealRating} Deal: {property.mlInsights.priceDifferencePercentage > 0 ? '+' : ''}{property.mlInsights.priceDifferencePercentage}% vs market
                              </span>
                            </div>
                          )}

                          {/* Landlord */}
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-[#0071c2] flex items-center justify-center text-white text-sm font-bold">
                              {property.landlord.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#1a1a2e]">{property.landlord.fullName}</p>
                              <p className="text-xs text-gray-500">Member since {new Date(property.landlord.memberSince).getFullYear()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === i + 1
                              ? 'bg-[#0071c2] text-white hover:bg-[#005999]'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
