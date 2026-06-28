'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProperty, uploadPropertyImages, deletePropertyImage } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface Props {
  token: string;
  propertyId: number;
  initialData: any;
  initialError: string | null;
}

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

export default function EditPropertyForm({ token, propertyId, initialData, initialError }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    currency: initialData?.currency || 'EGP',
    address: initialData?.location?.address || '',
    lat: initialData?.location?.lat?.toString() || '',
    lng: initialData?.location?.lng?.toString() || '',
    university: initialData?.university || '',
    selectedGender: initialData?.gender || 'Any',
    listingMode: initialData?.listingMode || 'Bed',
    bedrooms: initialData?.bedrooms?.toString() || '1',
    bathrooms: initialData?.bathrooms?.toString() || '1',
    areaSqm: initialData?.areaSqm?.toString() || '',
    totalCapacity: initialData?.availability?.totalCapacity?.toString() || '1',
    amenities: initialData?.amenities || [],
    existingImages: initialData?.images || [],
    newImages: [] as File[],
    newImagePreviews: [] as string[],
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleAmenity = (amenity: string) => {
    update('amenities', form.amenities.includes(amenity)
      ? form.amenities.filter((a: string) => a !== amenity)
      : [...form.amenities, amenity]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    update('newImages', [...form.newImages, ...files]);
    update('newImagePreviews', [...form.newImagePreviews, ...newPreviews]);
  };

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(form.newImagePreviews[idx]);
    const imgs = [...form.newImages]; imgs.splice(idx, 1);
    const prevs = [...form.newImagePreviews]; prevs.splice(idx, 1);
    update('newImages', imgs);
    update('newImagePreviews', prevs);
  };

  const removeExistingImage = async (imgIdx: number) => {
    const img = form.existingImages[imgIdx];
    const imageId = typeof img === 'string' ? null : (img as any)?.id;
    if (imageId) {
      try {
        const response = await deletePropertyImage(token, propertyId, imageId);
        if (!response.isSuccess) { setError(response.message || 'Failed to delete image'); return; }
      } catch { setError('Failed to delete image'); return; }
    }
    const updated = [...form.existingImages]; updated.splice(imgIdx, 1);
    update('existingImages', updated);
  };

  useEffect(() => {
    return () => form.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, []);

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || Number(form.price) <= 0) return 'Valid price is required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.lat || !form.lng) return 'Location coordinates are required';
    if (!form.totalCapacity || Number(form.totalCapacity) < 1) return 'Valid total capacity is required';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true); setError('');

    try {
      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        currency: form.currency,
        location: { address: form.address.trim(), lat: Number(form.lat), lng: Number(form.lng) },
        university: form.university.trim() || undefined,
        gender: form.selectedGender,
        listingMode: form.listingMode,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqm: form.areaSqm ? Number(form.areaSqm) : undefined,
        amenities: form.amenities,
        availability: { totalCapacity: Number(form.totalCapacity) },
      };

      const response = await updateProperty(token, propertyId, propertyData);
      if (!response.isSuccess) { setError(response.message || 'Failed to update property'); setLoading(false); return; }

      if (form.newImages.length > 0) {
        setSuccess('Property updated! Uploading new images...');
        const uploadPromises = form.newImages.map(file =>
          null // files uploaded via uploadPropertyImages below
        );
        await uploadPropertyImages(token, propertyId, form.newImages).catch(() => null);
      }

      setSuccess('Property updated successfully!');
      setTimeout(() => router.push('/dashboard/landlord/my-listings'), 1500);
    } catch {
      setError('An unexpected error occurred');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Edit Property</h1>
          <p className="text-gray-500 text-sm mt-1">Update your property details</p>
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
                <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} className={`${inputClass} min-h-[100px]`} rows={4} />
              </div>
              <div>
                <label className={labelClass}>Price</label>
                <div className="flex gap-2">
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)} className={inputClass} min="0" />
                  <select value={form.currency} onChange={e => update('currency', e.target.value)} className={`${selectClass} w-24`}>
                    <option value="EGP">EGP</option><option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Listing Mode</label>
                <select value={form.listingMode} onChange={e => update('listingMode', e.target.value)} className={selectClass}>
                  <option value="Bed">Single Bed</option><option value="EntireUnit">Entire Unit</option>
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
                <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className={inputClass} />
              </div>
              <div><label className={labelClass}>Latitude</label><input type="number" step="any" value={form.lat} onChange={e => update('lat', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Longitude</label><input type="number" step="any" value={form.lng} onChange={e => update('lng', e.target.value)} className={inputClass} /></div>
              <div>
                <label className={labelClass}>University/Area</label>
                <select value={form.university} onChange={e => update('university', e.target.value)} className={selectClass}>
                  <option value="">Select a university</option>
                  <option>Assiut University</option>
                  <option>Cairo University</option>
                  <option>AUC</option>
                  <option>Ain Shams University</option>
                  <option>GUC</option>
                  <option>Helwan University</option>
                  <option>Alexandria University</option>
                  <option>Mansoura University</option>
                  <option>Tanta University</option>
                  <option>Zagazig University</option>
                  <option>Minia University</option>
                  <option>Benha University</option>
                  <option>Fayoum University</option>
                  <option>Suez Canal University</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Gender Preference</label>
                <select value={form.selectedGender} onChange={e => update('selectedGender', e.target.value)} className={selectClass}>
                  <option value="Any">Any</option><option value="Male">Male Only</option><option value="Female">Female Only</option>
                </select>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={labelClass}>Bedrooms</label><input type="number" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className={inputClass} min="0" /></div>
              <div><label className={labelClass}>Bathrooms</label><input type="number" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className={inputClass} min="0" /></div>
              <div><label className={labelClass}>Area (sqm)</label><input type="number" value={form.areaSqm} onChange={e => update('areaSqm', e.target.value)} className={inputClass} placeholder="Optional" /></div>
              <div><label className={labelClass}>Total Capacity</label><input type="number" value={form.totalCapacity} onChange={e => update('totalCapacity', e.target.value)} className={inputClass} min="1" /></div>
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

            {form.existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-3">Current Images</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.existingImages.map((img: any, idx: number) => {
                    const src = getImageUrl(typeof img === 'string' ? img : img.url);
                    return (
                      <div key={idx} className="relative group">
                        <img src={src} alt="" className="w-full h-32 object-cover rounded-md border border-gray-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <button type="button" onClick={() => removeExistingImage(idx)}
                            className="bg-[#cc0000] hover:bg-[#aa0000] text-white px-2 py-1 rounded text-xs font-medium">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" id="imageInput" />
              <label htmlFor="imageInput" className="cursor-pointer">
                <p className="text-[#1a1a2e] font-medium">Add more images</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse (max 10MB each)</p>
              </label>
            </div>

            {form.newImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {form.newImagePreviews.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="" className="w-full h-32 object-cover rounded-md border border-gray-200" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <button type="button" onClick={() => removeNewImage(idx)}
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
            <button type="submit" disabled={loading}
              className="bg-[#0071c2] hover:bg-[#005999] disabled:opacity-50 text-white px-6 py-2.5 rounded-md font-medium transition-all text-sm">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
