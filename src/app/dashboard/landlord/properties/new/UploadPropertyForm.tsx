'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createProperty, uploadPropertyImages } from '@/lib/api';

interface UploadPropertyProps {
  token: string;
}

export default function UploadProperty({ token }: UploadPropertyProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Apartment',
    bedrooms: '1',
    bathrooms: '1',
    price: '',
    address: '',
    city: '',
    areaSqm: '',
    listingMode: 'Bed',
    gender: 'Any',
    totalCapacity: '1',
    lat: '',
    lng: '',
    amenities: [] as string[],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const amenitiesList = ['WiFi', 'AC', 'Elevator', 'Security', 'Parking', 'Balcony', 'Kitchen', 'Furnished'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Token received:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
      
      if (!token) {
        setError('Authentication failed. Please login again.');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.title?.trim()) {
        setError('Property title is required.');
        setLoading(false);
        return;
      }

      if (!formData.description?.trim()) {
        setError('Property description is required.');
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Price must be a valid positive number.');
        setLoading(false);
        return;
      }

      if (!formData.address?.trim()) {
        setError('Full address is required.');
        setLoading(false);
        return;
      }

      if (!formData.city?.trim()) {
        setError('City is required.');
        setLoading(false);
        return;
      }

      if (!formData.totalCapacity || parseInt(formData.totalCapacity) <= 0) {
        setError('Total capacity must be at least 1.');
        setLoading(false);
        return;
      }

      if (files.length === 0) {
        setError('Please upload at least one property image.');
        setLoading(false);
        return;
      }

      // Validate numeric fields
      const price = parseFloat(formData.price);
      const totalCapacity = parseInt(formData.totalCapacity);
      const bedrooms = parseInt(formData.bedrooms) || 0;
      const bathrooms = parseInt(formData.bathrooms) || 1;
      const areaSqm = formData.areaSqm ? parseFloat(formData.areaSqm) : 0;

      if (isNaN(price) || price <= 0) {
        setError('Price must be a valid positive number.');
        setLoading(false);
        return;
      }

      if (isNaN(totalCapacity) || totalCapacity <= 0) {
        setError('Total capacity must be a valid positive number.');
        setLoading(false);
        return;
      }

      // Create property request
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        listingMode: formData.listingMode,
        price: price,
        totalCapacity: totalCapacity,
        gender: formData.gender,
        location: {
          address: formData.address.trim(),
          lat: formData.lat ? parseFloat(formData.lat) : 30.0444,
          lng: formData.lng ? parseFloat(formData.lng) : 31.2357,
          nearestUniversity: formData.city.trim(),
        },
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        areaSqm: areaSqm,
        amenities: formData.amenities,
        imageUrls: [], // Will be added after property creation
      };

      console.log('Submitting property data:', propertyData);

      // Create property with images
      const createResponse = await createProperty(token, propertyData, files);

      console.log('Create response:', createResponse);

      if (!createResponse.isSuccess) {
        let errorMessage = createResponse.message || 'Failed to create property';
        
        // Handle token invalid error
        if (createResponse.statusCode === 401 && 
            createResponse.errors?.some((err: any) => 
              err.message?.includes('Invalid token') || 
              err.message?.includes('credentials')
            )) {
          errorMessage = 'Your session has expired. Please log out and log back in to continue.';
        }
        
        // Handle error details from backend
        if (createResponse.errors && createResponse.errors.length > 0 && createResponse.statusCode !== 401) {
          const errorDetails = createResponse.errors
            .map(err => {
              // If error is an object, try to get the message property
              if (typeof err === 'object' && err !== null) {
                return (err as any).message || JSON.stringify(err);
              }
              return String(err);
            })
            .filter(msg => msg && msg.trim())
            .join(', ');
          
          if (errorDetails) {
            errorMessage = errorMessage + ': ' + errorDetails;
          }
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      setSuccess('Property uploaded successfully! It will appear once approved by admin.');

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'Apartment',
        bedrooms: '1',
        bathrooms: '1',
        price: '',
        address: '',
        city: '',
        areaSqm: '',
        listingMode: 'Bed',
        gender: 'Any',
        totalCapacity: '1',
        lat: '',
        lng: '',
        amenities: [],
      });
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard/landlord" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Upload Property</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Luxury 3-Bedroom Apartment"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Mode *</label>
                <select
                  name="listingMode"
                  value={formData.listingMode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bed">Single Bed</option>
                  <option value="EntireUnit">Entire Unit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Cairo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Capacity *</label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area (m²)</label>
                <input
                  type="number"
                  name="areaSqm"
                  value={formData.areaSqm}
                  onChange={handleInputChange}
                  placeholder="e.g., 75"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price/Month (EGP) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Nile Street, Zamalek"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Images * (Max 10)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-gray-600">Drag and drop images here or click to select</p>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP up to 5MB each</p>
                </label>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{files.length} file(s) selected</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Array.from(files).map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
              <Link href="/dashboard/landlord" className="flex-1">
                <button type="button" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
