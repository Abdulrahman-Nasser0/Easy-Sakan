# API Documentation

This document provides comprehensive documentation for all API interactions in the Easy Sakan frontend application.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Laptop APIs](#laptop-apis)
- [Cart APIs](#cart-apis)
- [Authentication APIs](#authentication-apis)
- [Mock Data System](#mock-data-system)

---

## Overview

The API layer is centralized in `src/lib/api.ts` and provides a unified interface for both mock and real backend data.

### Base Configuration

```typescript
// src/lib/mock-data/config.ts
export const USE_MOCK_DATA = true; // Toggle mock/real mode

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 5000,
};
```

### Mode Switching

All API functions automatically switch between mock and real data based on `USE_MOCK_DATA`:

- **Mock Mode (`true`)**: Uses local mock data from `src/lib/mock-data/mockData.ts`
- **Real Mode (`false`)**: Makes HTTP requests to backend API

---

## Configuration

### Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# For production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

### Headers

All API requests include:
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // If token provided
}
```

---

## Response Format

All API functions return a standardized response structure:

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;    // Operation success status
  message: string;       // Human-readable message
  data: T;              // Response data (type varies)
  statusCode?: number;  // HTTP status code (real mode only)
}
```

### Success Response Example

```typescript
{
  isSuccess: true,
  message: "Laptops fetched successfully",
  data: {
    items: [...],
    currentPage: 1,
    pageSize: 12,
    totalCount: 50,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: false
  },
  statusCode: 200
}
```

### Error Response Example

```typescript
{
  isSuccess: false,
  message: "Failed to fetch laptops: Network error",
  data: null,
  statusCode: 500
}
```

---

## Error Handling

### Try-Catch Pattern

All API functions use try-catch for error handling:

```typescript
try {
  if (USE_MOCK_DATA) {
    // Mock data logic
    return {
      isSuccess: true,
      message: "Success",
      data: mockData
    };
  } else {
    // Real API call
    const response = await fetch(url);
    // Process response
  }
} catch (error) {
  return {
    isSuccess: false,
    message: error instanceof Error ? error.message : 'Unknown error',
    data: null
  };
}
```

### Error Types

| Error Type | Description | Example |
|------------|-------------|---------|
| Network Error | Failed to reach backend | `fetch failed` |
| Server Error | Backend returned 5xx | `Internal Server Error` |
| Client Error | Invalid request (4xx) | `Product not found` |
| Validation Error | Invalid data format | `Invalid product ID` |

---

## Laptop APIs

### Get Laptops (Paginated)

Fetches a paginated list of laptops.

**Function:**
```typescript
getLaptops(
  page: number,
  pageSize: number,
  token?: string
): Promise<ApiResponse<PaginatedResponse<Laptop>>>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | Yes | Page number (1-based) |
| pageSize | number | Yes | Items per page |
| token | string | No | JWT authentication token |

**Response Data:**
```typescript
interface PaginatedResponse<Laptop> {
  items: Laptop[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

**Example Usage:**
```typescript
import { getLaptops } from '@/lib/api';

const response = await getLaptops(1, 12, token);

if (response.isSuccess) {
  console.log('Laptops:', response.data.items);
  console.log('Total:', response.data.totalCount);
} else {
  console.error('Error:', response.message);
}
```

**Mock Endpoint:** Uses `getMockLaptops()` from `mockData.ts`

**Real Endpoint:** `GET /api/laptops?page={page}&pageSize={pageSize}`

---

### Get Laptop by ID

Fetches detailed information for a single laptop.

**Function:**
```typescript
getLaptopById(
  id: number,
  token?: string
): Promise<ApiResponse<Laptop>>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Laptop ID |
| token | string | No | JWT authentication token |

**Response Data:**
```typescript
interface Laptop {
  id: number;
  modelName: string;
  brandId: number;
  brandName: string;
  brandLogo: string;
  categoryId: number;
  categoryName: string;
  processorBrand: string;
  processorModel: string;
  graphicsCard: string;
  displaySize: number;
  displayResolution: string;
  basePrice: number;
  mainImage: string | null;
  variantCount: number;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  averageRating: number;
  reviewCount: number;
}
```

**Example Usage:**
```typescript
const response = await getLaptopById(1, token);

if (response.isSuccess) {
  const laptop = response.data;
  console.log('Model:', laptop.modelName);
  console.log('Brand:', laptop.brandName);
} else {
  console.error('Error:', response.message);
}
```

**Mock Endpoint:** Uses `getMockLaptopById()` from `mockData.ts`

**Real Endpoint:** `GET /api/laptops/{id}`

---

### Get Laptop Variants

Fetches available variants (configurations) for a specific laptop.

**Function:**
```typescript
getLaptopVariants(
  laptopId: number,
  page: number,
  pageSize: number,
  token?: string
): Promise<ApiResponse<PaginatedResponse<LaptopVariantDetailed>>>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| laptopId | number | Yes | Laptop ID |
| page | number | Yes | Page number (1-based) |
| pageSize | number | Yes | Items per page |
| token | string | No | JWT authentication token |

**Response Data:**
```typescript
interface LaptopVariantDetailed {
  id: number;
  sku: string;
  ram: number;                    // GB
  storage: number;                // GB
  storageType: string;            // 'SSD', 'HDD', 'NVMe'
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  discountAmount?: number;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  stockStatus: string;            // 'InStock', 'LowStock', 'OutOfStock'
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

**Example Usage:**
```typescript
const response = await getLaptopVariants(1, 1, 20, token);

if (response.isSuccess) {
  const variants = response.data.items;
  variants.forEach(variant => {
    console.log(`${variant.ram}GB RAM, ${variant.storage}GB ${variant.storageType}`);
    console.log(`Price: $${variant.currentPrice}`);
  });
}
```

**Mock Endpoint:** Uses `getMockLaptopVariants()` from `mockData.ts`

**Real Endpoint:** `GET /api/laptops/{laptopId}/variants?page={page}&pageSize={pageSize}`

---

## Cart APIs

### Get Cart

Retrieves the current user's shopping cart.

**Function:**
```typescript
getCart(token?: string): Promise<ApiResponse<CartData>>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | No | JWT authentication token |

**Response Data:**
```typescript
interface CartData {
  items: CartItem[];
  totalItems: number;              // Total quantity across all items
  subtotal: number;                // Sum of all item prices
  discount: number;                // Total discount amount
  tax: number;                     // Tax amount
  shipping: number;                // Shipping cost (0 = FREE)
  total: number;                   // Final amount
  appliedDiscountCode: string | null;
}

interface CartItem {
  id: number;                      // Cart item ID
  productType: string;             // 'LaptopVariant'
  productId: number;               // Variant ID
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;              // unitPrice * quantity
  stockAvailable: number;
  image: string;
  addedAt: string;                 // ISO timestamp
}
```

**Example Usage:**
```typescript
const response = await getCart(token);

if (response.isSuccess) {
  const cart = response.data;
  console.log('Items:', cart.totalItems);
  console.log('Total:', cart.total);
  cart.items.forEach(item => {
    console.log(`${item.productName} x ${item.quantity}`);
  });
}
```

**Mock Mode:** Uses `getClientCart()` from `clientCartStorage.ts` (localStorage)

**Real Endpoint:** `GET /api/cart`

---

### Add to Cart

Adds an item to the shopping cart.

**Function:**
```typescript
addToCart(
  request: AddToCartRequest,
  token?: string
): Promise<ApiResponse<AddToCartResponse>>
```

**Request Data:**
```typescript
interface AddToCartRequest {
  productId: number;               // Variant ID
  quantity: number;                // Quantity to add (default: 1)
}
```

**Response Data:**
```typescript
interface AddToCartResponse {
  id: number;                      // Cart item ID
  productType: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
  cartSummary: {
    totalItems: number;
    total: number;
  };
}
```

**Example Usage:**
```typescript
const request = {
  productId: 101,  // Variant ID
  quantity: 1
};

const response = await addToCart(request, token);

if (response.isSuccess) {
  console.log('Item added!');
  console.log('Cart now has:', response.data.cartSummary.totalItems, 'items');
} else {
  console.error('Failed:', response.message);
}
```

**Validation:**
- Quantity must be > 0
- Quantity must not exceed available stock
- Product must be active and in stock

**Mock Mode:** Uses `addClientCartItem()` from `clientCartStorage.ts`

**Real Endpoint:** `POST /api/cart/items`

---

### Update Cart Item

Updates the quantity of an item in the cart.

**Function:**
```typescript
updateCartItem(
  itemId: number,
  request: UpdateCartItemRequest,
  token?: string
): Promise<ApiResponse<CartItem>>
```

**Request Data:**
```typescript
interface UpdateCartItemRequest {
  quantity: number;                // New quantity
}
```

**Example Usage:**
```typescript
const request = {
  quantity: 3
};

const response = await updateCartItem(5, request, token);

if (response.isSuccess) {
  const item = response.data;
  console.log('Updated quantity:', item.quantity);
  console.log('New total:', item.totalPrice);
} else {
  console.error('Failed:', response.message);
}
```

**Validation:**
- Quantity must be > 0
- Quantity must not exceed available stock
- Cart item must exist

**Mock Mode:** Uses `updateClientCartItem()` from `clientCartStorage.ts`

**Real Endpoint:** `PUT /api/cart/items/{itemId}`

---

### Remove from Cart

Removes an item from the cart.

**Function:**
```typescript
removeCartItem(
  itemId: number,
  token?: string
): Promise<ApiResponse<{ removedItemId: number; cartSummary: CartSummary }>>
```

**Response Data:**
```typescript
{
  removedItemId: number;
  cartSummary: {
    totalItems: number;
    total: number;
  };
}
```

**Example Usage:**
```typescript
const response = await removeCartItem(5, token);

if (response.isSuccess) {
  console.log('Item removed!');
  console.log('Remaining items:', response.data.cartSummary.totalItems);
}
```

**Mock Mode:** Uses `removeClientCartItem()` from `clientCartStorage.ts`

**Real Endpoint:** `DELETE /api/cart/items/{itemId}`

---

### Clear Cart

Removes all items from the cart.

**Function:**
```typescript
clearCart(token?: string): Promise<ApiResponse<{ itemsRemoved: number; clearedAt: string }>>
```

**Response Data:**
```typescript
{
  itemsRemoved: number;           // Number of items removed
  clearedAt: string;              // ISO timestamp
}
```

**Example Usage:**
```typescript
const response = await clearCart(token);

if (response.isSuccess) {
  console.log('Cart cleared!');
  console.log('Removed:', response.data.itemsRemoved, 'items');
}
```

**Mock Mode:** Uses `clearClientCart()` from `clientCartStorage.ts`

**Real Endpoint:** `DELETE /api/cart`

---

## Authentication APIs

### Login

Authenticates a user and returns a session token.

**Server Action:**
```typescript
async function login(
  prevState: any,
  formData: FormData
): Promise<LoginState>
```

**Form Data:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;
```

**Example Usage:**
```tsx
// In component
import { login } from '@/lib/actions';
import { useFormState } from 'react-dom';

const [state, formAction] = useFormState(login, undefined);

<form action={formAction}>
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <button type="submit">Sign In</button>
</form>
```

**Real Endpoint:** `POST /api/auth/login`

---

### Sign Up

Creates a new user account.

**Server Action:**
```typescript
async function signup(
  prevState: any,
  formData: FormData
): Promise<SignUpState>
```

**Form Data:**
```typescript
{
  userName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

**Real Endpoint:** `POST /api/auth/signup`

---

### Logout

Ends the user session.

**Server Action:**
```typescript
async function logout(): Promise<void>
```

**Example Usage:**
```tsx
import { logout } from '@/lib/actions';

<form action={logout}>
  <button type="submit">Sign Out</button>
</form>
```

---

## Mock Data System

### Overview

The mock data system allows development without a backend by providing realistic test data stored locally.

### Configuration

**File:** `src/lib/mock-data/config.ts`

```typescript
export const USE_MOCK_DATA = true;  // Toggle mock mode
export const ITEMS_PER_PAGE = 12;   // Default page size
```

### Mock Data Storage

**File:** `src/lib/mock-data/mockData.ts`

Contains:
- 50+ mock laptops with various brands and configurations
- Hundreds of laptop variants
- Mock functions for all API operations

### Cart Storage (Mock Mode)

**File:** `src/lib/clientCartStorage.ts`

Cart data is stored in browser's localStorage with key `techzone_cart`.

**Storage Structure:**
```json
{
  "items": [
    {
      "id": 1234567890,
      "productType": "LaptopVariant",
      "productId": 101,
      "productName": "Dell XPS 15 - 16GB RAM, 512GB SSD",
      "sku": "DELL-XPS-15-16-512",
      "quantity": 2,
      "unitPrice": 1299.99,
      "discountAmount": 100,
      "totalPrice": 2599.98,
      "stockAvailable": 10,
      "image": "/laptops/dell-xps-15.jpg",
      "addedAt": "2025-11-23T10:30:00.000Z"
    }
  ]
}
```

### Mock Functions

#### Laptops

```typescript
// Get mock laptops
getMockLaptops(page: number, pageSize: number): PaginatedResponse<Laptop>

// Get single laptop
getMockLaptopById(id: number): Laptop | null

// Get laptop variants
getMockLaptopVariants(
  laptopId: number,
  page: number,
  pageSize: number
): VariantsResponse
```

#### Cart (localStorage)

```typescript
// Get cart from localStorage
getClientCart(): CartData

// Add item to cart
addClientCartItem(...params): AddToCartResponse

// Update cart item
updateClientCartItem(itemId: number, quantity: number): void

// Remove cart item
removeClientCartItem(itemId: number): RemoveResponse

// Clear cart
clearClientCart(): ClearResponse
```

### Benefits of Mock System

1. **Independent Development:** Work without backend dependency
2. **Fast Testing:** Instant data responses
3. **Offline Development:** No internet required
4. **Data Control:** Easily modify test data
5. **Easy Switching:** One flag toggles mock/real mode

---

## Best Practices

### Error Handling

Always handle errors gracefully:

```typescript
const response = await getLaptops(1, 12);

if (response.isSuccess) {
  // Success path
  setData(response.data);
} else {
  // Error path
  setError(response.message);
}
```

### Loading States

Show loading indicators during API calls:

```typescript
setLoading(true);
const response = await getLaptops(1, 12);
setLoading(false);

if (response.isSuccess) {
  setData(response.data);
}
```

### Token Management

Pass tokens from server actions or session:

```typescript
// In Server Component
const session = await getSession();
const response = await getLaptops(1, 12, session?.token);

// In Client Component
import { getSessionToken } from '@/lib/actions';

const token = await getSessionToken();
const response = await addToCart(request, token || undefined);
```

---

## Troubleshooting

### Common Issues

**Issue:** API calls return mock data in production

**Solution:** Set `USE_MOCK_DATA = false` in `config.ts`

---

**Issue:** "Failed to fetch" errors

**Solution:** 
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend is running
- Check CORS configuration on backend

---

**Issue:** Cart not persisting

**Solution:**
- In mock mode: Check browser localStorage is enabled
- In real mode: Verify authentication token is valid

---

**Issue:** Type errors with API responses

**Solution:** Ensure types in `src/lib/types.ts` match backend API responses

---

## Support

For API-related issues:
1. Check this documentation
2. Review `src/lib/api.ts` implementation
3. Check browser console for error messages
4. Verify environment variables
5. Test with mock mode first

---

**Last Updated:** November 23, 2025
