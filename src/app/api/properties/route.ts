import { NextRequest, NextResponse } from 'next/server';

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Studio Near King Abdulaziz University',
    description: 'A fully furnished studio apartment just 5 minutes walk from KAU main gate. Includes high-speed WiFi, water, and electricity bills.',
    listingMode: 'EntireUnit',
    price: 1800,
    currency: 'SAR',
    location: { address: 'Al Faisaliyah, Jeddah', lat: 21.5169, lng: 39.2192, nearestUniversity: 'King Abdulaziz University' },
    amenities: ['WiFi', 'Air Conditioning', 'Washing Machine', 'Kitchen', 'Water Included', 'Electricity Included'],
    gender: 'Male',
    images: [{ id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true }],
    rating: 4.7,
    reviewCount: 12,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 10, fullName: 'Ahmed Al-Rashidi', isVerified: true, memberSince: '2023-01-15', totalListings: 4, averageRating: 4.6 },
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
    title: 'Shared Room in Girls-Only Apartment – PSAU',
    description: 'Safe and comfortable shared room in a girls-only building, 10 minutes from Princess Nourah University. All bills included.',
    listingMode: 'Bed',
    price: 950,
    currency: 'SAR',
    location: { address: 'Al Yasmin, Riyadh', lat: 24.8029, lng: 46.6368, nearestUniversity: 'Princess Nourah bint Abdulrahman University' },
    amenities: ['WiFi', 'Air Conditioning', 'Security Guard', 'Kitchen', 'Laundry Room'],
    gender: 'Female',
    images: [{ id: 2, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', isPrimary: true }],
    rating: 4.5,
    reviewCount: 8,
    availability: { totalCapacity: 4, occupiedSlots: 2, availableSlots: 2, isSoldOut: false },
    landlord: { id: 11, fullName: 'Fatimah Al-Zahrani', isVerified: true, memberSince: '2022-06-10', totalListings: 2, averageRating: 4.5 },
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
    title: 'Spacious 2-Bedroom Apartment – KFUPM Area',
    description: 'Large apartment suitable for two students sharing. Close to KFUPM east gate. Private parking and 24/7 security.',
    listingMode: 'EntireUnit',
    price: 2800,
    currency: 'SAR',
    location: { address: 'Dhahran, Eastern Province', lat: 26.3075, lng: 50.1358, nearestUniversity: 'King Fahd University of Petroleum and Minerals' },
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security Guard', 'Kitchen', 'Balcony'],
    gender: 'Male',
    images: [{ id: 3, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    rating: 4.2,
    reviewCount: 5,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 12, fullName: 'Khalid Al-Otaibi', isVerified: true, memberSince: '2023-03-20', totalListings: 3, averageRating: 4.3 },
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
    title: 'Cozy Single Room – Mixed Building – UQU',
    description: 'Affordable private room near Umm Al-Qura University. Quiet neighborhood, close to supermarkets and pharmacies.',
    listingMode: 'Bed',
    price: 700,
    currency: 'SAR',
    location: { address: 'Al Aziziyah, Makkah', lat: 21.3891, lng: 39.8579, nearestUniversity: 'Umm Al-Qura University' },
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen Access'],
    gender: 'Any',
    images: [],
    rating: 3.9,
    reviewCount: 3,
    availability: { totalCapacity: 3, occupiedSlots: 2, availableSlots: 1, isSoldOut: false },
    landlord: { id: 13, fullName: 'Omar Bakr', isVerified: false, memberSince: '2024-01-05', totalListings: 1, averageRating: 3.9 },
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
    title: 'Luxury Studio – Near KSU – Fully Equipped',
    description: 'High-end studio with premium furniture and appliances. 5 minutes from King Saud University. Building has a gym and pool.',
    listingMode: 'EntireUnit',
    price: 3200,
    currency: 'SAR',
    location: { address: 'Al Malaz, Riyadh', lat: 24.6877, lng: 46.7219, nearestUniversity: 'King Saud University' },
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Pool', 'Parking', 'Security Guard', 'Kitchen', 'Dishwasher'],
    gender: 'Any',
    images: [{ id: 5, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isPrimary: true }],
    rating: 4.9,
    reviewCount: 20,
    availability: { totalCapacity: 1, occupiedSlots: 1, availableSlots: 0, isSoldOut: true },
    landlord: { id: 14, fullName: 'Rania Al-Saud', isVerified: true, memberSince: '2021-11-01', totalListings: 8, averageRating: 4.8 },
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
    title: 'Budget Room Near Taibah University',
    description: 'Simple and clean room for students on a budget. Walking distance from Taibah University north campus.',
    listingMode: 'Bed',
    price: 600,
    currency: 'SAR',
    location: { address: 'Al Mahattah, Madinah', lat: 24.4798, lng: 39.6127, nearestUniversity: 'Taibah University' },
    amenities: ['WiFi', 'Air Conditioning', 'Shared Kitchen'],
    gender: 'Male',
    images: [{ id: 6, url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', isPrimary: true }],
    rating: 4.0,
    reviewCount: 6,
    availability: { totalCapacity: 5, occupiedSlots: 3, availableSlots: 2, isSoldOut: false },
    landlord: { id: 15, fullName: 'Youssef Hamdan', isVerified: true, memberSince: '2023-08-01', totalListings: 2, averageRating: 4.1 },
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
