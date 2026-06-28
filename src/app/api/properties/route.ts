import { NextRequest, NextResponse } from 'next/server';

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'استوديو مفروش بالكامل بالقرب من جامعة أسيوط',
    description: 'استوديو مريح ومجهز بالكامل على بعد 5 دقائق سيرًا من البوابة الرئيسية لجامعة أسيوط. يشمل الإيجار فاتورة الكهرباء والمياه وإنترنت عالي السرعة.',
    listingMode: 'EntireUnit',
    price: 1800,
    currency: 'EGP',
    location: { address: 'شارع جامعة أسيوط، أسيوط', lat: 27.1783, lng: 31.1859, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Washing Machine', 'Kitchen', 'Water Included', 'Electricity Included'],
    gender: 'Male',
    images: [{ id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true }],
    rating: 4.7,
    reviewCount: 12,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 10, fullName: 'أحمد محمد علي', isVerified: true, memberSince: '2023-01-15', totalListings: 4, averageRating: 4.6 },
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 38,
    mlInsights: { predictedFairPrice: 1750, dealRating: 'Good', priceDifferencePercentage: 2.8 },
    status: 'APPROVED',
    isAvailable: true,
    canBook: true,
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'غرفة مشتركة في شقة بنات – بالقرب من كلية الطب',
    description: 'غرفة آمنة ومريحة في مبنى مخصص للبنات، على بعد 10 دقائق من كلية الطب جامعة أسيوط. جميع الفواتير مشمولة في الإيجار.',
    listingMode: 'Bed',
    price: 950,
    currency: 'EGP',
    location: { address: 'حي المحافظة، أسيوط', lat: 27.1808, lng: 31.1838, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Security Guard', 'Kitchen', 'Laundry Room'],
    gender: 'Female',
    images: [{ id: 2, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', isPrimary: true }],
    rating: 4.5,
    reviewCount: 8,
    availability: { totalCapacity: 4, occupiedSlots: 2, availableSlots: 2, isSoldOut: false },
    landlord: { id: 11, fullName: 'فاطمة إبراهيم حسن', isVerified: true, memberSince: '2022-06-10', totalListings: 2, averageRating: 4.5 },
    bedrooms: 2,
    bathrooms: 1,
    areaSqm: 75,
    mlInsights: { predictedFairPrice: 1000, dealRating: 'Excellent', priceDifferencePercentage: -5.0 },
    status: 'APPROVED',
    isAvailable: true,
    canBook: true,
    createdAt: '2024-08-15T08:00:00Z',
  },
  {
    id: 3,
    title: 'شقة 2 غرفة نوم فسيحة – منطقة الجامعة',
    description: 'شقة كبيرة مناسبة لطالبين مشتركين. قريبة من البوابة الشرقية لجامعة أسيوط. موقف سيارة خاص وأمن على مدار الساعة.',
    listingMode: 'EntireUnit',
    price: 2800,
    currency: 'EGP',
    location: { address: 'شارع الجامعة، أسيوط', lat: 27.1820, lng: 31.1890, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security Guard', 'Kitchen', 'Balcony'],
    gender: 'Male',
    images: [{ id: 3, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    rating: 4.2,
    reviewCount: 5,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 12, fullName: 'خالد عبد الرحمن', isVerified: true, memberSince: '2023-03-20', totalListings: 3, averageRating: 4.3 },
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 110,
    mlInsights: { predictedFairPrice: 3000, dealRating: 'Excellent', priceDifferencePercentage: -6.7 },
    status: 'APPROVED',
    isAvailable: true,
    canBook: true,
    createdAt: '2024-07-20T12:00:00Z',
  },
  {
    id: 4,
    title: 'غرفة مفردة – مبنى مختلط – بالقرب من كلية الهندسة',
    description: 'غرفة خاصة بسعر مناسب قريبة من كلية الهندسة جامعة أسيوط. حي هادئ، قريب من السوبر ماركت والصيدليات.',
    listingMode: 'Bed',
    price: 700,
    currency: 'EGP',
    location: { address: 'حي الضبعية، أسيوط', lat: 27.1756, lng: 31.1923, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen Access'],
    gender: 'Any',
    images: [],
    rating: 3.9,
    reviewCount: 3,
    availability: { totalCapacity: 3, occupiedSlots: 2, availableSlots: 1, isSoldOut: false },
    landlord: { id: 13, fullName: 'عمر بكر سيد', isVerified: false, memberSince: '2024-01-05', totalListings: 1, averageRating: 3.9 },
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 22,
    status: 'APPROVED',
    isAvailable: true,
    canBook: true,
    createdAt: '2024-10-01T09:00:00Z',
  },
  {
    id: 5,
    title: 'استوديو فاخر – قريب من كلية العلوم – مجهز بالكامل',
    description: 'استوديو راقي بأثاث وأجهزة متميزة. على بعد 5 دقائق من كلية العلوم جامعة أسيوط. المبنى يحتوي على صالة رياضية.',
    listingMode: 'EntireUnit',
    price: 3200,
    currency: 'EGP',
    location: { address: 'شارع الأربعين، أسيوط', lat: 27.1840, lng: 31.1800, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Parking', 'Security Guard', 'Kitchen', 'Dishwasher'],
    gender: 'Any',
    images: [{ id: 5, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isPrimary: true }],
    rating: 4.9,
    reviewCount: 20,
    availability: { totalCapacity: 1, occupiedSlots: 1, availableSlots: 0, isSoldOut: true },
    landlord: { id: 14, fullName: 'رانيا مصطفى كمال', isVerified: true, memberSince: '2021-11-01', totalListings: 8, averageRating: 4.8 },
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 55,
    mlInsights: { predictedFairPrice: 3100, dealRating: 'Good', priceDifferencePercentage: 3.2 },
    status: 'APPROVED',
    isAvailable: false,
    canBook: false,
    createdAt: '2024-05-10T14:00:00Z',
  },
  {
    id: 6,
    title: 'غرفة اقتصادية قريبة من كلية الزراعة',
    description: 'غرفة بسيطة ونظيفة للطلاب ذوي الميزانية المحدودة. على بعد دقائق سيرًا من كلية الزراعة جامعة أسيوط.',
    listingMode: 'Bed',
    price: 600,
    currency: 'EGP',
    location: { address: 'حي الحمراء، أسيوط', lat: 27.1765, lng: 31.1870, nearestUniversity: 'جامعة أسيوط' },
    amenities: ['WiFi', 'Air Conditioning', 'Shared Kitchen'],
    gender: 'Male',
    images: [{ id: 6, url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', isPrimary: true }],
    rating: 4.0,
    reviewCount: 6,
    availability: { totalCapacity: 5, occupiedSlots: 3, availableSlots: 2, isSoldOut: false },
    landlord: { id: 15, fullName: 'يوسف حمدان نصر', isVerified: true, memberSince: '2023-08-01', totalListings: 2, averageRating: 4.1 },
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 18,
    status: 'APPROVED',
    isAvailable: true,
    canBook: true,
    createdAt: '2024-09-15T11:00:00Z',
  },
];

function mockResponse(data: unknown) {
  return NextResponse.json({
    isSuccess: true,
    message: 'Success',
    data,
    errors: [],
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search')?.toLowerCase();
  const location = searchParams.get('location')?.toLowerCase();
  const gender = searchParams.get('gender');
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
  const rentalType = searchParams.get('rentalType');

  let results = [...MOCK_PROPERTIES];

  if (search) results = results.filter(p => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
  if (location) results = results.filter(p => p.location.address.toLowerCase().includes(location));
  if (gender && gender !== 'Any') results = results.filter(p => p.gender === gender || p.gender === 'Any');
  if (minPrice) results = results.filter(p => p.price >= minPrice);
  if (maxPrice) results = results.filter(p => p.price <= maxPrice);
  if (rentalType) results = results.filter(p => p.listingMode === rentalType);

  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const items = results.slice((page - 1) * pageSize, page * pageSize);

  return mockResponse({ items, page, pageSize, totalPages, totalCount, appliedFilters: {} });
}
