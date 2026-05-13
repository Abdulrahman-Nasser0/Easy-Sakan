'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateProperty, getPropertyById, uploadPropertyImages, deletePropertyImage } from '@/lib/api';
import { landlordStyles } from '@/styles/landlordStyles';

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

      const response = await updateProperty(token, propertyId, propertyData);

      console.log('✅ Response:', response);

      if (response.isSuccess) {
        let imageUploadFailed = false;
        
        // If we have a successful property update and images are attached
        if (images.length > 0) {
          setSuccess('Property basic info updated. Uploading images...');
          // First, upload new images
          const imageResponse = await uploadPropertyImages(token, propertyId, images, 0);
          
          if (!imageResponse.isSuccess) {
            imageUploadFailed = true;
            setError(imageResponse.message || 'Property updated, but failed to upload new images.');
          }
        }

        // Handle deletion of removed images
        for (const img of existingImages) {
          if (!images.find(i => i.name === img.name)) {
            const deleteResponse = await deletePropertyImage(token, propertyId, img.id);
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
    <div className={landlordStyles.pageContainer}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-linear-to-r from-emerald-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link href="/dashboard/landlord" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-3 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">✏️ Edit Property</h1>
          <p className="text-slate-400 mt-1">Update your property information</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {initialLoading ? (
          <div className="flex justify-center py-12">
            <div className={landlordStyles.loadingSpinner}></div>
          </div>
        ) : (
          <div className={`${landlordStyles.card} rounded-lg border border-slate-700`}>
            {error && (
              <div className={`${landlordStyles.alertError} mb-6`}>
                {error}
              </div>
            )}

            {success && (
              <div className={`${landlordStyles.alertSuccess} mb-6`}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className={landlordStyles.formGroup}>
                <label className={landlordStyles.inputLabel}>
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur('title')}
                  placeholder="Property title"
                  className={`${landlordStyles.input} ${
                    showError('title') ? 'border-red-500/50 focus:border-red-500' : ''
                  }`}
                />
              </div>

              {/* Description */}
              <div className={landlordStyles.formGroup}>
                <label className={landlordStyles.inputLabel}>
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe the property"
                  rows={4}
                  className={`${landlordStyles.textarea} ${
                    showError('description') ? 'border-red-500/50 focus:border-red-500' : ''
                  }`}
                />
              </div>

              {/* Price and Area */}
              <div className="grid grid-cols-2 gap-4">
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>
                    Price (EGP) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    onBlur={() => handleBlur('price')}
                    placeholder="e.g., 5000"
                    className={`${landlordStyles.input} ${
                      showError('price') ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                  />
                </div>

                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>
                    Area (sqm) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="areaSqm"
                    value={form.areaSqm}
                    onChange={handleChange}
                    onBlur={() => handleBlur('areaSqm')}
                    placeholder="e.g., 120"
                    className={`${landlordStyles.input} ${
                      showError('areaSqm') ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                  />
                </div>
              </div>

              {/* City and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={() => handleBlur('city')}
                    placeholder="e.g., Cairo"
                    className={`${landlordStyles.input} ${
                      showError('city') ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                  />
                </div>

                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={() => handleBlur('address')}
                    placeholder="Full address"
                    className={`${landlordStyles.input} ${
                      showError('address') ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Total Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>
                    Total Capacity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalCapacity"
                    value={form.totalCapacity}
                    onChange={handleChange}
                    onBlur={() => handleBlur('totalCapacity')}
                    placeholder="e.g., 3"
                    min="1"
                    className={`${landlordStyles.input} ${
                      showError('totalCapacity') ? 'border-red-500/50 focus:border-red-500' : ''
                    }`}
                  />
                </div>

                {/* Listing Mode */}
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>Listing Mode</label>
                  <select
                    name="listingMode"
                    value={form.listingMode}
                    onChange={handleChange}
                    className={landlordStyles.select}
                  >
                    <option value="Bed">Single Bed</option>
                    <option value="EntireUnit">Entire Unit</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={landlordStyles.input}
                  />
                </div>

                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    placeholder="1"
                    min="0"
                    className={landlordStyles.input}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className={landlordStyles.formGroup}>
                <label className={landlordStyles.inputLabel}>👥 Gender Preference</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={landlordStyles.select}
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Amenities */}
              <div className={landlordStyles.formSection}>
                <label className={`${landlordStyles.inputLabel} mb-4`}>✨ Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className={landlordStyles.checkbox}>
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-emerald-600"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className={landlordStyles.formGroup}>
                <label className={landlordStyles.inputLabel}>📸 Property Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`${landlordStyles.input} cursor-pointer`}
                />
                {images.length > 0 && (
                  <p className="text-emerald-400 text-sm mt-3 font-medium">
                    ✅ {images.length} image(s) selected
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${landlordStyles.btnPrimary} flex-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? '⏳ Updating...' : '✨ Update Property'}
                </button>
                <Link href="/dashboard/landlord" className="flex-1">
                  <button type="button" className={`${landlordStyles.btnSecondary} w-full`}>
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
