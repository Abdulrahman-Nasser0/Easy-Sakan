'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProperty, uploadPropertyImages } from '@/lib/api';
import { landlordStyles } from '@/styles/landlordStyles';

interface UploadPropertyProps {
  token: string;
}

export default function UploadProperty({ token }: UploadPropertyProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

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

  // Handle image selection with validation
  const processImages = (files: FileList | null) => {
    if (!files) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_IMAGES = 10;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
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
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setImages([...images, ...newFiles]);
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processImages(e.target.files);
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

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (primaryImageIndex >= images.length - 1) {
      setPrimaryImageIndex(Math.max(0, images.length - 2));
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

      console.log('📦 Creating property:', propertyData);

      const response = await createProperty(token, propertyData);

      console.log('✅ Response:', response);

      if (response.isSuccess) {
        let imageUploadFailed = false;
        
        // If we have a successful property creation and images are attached
        if (images.length > 0 && response.data?.id) {
          setSuccess('Property basic info created. Uploading images...');
          setUploadProgress(0);
          
          const imageResponse = await uploadPropertyImages(token, response.data.id, images, primaryImageIndex);
          
          if (!imageResponse.isSuccess) {
            imageUploadFailed = true;
            setError(imageResponse.message || 'Property created, but failed to upload images.');
          } else {
            setUploadProgress(100);
          }
        }

        if (!imageUploadFailed) {
          setSuccess('Property created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard/landlord/my-listings');
          }, 1500);
        }
        
      } else {
        const errorObj = response.errors?.[0];
        const errorMsg = typeof errorObj === 'object' && errorObj ? 
          (errorObj as any).message : 
          response.message || 'Failed to create property';
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
          <h1 className="text-3xl font-bold text-white">🏠 Upload New Property</h1>
          <p className="text-slate-400 mt-1">Add a new property to your listings</p>
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

            {/* Images */}
            <div className={landlordStyles.formGroup}>
              <label className={landlordStyles.inputLabel}>📸 Property Images (Up to 10)</label>
              <p className="text-xs text-slate-400 mb-3">Max 5MB each, JPG/PNG/WebP format. First image will be the main photo.</p>
              
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

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-emerald-400 font-medium">✅ {images.length} image(s) selected</p>
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
                            onClick={() => removeImage(idx)}
                            title="Remove image"
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium"
                          >
                            ✕ Remove
                          </button>
                        </div>

                        {/* Index */}
                        <p className="text-xs text-slate-500 mt-1 text-center">Image {idx + 1}</p>
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
                {loading ? '⏳ Creating...' : '✨ Create Property'}
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
