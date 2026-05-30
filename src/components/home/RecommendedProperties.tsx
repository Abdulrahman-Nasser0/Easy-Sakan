'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecommendedProperties } from '@/lib/api';
import { Property } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

interface RecommendedPropertiesProps {
  token: string;
}

export default function RecommendedProperties({ token }: RecommendedPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getRecommendedProperties(token, 1, 4, 'views');
        if (response.isSuccess && response.data?.items) {
          setProperties(response.data.items);
        } else {
          // Fallback silently
          console.log('No recommended properties available');
        }
      } catch (err) {
        console.error('Error fetching recommended properties:', err);
        setError('Could not load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [token]);

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">🔥 Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                <div className="h-6 bg-slate-700 rounded w-1/3"></div>
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
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔥 Recommended For You
        </h2>
        <Link href="/properties" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map(property => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
              {/* Image */}
              <div className="relative h-44 bg-slate-700 overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={getImageUrl(typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url)}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">📸</div>
                )}
                {property.mlInsights?.dealRating === 'Excellent' && (
                  <div className="absolute top-2 left-2 bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    🔥 Best Deal
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold truncate mb-1">{property.title}</h3>
                <p className="text-xs text-slate-400 mb-2 truncate">📍 {property.location.address}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-blue-400">{property.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">EGP</span></p>
                  <span className="text-xs text-slate-400">
                    {property.availability?.availableSlots || 0} slots left
                  </span>
                </div>

                {/* Rating */}
                {property.rating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(property.rating) ? 'text-yellow-400 text-xs' : 'text-slate-600 text-xs'}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">({property.reviewCount})</span>
                  </div>
                )}

                {/* Landlord */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {property.landlord.fullName.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-400">{property.landlord.fullName}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
