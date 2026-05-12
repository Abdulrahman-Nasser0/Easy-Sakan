'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateProperty, getPropertyById, uploadPropertyImages, deletePropertyImage } from '@/lib/api-client';

interface EditPropertyProps {
  token: string;
  propertyId: number;
}

export default function EditPropertyForm({ token, propertyId }: EditPropertyProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    areaSqm: '',
    address: '',
    city: '',
    totalCapacity: '',
    bedrooms: '',
    bathrooms: '',
    listingMode: 'Bed',
    gender: 'Any',
    amenities: [] as string[],
  });

  useEffect(() => {
    async function loadProperty() {
      try {
        const response = await getPropertyById(propertyId);
        if (response.isSuccess && response.data) {
          const p = response.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            price: p.price?.toString() || '',
            areaSqm: p.areaSqm?.toString() || '',
            address: p.location?.address || '',
            city: p.location?.nearestUniversity || '',
            totalCapacity: p.totalCapacity?.toString() || '',
            bedrooms: p.bedrooms?.toString() || '',
            bathrooms: p.bathrooms?.toString() || '',
            listingMode: p.listingMode || 'Bed',
            gender: p.gender || 'Any',
            amenities: p.amenities || [],
          });
          setExistingImages(p.images || []);
        } else {
          setError(response.message || 'Failed to load property');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading property');
      } finally {
        setInitialLoading(false);
      }
    }
    if(propertyId) loadProperty();
  }, [propertyId]);

  const amenitiesList = ['WiFi', 'AC', 'Elevator', 'Security', 'Parking', 'Balcony', 'Kitchen', 'Furnished'];

  const required = ['title', 'description', 'price', 'areaSqm', 'address', 'city', 'totalCapacity'];
  
  const isFieldEmpty = (field: string) => {
    const value = form[field as keyof typeof form];
    return !value || (typeof value === 'string' && !value.trim());
  };

  const showError = (field: string) => touched[field] && isFieldEmpty(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Mark all fields as touched
    const allTouched = required.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Check required fields
    for (const field of required) {
      if (isFieldEmpty(field)) {
        setError(`Please fill in all required fields`);
        return;
      }
    }

    // Validate numbers
    const price = parseFloat(form.price);
    const capacity = parseInt(form.totalCapacity);
    const area = parseFloat(form.areaSqm);
    
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number');
      return;
    }

    if (isNaN(area) || area <= 0) {
      setError('Area (sqm) must be a positive number');
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      setError('Total capacity must be at least 1');
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        listingMode: form.listingMode,
        price: price,
        areaSqm: area,
        totalCapacity: capacity,
        gender: form.gender,
        location: {
          address: form.address.trim(),
          lat: 30.0444,
          lng: 31.2357,
          nearestUniversity: form.city.trim(),
        },
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : 0,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : 1,
        amenities: form.amenities,
      };

      console.log('📦 Updating property:', propertyData);

      const response = await updateProperty(propertyId, propertyData);

      console.log('✅ Response:', response);

      if (response.isSuccess) {
        let imageUploadFailed = false;
        
        // If we have a successful property update and images are attached
        if (images.length > 0) {
          setSuccess('Property basic info updated. Uploading images...');
          // First, upload new images
          const imageResponse = await uploadPropertyImages(propertyId, images, 0);
          
          if (!imageResponse.isSuccess) {
            imageUploadFailed = true;
            setError(imageResponse.message || 'Property updated, but failed to upload new images.');
          }
        }

        // Handle deletion of removed images
        for (const img of existingImages) {
          if (!images.find(i => i.name === img.name)) {
            const deleteResponse = await deletePropertyImage(propertyId, img.id);
            if (!deleteResponse.isSuccess) {
              setError(deleteResponse.message || 'Failed to delete removed images.');
              imageUploadFailed = true;
            }
          }
        }

        if (!imageUploadFailed) {
          setSuccess('Property updated successfully! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard/landlord/my-listings');
          }, 1500);
        }
        
      } else {
        const errorObj = response.errors?.[0];
        const errorMsg = typeof errorObj === 'object' && errorObj ? 
          (errorObj as any).message : 
          response.message || 'Failed to update property';
        setError(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/dashboard/landlord" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Property</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                placeholder="Property title"
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  showError('title') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                placeholder="Describe the property"
                rows={3}
                className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  showError('description') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Price and Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Price (EGP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  onBlur={() => handleBlur('price')}
                  placeholder="e.g., 5000"
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    showError('price') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Area (sqm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="areaSqm"
                  value={form.areaSqm}
                  onChange={handleChange}
                  onBlur={() => handleBlur('areaSqm')}
                  placeholder="e.g., 120"
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    showError('areaSqm') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* City and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur('city')}
                  placeholder="e.g., Cairo"
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    showError('city') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  placeholder="Full address"
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    showError('address') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Total Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Total Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={form.totalCapacity}
                  onChange={handleChange}
                  onBlur={() => handleBlur('totalCapacity')}
                  placeholder="e.g., 3"
                  min="1"
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    showError('totalCapacity') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Listing Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Listing Mode</label>
                <select
                  name="listingMode"
                  value={form.listingMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Bed">Single Bed</option>
                  <option value="EntireUnit">Entire Unit</option>
                </select>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Gender Preference</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Property Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {images.length} image(s) selected
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
              >
                {loading ? 'Updating...' : 'Update Property'}
              </button>
              <Link href="/dashboard/landlord" className="flex-1">
                <button type="button" className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded text-sm transition-colors">
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
