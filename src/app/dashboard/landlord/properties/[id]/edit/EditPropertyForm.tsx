'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateProperty, uploadPropertyImages, deletePropertyImage, predictPrice } from '@/lib/api';
import { landlordStyles } from '@/styles/landlordStyles';

interface EditPropertyProps {
  token: string;
  propertyId: number;
  initialData?: any;
  initialError?: string | null;
}

export default function EditPropertyForm({ token, propertyId, initialData, initialError }: EditPropertyProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingImages, setExistingImages] = useState<any[]>(initialData?.images || []);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [predictedPrice, setPredictedPrice] = useState<{
    predictedFairPrice: number;
    dealRating: string;
    priceDifferencePercentage: number;
  } | null>(null);
  const [predictingPrice, setPredictingPrice] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    areaSqm: initialData?.areaSqm?.toString() || '',
    address: initialData?.location?.address || '',
    city: initialData?.location?.nearestUniversity || '',
    totalCapacity: initialData?.availability?.totalCapacity?.toString() || initialData?.totalCapacity?.toString() || '',
    bedrooms: initialData?.bedrooms?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    listingMode: initialData?.listingMode || 'Bed',
    gender: initialData?.gender || 'Any',
    amenities: initialData?.amenities || [],
  });

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
        ? prev.amenities.filter((a:any) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processImages(e.target.files);
    }
  };

  // Handle image selection with validation
  const processImages = (files: FileList | null) => {
    if (!files) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_IMAGES = 10;

    const newFiles: File[] = [];
    let errorMsg = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errorMsg = `${file.name} exceeds 5MB limit`;
        break;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorMsg = `${file.name} is not a supported image format (JPG, PNG, WebP only)`;
        break;
      }

      newFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }

    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (images.length + newFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed (including existing)`);
      return;
    }

    setImages([...images, ...newFiles]);
    setError('');
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processImages(e.dataTransfer.files);
  };

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (primaryImageIndex >= images.length - 1) {
      setPrimaryImageIndex(Math.max(0, images.length - 2));
    }
  };

  const removeExistingImage = (imageId: number) => {
    // Mark the image for deletion on submit instead of deleting immediately
    setDeletedImageIds(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
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
        let imageOperationFailed = false;

        // 1. Delete images that were marked for removal
        for (const imageId of deletedImageIds) {
          const deleteResponse = await deletePropertyImage(token, propertyId, imageId);
          if (!deleteResponse.isSuccess) {
            imageOperationFailed = true;
            setError(`Warning: Failed to delete image #${imageId}: ${deleteResponse.message}`);
          }
        }

        // 2. Upload new images if any
        if (images.length > 0) {
          setSuccess('Property info updated. Uploading new images...');
          const imageResponse = await uploadPropertyImages(token, propertyId, images, primaryImageIndex);
          
          if (!imageResponse.isSuccess) {
            imageOperationFailed = true;
            setError(imageResponse.message || 'Property updated, but failed to upload new images.');
          }
        }

        if (!imageOperationFailed) {
          setSuccess('Property updated successfully! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard/landlord/my-listings');
          }, 1500);
        } else if (!error) {
          setSuccess('Property updated (with some image operation warnings). Redirecting...');
          setTimeout(() => {
            router.push('/dashboard/landlord/my-listings');
          }, 2000);
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
      <div className="bg-linear-to-r from-emerald-900 via-slate-800 to-slate-900 border-b border-slate-700">
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
                  <button
                    type="button"
                    onClick={async () => {
                      const price = parseFloat(form.price);
                      const area = parseFloat(form.areaSqm);
                      const bedrooms = parseInt(form.bedrooms || '0');
                      const bathrooms = parseInt(form.bathrooms || '1');
                      
                      if (!form.city || !area || !price) {
                        setError('Please fill in city, area, and price first');
                        return;
                      }
                      
                      setPredictingPrice(true);
                      setError('');
                      try {
                        const response = await predictPrice(token, {
                          location: form.city,
                          bedrooms,
                          bathrooms,
                          areaSqm: area,
                          listingMode: form.listingMode,
                          amenities: form.amenities,
                        });
                        if (response.isSuccess) {
                          setPredictedPrice(response.data);
                        } else {
                          setError(response.message || 'Price prediction unavailable');
                        }
                      } catch {
                        setError('Failed to get price prediction');
                      } finally {
                        setPredictingPrice(false);
                      }
                    }}
                    disabled={predictingPrice || !form.city || !form.areaSqm}
                    className="mt-2 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {predictingPrice ? '⏳ Analyzing...' : '🧠 Predict Fair Price'}
                  </button>

                  {/* Predicted Price Display */}
                  {predictedPrice && (
                    <div className={`mt-2 p-2 rounded-lg text-xs ${
                      predictedPrice.dealRating === 'Excellent' ? 'bg-emerald-900/30 border border-emerald-600/30' :
                      predictedPrice.dealRating === 'Good' ? 'bg-blue-900/30 border border-blue-600/30' :
                      'bg-yellow-900/30 border border-yellow-600/30'
                    }`}>
                      <p className={`font-bold ${
                        predictedPrice.dealRating === 'Excellent' ? 'text-emerald-300' :
                        predictedPrice.dealRating === 'Good' ? 'text-blue-300' :
                        'text-yellow-300'
                      }`}>
                        💰 Fair Price: {predictedPrice.predictedFairPrice.toLocaleString()} EGP
                      </p>
                      <p className="text-slate-300 mt-1">
                        {predictedPrice.dealRating} Deal
                        {' · '}
                        {predictedPrice.priceDifferencePercentage > 0 ? '📈 +' : '📉 '}
                        {Math.abs(predictedPrice.priceDifferencePercentage)}% vs market
                      </p>
                    </div>
                  )}
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
                    <label
                      key={amenity}
                      className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-600/50 rounded-lg cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 rounded border-slate-500 bg-slate-900 text-emerald-600 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm text-slate-200 font-medium">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className={landlordStyles.formGroup}>
                  <label className={landlordStyles.inputLabel}>🖼️ Current Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {existingImages.map((img, idx) => (
                      <div key={img.id} className="relative group">
                        <div className="relative h-24 rounded-lg overflow-hidden border-2 border-emerald-600">
                          <img
                            src={img.url}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <span className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium">
                            ✕ Remove
                          </span>
                        </button>
                        <p className="text-xs text-slate-500 mt-1 text-center">Existing</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className={landlordStyles.formGroup}>
                <label className={landlordStyles.inputLabel}>📸 Add More Images (Up to 10 total)</label>
                <p className="text-xs text-slate-400 mb-3">Max 5MB each, JPG/PNG/WebP format.</p>
                
                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-slate-600 bg-slate-800/30 hover:border-emerald-400'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <p className="text-3xl mb-2">🖼️</p>
                    <p className="text-white font-medium">Drag and drop images here</p>
                    <p className="text-slate-400 text-sm mt-1">or click to select files</p>
                  </div>
                </div>

                {/* New Image Previews */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-emerald-400 font-medium">✅ {images.length} new image(s) selected</p>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="text-xs text-slate-400">
                          Uploading: {uploadProgress}%
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <div className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                            primaryImageIndex === idx
                              ? 'border-emerald-500'
                              : 'border-slate-600 hover:border-emerald-400'
                          }`}>
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Primary badge */}
                            {primaryImageIndex === idx && (
                              <div className="absolute top-1 left-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                Main
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            {primaryImageIndex !== idx && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImageIndex(idx)}
                                title="Set as main image"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs font-medium"
                              >
                                ⭐ Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeNewImage(idx)}
                              title="Remove image"
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium"
                            >
                              ✕ Remove
                            </button>
                          </div>

                          {/* Index */}
                          <p className="text-xs text-slate-500 mt-1 text-center">New {idx + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
      </div>
    </div>
  );
}
