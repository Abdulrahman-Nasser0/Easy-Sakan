'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecommendedProperties, getAllProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import SafeImage from '@/components/common/SafeImage';

interface RecommendedPropertiesProps {
  token?: string;
  userRole?: string | null;
}

export default function RecommendedProperties({ token, userRole }: RecommendedPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || userRole !== 'Student') {
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        let fetchedProperties: Property[] = [];

        if (token) {
          const response = await getRecommendedProperties(token, 1, 4);
          if (response.isSuccess && response.data?.items && response.data.items.length > 0) {
            fetchedProperties = response.data.items;
          }
        }

        // Fallback silently
        if (fetchedProperties.length === 0) {
          const fallbackResponse = await getAllProperties(1, 4, { sortBy: 'createdAt', sortOrder: 'desc' });
          if (fallbackResponse.isSuccess && fallbackResponse.data?.items) {
            fetchedProperties = fallbackResponse.data.items;
          }
        }

        setProperties(fetchedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Could not load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, userRole]);

  if (!token || userRole !== 'Student') return null;

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6 flex items-center gap-2">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a1a2e] flex items-center gap-2">
          Recommended for you
        </h2>
        <Link href="/properties" className="text-[#0071c2] hover:text-[#005999] text-sm font-medium transition-colors">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map(property => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#0071c2]/50 transition-all cursor-pointer group shadow-sm">
              {/* Image */}
              <div className="relative h-44 bg-gray-200 overflow-hidden">
                <SafeImage
                  src={property.images?.length > 0 ? getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url) : null}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                {property.mlInsights?.dealRating === 'Excellent' && (
                  <div className="absolute top-2 left-2 bg-[#008009]/90 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    🔥 Best Deal
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[#1a1a2e] font-semibold truncate mb-1">{property.title}</h3>
                <p className="text-xs text-gray-600 mb-2 truncate">📍 {property.location.address}</p>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-[#0071c2]">{property.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">EGP</span></p>
                  <span className="text-xs text-gray-600">
                    {property.availability?.availableSlots || 0} slots left
                  </span>
                </div>

                {/* Rating */}
                {property.rating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(property.rating) ? 'text-yellow-400 text-xs' : 'text-gray-300 text-xs'}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({property.reviewCount})</span>
                  </div>
                )}

                {/* Landlord */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#0071c2] flex items-center justify-center text-white text-[10px] font-bold">
                    {property.landlord.fullName.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-600">{property.landlord.fullName}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
