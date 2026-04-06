'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import Image from 'next/image';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    gender: 'Any',
    sortBy: 'createdAt',
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
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        gender: filters.gender !== 'Any' ? filters.gender : undefined,
        sortBy: filters.sortBy,
        sortOrder: 'desc',
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
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Available Properties</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search properties..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g., New Cairo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Latest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      location: '',
                      minPrice: '',
                      maxPrice: '',
                      gender: 'Any',
                      sortBy: 'createdAt',
                    });
                    setPage(1);
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
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
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">No properties found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map(property => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                              No image
                            </div>
                          )}
                          {property.availability?.isSoldOut && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Sold Out
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{property.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{property.location.address}</p>

                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{property.price.toLocaleString()}</p>
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
                            <span>{property.bedrooms} bed</span>
                            <span>{property.bathrooms} bath</span>
                            <span>{property.areaSqm}m²</span>
                          </div>

                          {/* Amenities Preview */}
                          {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {property.amenities.slice(0, 3).map(amenity => (
                                <span key={amenity} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 3 && (
                                <span className="inline-block text-xs text-gray-500">+{property.amenities.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* Landlord */}
                          <div className="flex items-center gap-2 pt-3 border-t">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                              {property.landlord.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{property.landlord.fullName}</p>
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`px-3 py-2 rounded-lg ${
                            page === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
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
