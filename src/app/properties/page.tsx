'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import Image from 'next/image';
import { studentStyles } from '@/styles/studentStyles';
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
    <div className={studentStyles.pageContainer}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">🏠 Available Properties</h1>
          <p className="text-slate-400 mt-1">Browse and filter properties near you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className={`${studentStyles.card} rounded-lg border border-slate-700 sticky top-24`}>
              <h2 className="text-lg font-bold text-white mb-4">🔍 Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className={studentStyles.inputLabel}>Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search properties..."
                    className={studentStyles.input}
                  />
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g., New Cairo"
                    className={studentStyles.input}
                  />
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Nearby University</label>
                  <select
                    name="university"
                    value={filters.university}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
                  >
                    <option value="">Any University</option>
                    {UNIVERSITIES.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={studentStyles.inputLabel}>Min Price</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className={studentStyles.input}
                    />
                  </div>
                  <div>
                    <label className={studentStyles.inputLabel}>Max Price</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className={studentStyles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Rental Type</label>
                  <select
                    name="rentalType"
                    value={filters.rentalType}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
                  >
                    <option value="">All Types</option>
                    <option value="Bed">Bed (Shared Room)</option>
                    <option value="EntireUnit">Entire Unit</option>
                  </select>
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Min Rating</label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
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
                  <label className={studentStyles.inputLabel}>Amenities</label>
                  <select
                    name="amenities"
                    value={filters.amenities}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
                  >
                    <option value="">Any Amenities</option>
                    {COMMON_AMENITIES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
                  >
                    <option value="createdAt">Latest</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <div>
                  <label className={studentStyles.inputLabel}>Sort Order</label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className={studentStyles.select}
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
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-slate-300">Show Sold Out</label>
                </div>

                <button
                  onClick={resetFilters}
                  className={studentStyles.btnSecondary}
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
                <div className={studentStyles.loadingSpinner}></div>
              </div>
            ) : error ? (
              <div className={studentStyles.alertError}>
                <p>{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className={studentStyles.emptyState}>
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-slate-300 text-lg">No properties found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map(property => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <div className={`${studentStyles.card} border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer`}>
                        {/* Image */}
                        <div className="relative h-48 bg-slate-700">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url)}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                              📸 No image
                            </div>
                          )}
                          {property.availability?.isSoldOut && (
                            <div className="absolute top-2 right-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Sold Out
                            </div>
                          )}
                          {property.mlInsights?.dealRating && property.mlInsights.dealRating === 'Excellent' && (
                            <div className="absolute top-2 left-2 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                              🔥 Best Deal
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white truncate">{property.title}</h3>
                          <p className="text-sm text-slate-400 mb-2">{property.location.address}</p>
                          {property.location.nearestUniversity && (
                            <p className="text-xs text-blue-400 mb-2">🎓 Near {property.location.nearestUniversity}</p>
                          )}

                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-2xl font-bold text-blue-400">{property.price.toLocaleString()}</p>
                              <p className="text-sm text-slate-500">EGP/month</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-300">
                                {property.availability?.availableSlots || 0} slots
                              </p>
                              <p className="text-xs text-slate-500">Available</p>
                            </div>
                          </div>

                          {/* Rating */}
                          {property.rating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < Math.round(property.rating) ? 'text-yellow-400' : 'text-slate-600'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-slate-400">({property.reviewCount})</span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex gap-4 text-sm text-slate-400 mb-3">
                            <span>🛏️ {property.bedrooms} bed</span>
                            <span>🚿 {property.bathrooms} bath</span>
                            <span>📐 {property.areaSqm}m²</span>
                            {property.listingMode && (
                              <span className={property.listingMode === 'Bed' ? 'text-emerald-400' : 'text-blue-400'}>
                                {property.listingMode === 'Bed' ? '🛌 Bed' : '🏠 Unit'}
                              </span>
                            )}
                          </div>

                          {/* Amenities Preview */}
                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {property.amenities.slice(0, 3).map(amenity => (
                                <span key={amenity} className="inline-block bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30">
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 3 && (
                                <span className="inline-block text-xs text-slate-500">+{property.amenities.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* ML Price Insight */}
                          {property.mlInsights && (
                            <div className="mb-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                property.mlInsights.dealRating === 'Excellent' ? 'bg-emerald-600/30 text-emerald-300' :
                                property.mlInsights.dealRating === 'Good' ? 'bg-blue-600/30 text-blue-300' :
                                'bg-yellow-600/30 text-yellow-300'
                              }`}>
                                💰 {property.mlInsights.dealRating} Deal: {property.mlInsights.priceDifferencePercentage > 0 ? '+' : ''}{property.mlInsights.priceDifferencePercentage}% vs market
                              </span>
                            </div>
                          )}

                          {/* Landlord */}
                          <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                              {property.landlord.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-300">{property.landlord.fullName}</p>
                              <p className="text-xs text-slate-500">Member since {new Date(property.landlord.memberSince).getFullYear()}</p>
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
                          ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
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
                              ? studentStyles.btnPrimary
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
