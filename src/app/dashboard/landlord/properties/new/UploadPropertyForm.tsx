'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty, uploadPropertyImages } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface Props { token: string; }

const inputClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm';
const selectClass = 'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-[#1a1a2e] focus:outline-none focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20 transition-colors text-sm appearance-none cursor-pointer';
const labelClass = 'block text-sm font-medium text-gray-600 mb-1.5';
const errorClass = 'bg-[#fff0f0] border border-[#f5c6c6] text-[#cc0000] rounded-md p-4 text-sm mt-4';

const AMENITIES_OPTIONS = [
  'WiFi', 'AC', 'Furnished', 'Parking', 'Laundry', 'Kitchen', 'Balcony',
  'Security', 'Elevator', 'Pet Friendly', 'Pool', 'Gym', 'Study Room',
  'Bike Storage', 'Heating', 'TV', 'Microwave', 'Fridge', 'Washing Machine',
  'Water Heater', 'Cleaning Service', 'Meals Included',
];

export default function UploadPropertyForm({ token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userIsVerified = user.isVerified === true || (user as any).is_verified === true || (user as any).verification_status === 'VERIFIED';
      if (user.role?.toUpperCase() === 'LANDLORD' && !userIsVerified) {
        alert("عفواً، يجب توثيق الحساب ورفع المستندات أولاً قبل إضافة إعلانات.");
        router.push('/upload-documents');
      } else if (!userIsVerified) {
        router.push('/upload-documents');
      }
    }
  }, [user, router]);

  const [form, setForm] = useState({
    title: '', description: '', price: '', currency: 'EGP',
    address: '', lat: '', lng: '', university: '',
    selectedGender: 'Any',
    listingMode: 'Bed',
    bedrooms: '1', bathrooms: '1', areaSqm: '',
    totalCapacity: '1',
    amenities: [] as string[],
    images: [] as File[],
    imagePreviewUrls: [] as string[],
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleAmenity = (amenity: string) => {
    update('amenities', form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    update('images', [...form.images, ...validFiles]);
    update('imagePreviewUrls', [...form.imagePreviewUrls, ...newPreviews]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(form.imagePreviewUrls[idx]);
    const newImages = [...form.images]; newImages.splice(idx, 1);
    const newPreviews = [...form.imagePreviewUrls]; newPreviews.splice(idx, 1);
    update('images', newImages);
    update('imagePreviewUrls', newPreviews);
  };

  useEffect(() => {
    return () => form.imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
  }, []);

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || Number(form.price) <= 0) return 'Valid price is required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.university.trim()) return 'University/Area is required';
    if (!form.lat || !form.lng) return 'Location coordinates are required';
    if (!form.totalCapacity || Number(form.totalCapacity) < 1) return 'Valid total capacity is required';
    if (form.images.length === 0) return 'At least one image is required';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        currency: form.currency,
        location: {
          address: form.address.trim(),
          lat: Number(form.lat),
          lng: Number(form.lng),
          nearest_university: form.university.trim(),
        },
        gender: form.selectedGender,
        listingMode: form.listingMode,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqm: form.areaSqm ? Number(form.areaSqm) : 0,
        amenities: form.amenities,
        totalCapacity: Number(form.totalCapacity),
      };

      console.log('🚀 Sending property data:', JSON.stringify(propertyData, null, 2));

      const response = await createProperty(token, propertyData);
      console.log('📦 Create response:', JSON.stringify(response, null, 2));

      if (!response.isSuccess) {
        const formattedErrors = response.errors 
          ? response.errors.map((e: any) => typeof e === 'object' ? (e.message || e.msg || JSON.stringify(e)) : e).join(' | ') 
          : response.message;
        setError(formattedErrors || response.message || 'Failed to create property. Please check required fields.');
        setLoading(false);
        return;
      }

      const propertyId = response.data?.id || response.data?.data?.id;
      console.log('✅ Property ID:', propertyId);
      if (!propertyId) {
        setError('Failed to get property ID');
        setLoading(false);
        return;
      }

      setSuccess('Property created! Uploading images...');
      setUploadProgress(true);

      await uploadPropertyImages(token, propertyId, form.images).catch(() => null);

      setUploadProgress(false);
      setSuccess('Property created and images uploaded!');
      setTimeout(() => router.push('/dashboard/landlord/my-listings'), 1500);
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Upload New Property</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to list your property</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Title</label>
                <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className={inputClass} placeholder="e.g., Cozy Studio Near University" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} className={`${inputClass} min-h-[100px]`} rows={4} placeholder="Describe your property..." />
              </div>
              <div>
                <label className={labelClass}>Price</label>
                <div className="flex gap-2">
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)} className={inputClass} placeholder="0" min="0" />
                  <select value={form.currency} onChange={e => update('currency', e.target.value)} className={`${selectClass} w-24`}>
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Listing Mode</label>
                <select value={form.listingMode} onChange={e => update('listingMode', e.target.value)} className={selectClass}>
                  <option value="Bed">Single Bed</option>
                  <option value="EntireUnit">Entire Unit</option>
                </select>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputClass} placeholder="Full address" />
              </div>
              <div>
                <label className={labelClass}>Latitude</label>
                <input type="number" step="any" value={form.lat} onChange={e => update('lat', e.target.value)} className={inputClass} placeholder="e.g., 30.0444" />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input type="number" step="any" value={form.lng} onChange={e => update('lng', e.target.value)} className={inputClass} placeholder="e.g., 31.2357" />
              </div>
              <div className="md:col-span-1">
                <label className={labelClass}>University/Area <span className="text-[#cc0000]">*</span></label>
                <input required type="text" value={form.university} onChange={e => update('university', e.target.value)} className={inputClass} placeholder="Nearby university" />
              </div>
              <div>
                <label className={labelClass}>Gender Preference</label>
                <select value={form.selectedGender} onChange={e => update('selectedGender', e.target.value)} className={selectClass}>
                  <option value="Any">Any</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <input type="number" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className={inputClass} min="0" />
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <input type="number" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className={inputClass} min="0" />
              </div>
              <div>
                <label className={labelClass}>Area (sqm)</label>
                <input type="number" value={form.areaSqm} onChange={e => update('areaSqm', e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Total Capacity</label>
                <input type="number" value={form.totalCapacity} onChange={e => update('totalCapacity', e.target.value)} className={inputClass} min="1" />
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {AMENITIES_OPTIONS.map(amenity => (
                <label key={amenity} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
                  form.amenities.includes(amenity) ? 'border-[#0071c2] bg-[#ebf3ff]' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 accent-[#0071c2] cursor-pointer" />
                  <span className="text-sm text-[#1a1a2e]">{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Images</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" multiple onChange={handleImageSelect}
                className="hidden" id="imageInput" />
              <label htmlFor="imageInput" className="cursor-pointer">
                <p className="text-[#1a1a2e] font-medium">Drag and drop images here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse (max 10MB each)</p>
                <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP supported</p>
              </label>
            </div>
            {form.imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {form.imagePreviewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-md border border-gray-200" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(idx)}
                        className="bg-[#cc0000] hover:bg-[#aa0000] text-white px-2 py-1 rounded text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <div className={errorClass}>{error}</div>}
          {success && <div className="bg-[#ebf7eb] border border-[#c3e6c3] text-[#008009] rounded-md p-4 text-sm">{success}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()}
              className="border border-gray-200 text-gray-600 hover:border-gray-300 px-6 py-2.5 rounded-md font-medium transition-all bg-white text-sm">Cancel</button>
            <button type="submit" disabled={loading || uploadProgress}
              className="bg-[#0071c2] hover:bg-[#005999] disabled:opacity-50 text-white px-6 py-2.5 rounded-md font-medium transition-all text-sm">
              {loading && !uploadProgress ? 'Creating...' : uploadProgress ? 'Uploading images...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
