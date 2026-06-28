import { NextRequest, NextResponse } from 'next/server';

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Fully Furnished Studio Near Assiut University Main Gate',
    description: 'A comfortable and fully equipped studio apartment 5 minutes walk from the main gate of Assiut University. Rent includes electricity, water, and high-speed internet.',
    listingMode: 'EntireUnit',
    price: 1800,
    currency: 'EGP',
    location: { address: 'Assiut University St, Assiut', lat: 27.1783, lng: 31.1859, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Washing Machine', 'Kitchen', 'Water Included', 'Electricity Included'],
    gender: 'Male',
    images: [{ id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isPrimary: true }],
    rating: 4.7,
    reviewCount: 12,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 10, fullName: 'Ahmed Mohamed Ali', isVerified: true, memberSince: '2023-01-15', totalListings: 4, averageRating: 4.6 },
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
    title: 'Shared Room in Girls-Only Apartment – Near Faculty of Medicine',
    description: 'Safe and comfortable shared room in a girls-only building, 10 minutes from the Faculty of Medicine at Assiut University. All bills included. Female security staff on site 24/7.',
    listingMode: 'Bed',
    price: 950,
    currency: 'EGP',
    location: { address: 'Al Mohafza District, Assiut', lat: 27.1808, lng: 31.1838, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Security Guard', 'Kitchen', 'Laundry Room'],
    gender: 'Female',
    images: [{ id: 2, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', isPrimary: true }],
    rating: 4.5,
    reviewCount: 8,
    availability: { totalCapacity: 4, occupiedSlots: 2, availableSlots: 2, isSoldOut: false },
    landlord: { id: 11, fullName: 'Fatma Ibrahim Hassan', isVerified: true, memberSince: '2022-06-10', totalListings: 2, averageRating: 4.5 },
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
    title: 'Spacious 2-Bedroom Apartment – University Area',
    description: 'Large apartment ideal for two students sharing. Close to the east gate of Assiut University. Private parking and 24/7 security.',
    listingMode: 'EntireUnit',
    price: 2800,
    currency: 'EGP',
    location: { address: 'University St, Assiut', lat: 27.1820, lng: 31.1890, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security Guard', 'Kitchen', 'Balcony'],
    gender: 'Male',
    images: [{ id: 3, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isPrimary: true }],
    rating: 4.2,
    reviewCount: 5,
    availability: { totalCapacity: 1, occupiedSlots: 0, availableSlots: 1, isSoldOut: false },
    landlord: { id: 12, fullName: 'Khaled Abdel Rahman', isVerified: true, memberSince: '2023-03-20', totalListings: 3, averageRating: 4.3 },
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
    title: 'Private Room – Mixed Building – Near Faculty of Engineering',
    description: 'Affordable private room close to the Faculty of Engineering at Assiut University. Quiet neighborhood, near supermarkets and pharmacies.',
    listingMode: 'Bed',
    price: 700,
    currency: 'EGP',
    location: { address: 'Al Dab\'eya District, Assiut', lat: 27.1756, lng: 31.1923, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen Access'],
    gender: 'Any',
    images: [],
    rating: 3.9,
    reviewCount: 3,
    availability: { totalCapacity: 3, occupiedSlots: 2, availableSlots: 1, isSoldOut: false },
    landlord: { id: 13, fullName: 'Omar Bakr Sayed', isVerified: false, memberSince: '2024-01-05', totalListings: 1, averageRating: 3.9 },
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
    title: 'Luxury Studio – Near Faculty of Science – Fully Equipped',
    description: 'High-end studio with premium furniture and appliances. 5 minutes from the Faculty of Science at Assiut University. Building includes a gym.',
    listingMode: 'EntireUnit',
    price: 3200,
    currency: 'EGP',
    location: { address: 'Al Arba\'een St, Assiut', lat: 27.1840, lng: 31.1800, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Parking', 'Security Guard', 'Kitchen', 'Dishwasher'],
    gender: 'Any',
    images: [{ id: 5, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isPrimary: true }],
    rating: 4.9,
    reviewCount: 20,
    availability: { totalCapacity: 1, occupiedSlots: 1, availableSlots: 0, isSoldOut: true },
    landlord: { id: 14, fullName: 'Rania Mostafa Kamal', isVerified: true, memberSince: '2021-11-01', totalListings: 8, averageRating: 4.8 },
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
    title: 'Budget Room Near Faculty of Agriculture',
    description: 'Simple and clean room for students on a budget. A few minutes walk from the Faculty of Agriculture at Assiut University.',
    listingMode: 'Bed',
    price: 600,
    currency: 'EGP',
    location: { address: 'Al Hamra District, Assiut', lat: 27.1765, lng: 31.1870, nearestUniversity: 'Assiut University' },
    amenities: ['WiFi', 'Air Conditioning', 'Shared Kitchen'],
    gender: 'Male',
    images: [{ id: 6, url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', isPrimary: true }],
    rating: 4.0,
    reviewCount: 6,
    availability: { totalCapacity: 5, occupiedSlots: 3, availableSlots: 2, isSoldOut: false },
    landlord: { id: 15, fullName: 'Youssef Hamdan Nasr', isVerified: true, memberSince: '2023-08-01', totalListings: 2, averageRating: 4.1 },
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
